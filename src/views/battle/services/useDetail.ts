import { useBattleQueue } from "./useBattleQueue";
import { processImageUrl } from "@/utils";
import { onBeforeMount, ref, computed, reactive, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

import BattleService from "@/services/BattleService";
import { useStore } from "@/store";
import { emitter } from "@/libs";
import { MessageAction, SkinItem } from "@/types";
import TopService from "@/services/TopService";
import BoxService from "@/services/BoxService";
import { processRobot } from "../util";
import { useJoinRoom } from "./useJoinRoom";
import { ElContainer, ElLoading, ElMessage, ElMessageBox } from "element-plus";

import { useBattleEvents } from "./useBattleEvents";

export interface BattleUserInfo {
  avatar: string;
  created_at: number;
  id: number;
  nickname: string;
  role: number;
  room_id: number;
  seat_no: number;
  updated_at: number;
  user_id: number;
  winner: number;
}

export interface BattleRoomInfo {
  avatar: string;
  created_at: number;
  end_time: number;
  expire_time: number;
  id: number;
  nickname: string;
  num: number;
  price: number;
  prize_price: number;
  room_no: string;
  room_type: number;
  rounds: number;
  start_time: number;
  status: number;
  updated_at: number;
  user_id: number;
}

export interface BattleRecord {
  box_id: number;
  created_at: number;
  exterior_name: string;
  id: number;
  point: number;
  real_point: number;
  room_id: number;
  rounds: number;
  show_point: number;
  skin_id: number;
  skin_img: string;
  skin_name: string;
  skin_price: number;
  updated_at: number;
  user_id: number;
}

export interface BattleBox {
  box_id: number;
  box_img: string;
  box_name: string;
  box_price: number;
  created_at: number;
  id: number;
  room_id: number;
  rounds: number;
  status: number;
  updated_at: number;
}

export interface BattleRoomDetail {
  boxs: BattleBox[];
  records: BattleRecord[];
  room: BattleRoomInfo;
  users: BattleUserInfo[];
}

export interface BattleAward {
  skin_id: number;
  skin_img: string;
  skin_name: string;
  skin_price: number;
}

type BoxsSkin = Record<string | number, SkinItem[]>;

export enum UserBattleRole {
  Owner = 0,
  Participant = 1,
  Audience = 2,
  Tourist = 3,
}

export const useBattleRoomDetail = (params: {
  onRound: BattleEventHandler<BattleRoundData>;
  onEnd: BattleEventHandler<BattleRoundData>;
}) => {
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  const joinRoomMethod = useJoinRoom();

  const isOpenSound = ref(true);

  const { id } = route.params;

  const loading = reactive({
    detail: false,
    join: false,
  });

  const detail = ref<BattleRoomDetail>();
  const comfortAward = ref<BattleAward>();
  const { getPageData, getRoomDetail } = usePageData(id as string);

  const { enqueue } = useBattleQueue({
    roomDetail: detail as any,
    getRoomDetail,
    onRound: params.onRound,
    onEnd: params.onEnd,
    isOpenSound,
    getUserAwards: (roomDetail) => {

      const userInfo = store.getters.userInfo;
      if (!userInfo) return [];

      const blocks = formatBattleBlocks(roomDetail);

      const block = blocks.find(
        (block) => block.user?.user_id === userInfo.user_id
      );
      if (!block) return [];

      const awards = block.user?.winner === 1 || block.user?.winner === 2
        ? block.awards
        : [comfortAward.value!];
    
        // 补数据 缺少背包id
      return awards.map(item => ({
        image_url: item.skin_img,
        item_name: item.skin_name,
        item_id: item.skin_id,
        price: item.skin_price,
        user_id: userInfo.user_id
      }))
    },
  });

  const fetch = () => {
    loading.detail = true;
    // const loadingService = ElLoading.service({
    //   fullscreen: true,
    // });

    return getPageData()
      .then((response) => {
        const { room, users } = response.detail;

        if (room.status === -1) {
          ElMessage.warning("房间不存在");
          router.replace("/battle");
          return;
        }

        detail.value = response.detail;
        skinsMap.value = response.skins;
        // console.log('response',response)
        comfortAward.value = skin2award(response.comfortSkin);

        return response;
      })
      .finally(() => {
        loading.detail = false;
        // loadingService.close();
      });
  };

  const { register, unregister } = useBattleEvents(
    {
      onJoin: (data) => {
        data.avatar = processImageUrl(data.avatar);
        detail.value?.users.push(data);
      },
      onStart: (data) => {
        const roomDetail = detail.value!;
        detail.value!.records = roomDetail.records || [];
        roomDetail.room.status = data.status;

        if (roomDetail.users.length !== roomDetail.room.num) {
          getRoomDetail().then((response) => {
            detail.value!.users = response.users.sort((a, b) =>
              a.seat_no > b.seat_no ? 1 : a.seat_no < b.seat_no ? -1 : 0
            );
          });
        }
      },
      onRound: enqueue,
      onEnd: enqueue,
      onTimeout: (data) => {
        detail.value!.room.status = data.status;

        ElMessageBox.confirm("房间已超时", "提示", {
          showCancelButton: false,
          customClass: "custom-message-box",
          lockScroll: false,
        }).finally(() => {
          router.replace("/battle");
        });
      },
    },
    Number(id)
  );

  const skinsMap = ref<BoxsSkin>({});

  onBeforeMount(() => {
    fetch().then((response) => {
      register();
      // mock(Number(id));
      // mockTimeout(response.detail);
    });
  });

  onBeforeUnmount(() => {
    unregister();
  });

  const joinRoom = (seat_no: number, isRobot: boolean) => {
    loading.join = true;

    return joinRoomMethod(
      detail.value!.room.id,
      seat_no,
      detail.value!.room.price,
      isRobot
    ).finally(() => {
      loading.join = false;
    });
  };

  const userRole = computed(() => {
    // 房主、参加者、已登录未加入(观众)、未登录(游客)
    const userInfo = store.getters.userInfo;

    // 游客
    if (!userInfo) return UserBattleRole.Tourist;
    const user = detail.value?.users.find(
      (user) => user.user_id === userInfo.user_id
    );

    // 观众
    if (!user) return UserBattleRole.Audience;

    return user.seat_no === 1
      ? UserBattleRole.Owner
      : UserBattleRole.Participant;
  });

  const round = computed(() => {
    const records = detail.value?.records;

    if (!records || !records.length) {
      return 0;
    }

    return records.slice(-1)[0].rounds;
  });

  const formatBattleBlocks = (roomDetail: BattleRoomDetail) => {
    const { users, room, records } = roomDetail;

    // 根据座位数生成对应大小的数组块
    return new Array(room.num).fill(0).map((_, i) => {
      const number = i + 1;
      const user = users.find((item) => item.seat_no === number);

      // 所展示的饰品
      let blockRecords: BattleRecord[] = [];

      if (user) {
        if (records) {
          blockRecords = records.filter(
            (record) => record.user_id === user.user_id
          );
        }

        if (room.status === 2) {
          const winners = users.filter((user) => user.winner >= 1);
          if (winners.length === 1 && user.user_id === winners[0].user_id) {
            // 非平局情况下
            // 得到对战结果后饰品集中到赢家的块中
            blockRecords = blockRecords.concat(
              records.filter((record) => record.user_id !== user.user_id)
            );
          }
        }
      }

      return {
        key: user ? user.user_id : Math.random().toString(16),
        user,
        awards: blockRecords.map(record2award),
        records,
      };
    });
  };

  // 每一列(玩家)的相关数据
  const blocks = computed(() => {
    if (!detail.value) return [];
    return formatBattleBlocks(detail.value);
  });

  const skinList = computed(() => {
    const index = round.value - 1;
    const box = detail.value?.boxs[index];
    return skinsMap.value[box?.box_id || -1] || [];
  });

  return {
    loading,
    detail: computed(() => {
      detail.value?.users.forEach(processRobot);
      return detail.value;
    }),
    hasRobot: computed(() => {
      return !!detail.value?.users.find((user) => user.user_id === 0);
      // return true;
    }),
    joinRoom,
    round,
    blocks,
    skinList,
    userRole,
    comfortAward,
    isOpenSound,
  };
};

type BattleEventHandler<T = any> = (data: T) => Promise<void>;

export interface BattleRoundData {
  battle_record: BattleRecord[];
  battle_room: BattleRoomInfo;
}

export interface BattleEndData extends BattleRoundData {
  winners: number[];
  backpacks: any[];
}

const getBoxsSkins = (ids: number[]) => {
  ids = Array.from(new Set(ids));

  return BoxService.boxsSkins(ids).then((response) => {
    return response.data.data.list.reduce((map, skin) => {
      const { box_id } = skin;
      if (!map[box_id]) {
        map[box_id] = [];
      }
      map[box_id].push(skin);

      return map;
    }, {} as BoxsSkin);
  });
};

const usePageData = (id: string) => {
  const getRoomDetail = () => {
    return BattleService.roomDetail(id).then((response) => {
      const value = response.data.data as BattleRoomDetail;

      value.boxs = value.boxs.map((box) => ({
        ...box,
        box_img: processImageUrl(box.box_img),
        box_cover: processImageUrl(box.box_cover),
      }));

      value.room = Object.assign({}, value.room, {
        avatar: processImageUrl(value.room.avatar),
      });

      value.users = value.users.map((user) => ({
        ...user,
        avatar: processImageUrl(user.avatar),
      }));

      return value;
    });
  };

  return {
    getPageData: () => {
      const baseInfo = getRoomDetail().then((detail) => {
        return getBoxsSkins(detail.boxs.map((box) => box.box_id)).then(
          (skins) => ({
            detail,
            skins,
          })
        );
      });

      return Promise.all([baseInfo, getComfortSkin()]).then((response) => {
        return {
          ...response[0],
          comfortSkin: response[1],
        };
      });
    },

    getRoomDetail,
  };
};

const getComfortSkinId = (): Promise<number> => {
  return TopService.getConfig("battle_comfort_skin_id").then((response) => {
    return Number(response.data.data.value);
  });
};

const getComfortSkin = async (): Promise<SkinItem> => {
  const skinId = await getComfortSkinId();
  const result = await TopService.getSkinDetail(skinId);
  return result.data.data;
};

const skin2award = (skin: SkinItem): BattleAward => {
  const { id, image_url, item_name, price } = skin;

  return {
    skin_id: id,
    skin_img: image_url,
    skin_name: item_name,
    skin_price: price,
  } as BattleRecord;
};

const record2award = (record: BattleRecord): BattleAward => {
  const { skin_id, skin_img, skin_name, skin_price, exterior_name, skin_color } = record;
  // console.log('record',record)

  return {
    skin_id,
    skin_img,
    skin_name,
    skin_price,
    exterior_name,
    skin_color,
  };
};

const mock = (id: number) => {
  setInterval(() => {
    emitter.emit(MessageAction.BattleRounds, {
      battle_record: [
        {
          id,
          created_at: 1654570993,
          updated_at: 1654570993,
          room_id: 442,
          user_id: 9,
          rounds: 1,
          box_id: 53,
          skin_id: 789,
          skin_name: "格洛克 18 型 | 锈蚀烈焰 (久经沙场)",
          skin_img:
            "https://game-aesy.c5game.com/steam/730/d0dbcd647de9965f9bab6be20945bc45.png?x-oss-process=image/resize,w_480,h_360",
          skin_price: 0.65,
          exterior_name: "久经沙场",
          real_point: 28900,
          show_point: 11561,
          point: 11561,
        },
        {
          id,
          created_at: 1654570993,
          updated_at: 1654570993,
          room_id: 442,
          user_id: 0,
          rounds: 1,
          box_id: 53,
          skin_id: 408,
          skin_name: "AWP | 狩猎网格 (久经沙场)",
          skin_img:
            "https://game-aesy.c5game.com/steam/730/194f1fdd3b5b73c3866ed4efaef8218f.png?x-oss-process=image/resize,w_480,h_360",
          skin_price: 0.65,
          exterior_name: "久经沙场",
          real_point: 34717,
          show_point: 31561,
          point: 31561,
        },
      ],
      battle_room: {
        id,
        created_at: 1654570989,
        updated_at: 1654570989,
        room_no: "321967313869864960",
        room_type: 0,
        user_id: 9,
        num: 2,
        price: 21.25,
        prize_price: 1640.37,
        rounds: 1,
        expire_time: 1654574589,
        start_time: 0,
        end_time: 0,
        status: 1,
      },
    });
  }, 6000);
};

const mockTimeout = (data: BattleRoomDetail) => {
  setTimeout(() => {
    console.log("TIMEOUT!!!", data.room);

    emitter.emit(MessageAction.BattleTimeout, {
      ...data.room,
      status: -1,
    });
  }, 2000);
};
