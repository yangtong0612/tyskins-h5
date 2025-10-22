import { toRef, onBeforeUnmount, ref } from "vue";

import type { Ref } from "vue";
import type {
  BattleEndData,
  BattleRecord,
  BattleRoomDetail,
  BattleRoundData,
} from "./useDetail";
import { sleep } from "@/utils";
import { BattleAward } from "./useDetail";

export const useBattleQueue = (body: {
  getRoomDetail: () => Promise<BattleRoomDetail>;
  getUserAwards: (roomDetail: BattleRoomDetail) => BattleAward[];
  onRound: (data: BattleRoundData) => Promise<void>;
  onEnd: (data: BattleEndData) => Promise<void>;
  roomDetail: Ref<BattleRoomDetail>;
  isOpenSound: Ref<boolean>;
}) => {
  const { roomDetail, getRoomDetail, getUserAwards, isOpenSound, onRound, onEnd } = body;

  // 初始化对战音效相关资源
  const battleScrollAudio = new Audio("/media/battle-scroll.mp3");
  const battleEndAudio = new Audio("/media/battle-end.mp3");

  let queue: BattleRoundData[] = [];
  let battleResult: BattleEndData;

  const getCurrentRound = () => {
    let currentRound = 0;
    const lastRecord = roomDetail.value.records.slice(-1)[0];
    if (lastRecord) {
      currentRound = lastRecord.rounds;
    }
    return currentRound;
  };

  /**
   * 补充当前回合后的所有对战记录
   * 或者补充对战结果
   */
  const addBattleRecords = (onlyAddBattleResult: boolean) => {
    return getRoomDetail().then((response) => {
      if (onlyAddBattleResult) {
        const winners = response.users
          .filter((user) => user.winner >= 1)
          .map((user) => user.user_id);

        if (winners.length) {
          battleResult = {
            battle_record: response.records,
            battle_room: response.room,
            winners,
            backpacks: getUserAwards(response),
          };

          console.log("已经补充", battleResult);

        } else {
          console.log("对战结果补充失败: 没有找到赢家", response);
        }
        return;
      }

      const currentRound = getCurrentRound();

      // 存储要添加到队列中的对战记录
      const battleRoundList: Array<BattleRoundData | BattleEndData> = [];
      // 存储某个回合内的对战记录
      let battleRecords: BattleRecord[] = [];

      const handleAddRound = () => {
        if (battleRecords.length) {
          const data = {
            battle_record: battleRecords,
            battle_room: response.room,
          };

          battleRoundList.push(data);
          battleRecords = [];
        }
      };

      response.records
        // 收集需要播放的对战记录
        .filter((record) => record.rounds > currentRound)
        .forEach((record) => {
          if (battleRecords.length) {
            if (battleRecords[0].rounds !== record.rounds) {
              handleAddRound();
            }
          }

          battleRecords.push(record);
        });

      handleAddRound();

      if (battleRoundList.length) {
        queue = battleRoundList.slice();
        console.log("补充了", battleRoundList.length, "条对战记录");
      } else {
        console.warn("对战记录没有补充");
      }
    });
  };

  // 当前对战是否结束
  let isOver = false;
  // 队列锁定状态
  let isLocked = false;
  // 设置网络延迟的定时器
  let networkDelayMarkerTimer = -1;
  // 超过这个时间表示网络延迟
  let roundBattleTimeout = 1000;
  // 当前是否还在对战页面
  let isLive = true;
  // 音乐是否播放完毕, 用于对战记录堆积时尽可能保证音乐播放完毕后再播放下一个对战
  let isMusicFinished = true;
  // 是否显示网络延迟提醒
  const networkDelay = ref(false);

  const dequeue = () => {
    if (isOver || isLocked || !isLive || !isMusicFinished) {
      return;
    }

    const totalRounds = roomDetail.value.room.rounds;

    // 获取当前回合
    const currentRound = getCurrentRound();

    const handleAddBattleRecords = (onlyAddBattleResult = false) => {
      // if (!onlyAddBattleResult) {
      //   console.log("开始补充对战记录", currentRound + 1, "-", totalRounds);
      // } else {
      //   console.log("开始补充对战结果");
      // }

      return addBattleRecords(onlyAddBattleResult)
        .catch((err) => {
          // 获取房间数据失败，进行重试
          console.log(
            onlyAddBattleResult ? "补充对战结果失败" : "补充对战记录失败",
            err
          );
          isLocked = false;
          if (!navigator.onLine) {
            return sleep(2000);
          }
        })
        .finally(() => dequeue());
    };

    if (currentRound === totalRounds) {
      // 对战已结束，播放对战结果
      if (battleResult) {
        onBattleEnd();
        return;
      }
      // 没有对战结果数据，开始进行补充
      //handleAddBattleRecords(true);
      return;
    }

    const data = queue.shift();
    if (!data) {
      // 当前对战回合不等于总回合就表示需要补充
      // handleAddBattleRecords();
      return;
    }

    isLocked = true;
    clearTimeout(networkDelayMarkerTimer);
    networkDelay.value = false;
    console.log("当前回合", currentRound);

    // 对战回合
    networkDelayMarkerTimer = setTimeout(() => {
      networkDelay.value = true;
    }, roundBattleTimeout);

    const battleRound = data.battle_record[0].rounds;
    if (currentRound) {
      if (battleRound <= currentRound) {
        console.log("冗余数据，丢弃");
        isLocked = false;
        dequeue();
        return;
      }

      if (battleRound - currentRound !== 1) {
        networkDelay.value = true;
        clearTimeout(roundBattleTimeout);

        // 补充对战回合记录
        handleAddBattleRecords();
        return;
      }
    }

    const { room, records } = roomDetail.value;
    if (room.status !== 1) {
      room.status = 1;
    }

    records.push(...data.battle_record);
    onRound(data).finally(() => {
      isLocked = false;
      dequeue();
    });

    if (isOpenSound.value) {
      isMusicFinished = false;
      battleScrollAudio.currentTime = 0;
      battleScrollAudio.play();

      const timer = setTimeout(() => {
        // 避免因为未知原因导致的播放状态无法重置
        isMusicFinished = true;
        dequeue();
      }, battleScrollAudio.duration);

      battleScrollAudio.onended = () => {
        clearTimeout(timer);
        isMusicFinished = true;
        dequeue();
      };
    }
  };

  const onBattleEnd = () => {
    // 对战结束
    const _detail = roomDetail.value;
    const data = battleResult;
    isOver = true;

    _detail.records = data.battle_record;
    _detail.room.status = data.battle_room.status;

    const { winners } = data as BattleEndData;

    _detail.users.forEach((user) => {
      if (winners.includes(user.user_id)) {
        user.winner = winners.length === 2 ? 2 : 1;
      }
    });

    onEnd(data as BattleEndData);
    if (isOpenSound.value) {
      battleEndAudio.play();
    }
  };

  onBeforeUnmount(() => {
    isLive = false;
  });

  let receiveMessage = true;

  // 上线前删除
  // @ts-ignore
  // window.setBattleFlag = (flag: boolean) => receiveMessage = flag;

  return {
    enqueue: (data: BattleRoundData | BattleEndData) => {
      if (receiveMessage) {
        if (data.hasOwnProperty("winners")) {
          battleResult = data as BattleEndData;
          console.log('battleResult', battleResult)
        } else {
          console.log('queue.push(data)', data)
          queue.push(data);
        }
      }
      dequeue();
    },
    networkDelay,
  };
};
