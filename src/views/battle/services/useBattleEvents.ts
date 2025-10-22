import { emitter } from "@/libs";
import { useStore } from "@/store";
import { MessageAction } from "@/types";
import type { BattleRoomListItem } from "./useBattleList";
import type { BattleBox, BattleEndData, BattleRoomInfo, BattleRoundData, BattleUserInfo } from "./useDetail";

type BattleEventHandler<T = any> = (data: T) => void;

export const useBattleEvents = (handler: {
  onJoin?: BattleEventHandler<BattleUserInfo>;
  onStart?: BattleEventHandler<BattleRoomInfo>;
  onRound?: BattleEventHandler<BattleRoundData>;
  onEnd?: BattleEventHandler<BattleEndData>;
  onCreateRoom?: BattleEventHandler<BattleRoomListItem>
  onTimeout?: BattleEventHandler<BattleRoomInfo>
}, roomId?: number) => {
  const store = useStore();

  const updateUserInfo = (id: number) => {
    if (store.getters.userInfo?.user_id !== id) return;
    store.dispatch("getUserInfo");
  }

  const callback = (room_id: number, callback: (...args: any[]) => any) => {
    if (roomId) {
      if (roomId === room_id) {
        callback();
      }
    } else {
      callback();
    }
  }

  const events = [
    {
      event: MessageAction.BattleNewRoom,
      handler: (data: {
        boxs: BattleBox[];
        room: BattleRoomInfo;
        users: BattleUserInfo[];
      }) => {
        const { boxs, room, users } = data;
        const { id, user_id } = room;
        updateUserInfo(user_id);
        callback(id, () => {
          handler.onCreateRoom && handler.onCreateRoom({
            box: boxs,
            users,
            ...room,
          })
        })
      }
    },
    {
      event: MessageAction.BattleJoin,
      handler: (data: BattleUserInfo) => {
        const { room_id, user_id } = data;
        updateUserInfo(user_id);
        callback(room_id, () => {
          handler.onJoin && handler.onJoin(data);
        })
      }
    },
    {
      event: MessageAction.BattleStart,
      handler: (data: BattleRoomInfo) => {
        const { id } = data;
        callback(id, () => {
          handler.onStart && handler.onStart(data);
        })
      },
    },
    {
      event: MessageAction.BattleRounds,
      handler: (data: BattleRoundData) => {
        const { battle_room } = data;
        callback(battle_room.id, () => {
          handler.onRound && handler.onRound(data);
        })
      }
    },
    {
      event: MessageAction.BattleEnd,
      handler: (data: BattleEndData) => {
        const { battle_room, battle_record } = data;
        const record = battle_record.find(item => item.user_id === store.getters.userInfo?.user_id);
        updateUserInfo(record?.user_id || -1);
        callback(battle_room.id, () => {
          handler.onEnd && handler.onEnd(data);
        })
      }
    },
    {
      event: MessageAction.BattleTimeout,
      handler: (data: BattleRoomInfo) => {
        callback(data.id, () => {
          handler.onTimeout && handler.onTimeout(data);
        })
      }
    }
  ]

  return {
    register: () => {
      // emitter.all.clear()
      events.forEach(e => {
        // @ts-ignore
        emitter.on(e.event, e.handler);
      })
    },
    unregister: () => {
      events.forEach(e => {
        // @ts-ignore
        emitter.off(e.event, e.handler);
      })
    },
  }
}
