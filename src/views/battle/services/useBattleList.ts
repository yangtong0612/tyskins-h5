import BattleService from "@/services/BattleService";
import { useStore } from "@/store";
import { formatTime, processImageUrl } from "@/utils";
import { reactive, onBeforeMount, toRefs, onBeforeUnmount, ref, computed } from "vue";
import { processRobot } from "../util";
import { useBattleEvents } from "./useBattleEvents";

import type { BattleUserInfo } from "./useDetail";

export interface BattleRoomListItem {
  avatar: string;
  box: {
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
  }[];
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
  users: BattleUserInfo[];
}

export interface ScoreRunkItem {
  avatar: string;
  integral: number;
  nickname: string;
  user_id: number;
}



export const useBattleList = () => {

  const roomList = ref<BattleRoomListItem[]>([]);

  const state = reactive({
    roomList: computed(() => {
      const list = roomList.value;

      const normalRooms = list.filter(item => item.status !== 2);
      const endedRooms = list.filter(item => item.status === 2);

      return normalRooms.concat(endedRooms).filter(room => room.status > -1);
    }),
    loading: false,
  });
  const store = useStore();

  const findRoom = (roomId: number) => state.roomList.find(room => room.id === roomId);


  const { register, unregister } = useBattleEvents({
    onCreateRoom(data) {
      data.users = data.users.map(user => ({
        ...user,
        avatar: processImageUrl(user.avatar),
      }))
      data.box = data.box.map(item => ({
        ...item,
        box_img: processImageUrl(item.box_img),
      }))
      roomList.value.unshift(data);
    },

    onJoin(data) {
      data.avatar = processImageUrl(data.avatar);
      data = processRobot(data);

      const { room_id } = data;
      const room = findRoom(room_id);
      if (room) {
        if (data.seat_no === 1) {
          return;
        }
        room.users.push(data);
      }
    },

    onStart(data) {
      const { id, status } = data;
      const room = findRoom(id);
      if (room) {
        room.status = status;
      }
    },

    onEnd(data) {
      const { battle_room, winners } = data;
      const { id, status } = battle_room;
      const room = findRoom(id);

      if (room) {
        room.status = status;
        
        const val = winners.length === 2 ? 2 : 1;

        room.users.forEach(user => {
          if (winners.includes(user.user_id)) {
            user.winner = val;
          }
        })
      }

      getBattleRunking();
    },

    onTimeout(data) {
      const { id, status } = data;
      const room = findRoom(id);
      if (room) {
        room.status = status;
      }

      store.dispatch("getUserInfo");
    }
  });

  const getRoomList = (status?: number) => {
    state.loading = true;

    return BattleService.roomList({
      page: 1,
      page_size: 36,
      status,
    }).then((response) => {
      roomList.value = (response.data.data.list || []).filter(item => item.status !== -1).map(item => ({
        ...item,
        box: item.box.map(item => ({
          ...item,
          box_img: processImageUrl(item.box_img),
        })),
        users: item.users.map(item => processRobot({
          ...item,
          avatar: processImageUrl(item.avatar),
        }))
      }));
    }).finally(() => {
      state.loading = false;
    });
  };

  onBeforeMount((() => {
    getRoomList().then(() => {
      register();
    });
  
    
  }));

  onBeforeUnmount(() => {
    unregister();
  })

  return {
    ...toRefs(state),
    getRoomList,
  }
}

export const useBattleTop = () => {
  const state = reactive({
    topThreeScoresYesterday: [] as ScoreRunkItem[],
    runking: [] as ScoreRunkItem[],
  });
  const store = useStore();



  let lastFetchBattleRunkingTime = -1;

  const getBattleRunking = () => {
    const now = lastFetchBattleRunkingTime = Date.now();
    return getRunking().then(response => {
      if (lastFetchBattleRunkingTime === now || !state.runking.length) {
        state.runking = response;
      }
    })
  }

  const getBattleTopThreeScoresYesterday = () => {
    return getTopThreeScoresYesterday().then(response => {
      const [top1, top2, top3] = response;
      state.topThreeScoresYesterday = [top2, top1, top3].filter(Boolean);
    })
  }


  onBeforeMount(()=>{
    getBattleRunking();
    getBattleTopThreeScoresYesterday();
  })

  return {
    ...toRefs(state),
  }
}


const getTopThreeScoresYesterday = () => {
  const time = new Date();
  time.setDate(time.getDate() - 1);
  const date = formatTime(time) + "T00:00:00Z";

  return BattleService.runking({
    date,
    size: 3
  }).then((response) => {
    return (response.data.data.list || []).map(processRunkItem);
  })
}

const getRunking = () => {
  const date = formatTime(new Date()) + "T00:00:00Z";

  return BattleService.runking({
    date,
    size: 15
  }).then((response) => {
    return (response.data.data.list || []).map(processRunkItem);
  })
}

const processRunkItem = (data: ScoreRunkItem) => {
  return {
    ...data,
    avatar: processImageUrl(data.avatar),
  }
}
