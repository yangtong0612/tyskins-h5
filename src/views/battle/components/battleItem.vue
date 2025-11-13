<template>
  <div class="battel-item" :class="setItemBg(detail.status)">
    <!-- 顶部标题区 -->
    <div class="item-header">
      <div class="title-wrap">
        <span class="battle-type">{{ detail.type_text }}</span>
        <span class="battle-tag">{{ detail.tag }}</span>
        <span class="battle-prize">{{ detail.prize_text }}</span>
      </div>
      <span class="rounds">{{ detail.rounds }}轮</span>
    </div>

    <!-- 玩家区 -->
    <div class="users-wrap">
      <div v-for="(user, i) in seats" :key="i" class="user-item">
        <template v-if="user.anyone">
          <div v-if="user.winner" class="user-winner">
            <img :src="user.avatar" alt="" />
          </div>
          <img v-else :src="user.avatar" alt="" />
        </template>
        <template v-else>
          <v-avatar size="40">
            <img
              @click="handleClickButton(user.senoNumber)"
              src="@/assets/img/bos/add.png"
              alt=""
            />
          </v-avatar>
        </template>
      </div>
    </div>

    <!-- 奖励区 -->
    <div class="rewards-wrap">
      <div v-for="skin in detail.box" :key="skin.id" class="reward-item">
        <img class="cover" :src="processImageUrl(skin.box_cover)" alt="" />
        <img class="icon" :src="skin.box_img" alt="" />
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="action-wrap">
      <div class="price-wrap">
        <img src="@/assets/img/bos/douzi.svg" alt="" />
        <span class="text-yellow fs14 ml-2">{{ detail.price.toFixed(2) }}</span>
      </div>
      <v-btn
        style="border-radius: 6px"
        @click="handleToBattleDetail(detail)"
        :color="getBtnColor"
        elevation="0"
        width="100"
        height="32"
      >
        <span class="text-white">{{ buttonText }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onMounted, computed } from "vue";
import BattleService from "@/services/BattleService";
import { processImageUrl } from "@/utils";
import { processRobot, status2str, processScore } from "@/views/battle/util";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { emitter } from "@/libs";
import { useJoinRoom } from "../services";

const joinRoom = useJoinRoom();
const router = useRouter();
const store = useStore();
const props = defineProps({
  detail: {
    type: Object,
  },
});

const handleToBattleDetail = (row) => {
  router.push(`/battle-detail/${row.id}`);
};

const seats = computed(() => {
  const { detail } = props;
  const { users, num } = detail;

  const n = detail.num;
  const seats = [];

  let index = 0;

  for (let i = 0; i < n; i++) {
    index++;
    const user = users.find((user) => user.seat_no === index);
    seats.push({
      anyone: !!user,
      avatar: user?.avatar,
      senoNumber: index,
      winner: user?.winner === 1,
    });
  }
  return seats;
});

const buttonText = computed(() => {
  const { status, users } = props.detail;
  if (status === -1 || status === 2) return "查看";
  if (status === 1) return "观战";

  const userInfo = store.getters.userInfo;
  if (!userInfo) {
    return "挑战";
  }

  const user = users.find((user) => user.user_id === userInfo.user_id);

  if (user) {
    return "查看";
  }
  return "挑战";
});

// 新增：按钮颜色计算
const getBtnColor = computed(() => {
  const { status } = props.detail;
  if (status === 2) return "#99A5B7";
  if (status === 1) return "#409363";
  return "#4782F5";
});

const loading = ref(false);
const handleClickButton = (senoNumber) => {
  if (loading.value) return;

  const { detail } = props;
  const { id } = detail;
  const { status, users, price } = detail;

  const goto = () => {
    router.push(`/battle-detail/${id}`);
  };

  if (status !== 0) {
    goto();
    return;
  }

  const userInfo = store.getters.userInfo;
  if (!userInfo) {
    emitter.emit("login");
    return;
  }

  const user = users.find((user) => user.user_id === userInfo.user_id);
  if (user) {
    goto();
    return;
  }

  if (isNaN(Number(senoNumber))) {
    const targetSeat = seats.value.flat().find((seat) => !seat.anyone);
    if (!targetSeat) {
      console.warn("未找到空座位");
      return;
    }
    senoNumber = targetSeat.senoNumber;
  }

  loading.value = true;
  joinRoom(id, senoNumber!, price)
    .then(goto)
    .finally(() => (loading.value = false));
};

function setItemBg(status) {
  let className = "";
  if (status == 2) {
    className = "statusbg2";
  } else if (status == 1) {
    className = "statusbg1";
  }
  return className;
}
</script>

<style lang="scss" scoped>
.battel-item {
  background-color: #1f1f29;
  border-radius: 10px;
  padding: 12px;
  box-sizing: border-box;
}

/* 顶部标题区 */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .title-wrap {
    display: flex;
    gap: 6px;
    .battle-type {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    .battle-tag {
      color: #ffcc00;
      font-size: 12px;
      background: rgba(255, 204, 0, 0.2);
      padding: 2px 4px;
      border-radius: 4px;
    }
    .battle-prize {
      color: #ff6600;
      font-size: 12px;
    }
  }
  .rounds {
    color: #fff;
    font-size: 12px;
    background: #333;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

/* 玩家区 */
.users-wrap {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  .user-item {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .user-winner {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: -8px;
      background: url("@/assets/img/bos/win.png");
      background-size: 100%;
    }
  }
}

/* 奖励区 */
.rewards-wrap {
  background: linear-gradient(45deg, black, transparent);
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  .reward-item {
    position: relative;
    .cover {
      width: 50px;
      height: 50px;
      border-radius: 8px;
    }
    .icon {
      width: 30px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

/* 底部操作区 */
.action-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .price-wrap {
    background: linear-gradient(45deg, black, transparent);
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
    }
  }
}

/* 状态背景 */
.statusbg2 {
  .item-header {
    background: #363643;
  }
}
.statusbg1 {
  .item-header {
    background: #409363;
  }
}

/* 手机端响应式 */
@media screen and (max-width: 600px) {
  .battel-item {
    padding: 10px;
  }
  .users-wrap .user-item img {
    width: 32px;
    height: 32px;
  }
  .rewards-wrap .reward-item .cover {
    width: 40px;
    height: 40px;
  }
  .rewards-wrap .reward-item .icon {
    width: 24px;
  }
  .item-header .title-wrap {
    flex-wrap: wrap;
    gap: 4px;
  }
  .item-header .battle-type,
  .item-header .battle-tag,
  .item-header .battle-prize {
    font-size: 12px;
  }
  .item-header .rounds {
    font-size: 12px;
    padding: 1px 4px;
  }
}
</style>
