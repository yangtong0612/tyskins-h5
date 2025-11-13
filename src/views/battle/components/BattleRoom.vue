<template>
  <div
    class="battle-room-item"
    :class="{
      'in-progress': detail.status === 1,
      'game-over': detail.status === 2,
    }"
    v-loading="loading"
  >
    <div class="battle-room-left">
      <div class="battle-room-header">
        <!-- 状态 -->
        <div class="room-status">
          <img
            v-if="detail.status === 0"
            src="@/assets/img/battle/wait.png"
            alt=""
          />
          <img
            v-else-if="detail.status === 1"
            src="@/assets/img/battle/icon-in-progress.png"
            alt=""
          />
          <img
            v-else-if="detail.status === 2"
            src="@/assets/img/battle/icon-game-over.png"
            alt=""
          />

          <span>{{ roomStatusText }}</span>
        </div>
        <!-- 回合数 -->
        <span>{{ detail.rounds }}回合</span>
      </div>

      <div class="battle-room-info">
        <div class="battle-player">
          <div class="players">
            <div v-for="seatGroup in seats">
              <template v-for="seat in seatGroup">
                <template v-if="seat.anyone">
                  <img v-if="!seat.winner" :src="seat.avatar" />
                  <div class="battle-user-winner" v-else>
                    <img :src="seat.avatar" />
                  </div>
                </template>
                <img
                  v-else
                  src="@/assets/img/battle/join.png"
                  class="cursor-pointer"
                  @click="handleClickButton(seat.senoNumber)"
                />
              </template>
            </div>
          </div>
          <img class="icon-vs" src="@/assets/img/battle/vs.png" />
        </div>

        <div class="battle-price">
          <img src="@/assets/img/icon/coin.png" />
          <span>{{ detail.price.toFixed(2) }}</span>
        </div>

        <v-btn
          color="#8E7EED"
          class="text-white battle-button"
          @click="handleToBattleDetail"
          >{{ buttonText }}</v-btn
        >
      </div>
    </div>

    <div class="battle-room-right">
      <div :class="{ 'is-show': arrowVisible.showTop }">
        <img src="@/assets/img/battle/icon-arrow.png" alt="" />
      </div>

      <div ref="battleBoxs">
        <img v-for="box in detail.box" :src="box.box_img" />
      </div>

      <div :class="{ 'is-show': arrowVisible.showBottom }">
        <img src="@/assets/img/battle/icon-arrow.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { emitter } from "@/libs";
import { useStore } from "@/store";
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { useJoinRoom } from "../services";
import type { BattleRoomListItem } from "../services";
import { status2str } from "../util";

interface Seat {
  anyone: boolean;
  senoNumber: number;
  avatar?: string;
  winner?: boolean;
}

export default defineComponent({
  setup(props) {
    const joinRoom = useJoinRoom();

    const router = useRouter();
    const store = useStore();
    const loading = ref(false);
    const seats = computed(() => {
      const { detail } = props;
      const { users, num } = detail;

      const n = Math.ceil(detail.num / 2);
      const seats: Seat[][] = [];

      let index = 0;

      for (let i = 0; i < n; i++) {
        const item: Seat[] = [];
        seats.push(item);

        for (let y = 0; y < (num === 3 && i === 1 ? 1 : 2); y++) {
          index++;
          const user = users.find((user) => user.seat_no === index);
          item.push({
            anyone: !!user,
            avatar: user?.avatar,
            senoNumber: index,
            winner: user?.winner === 1,
          });
        }
      }

      return seats;
    });
    const battleBoxs = ref<any>();
    const arrowVisible = reactive({
      showTop: false,
      showBottom: false,
    });

    watchEffect(() => {
      const { box } = props.detail;
      if (!box.length) return;

      nextTick(() => {
        if (!battleBoxs.value) return;

        const { clientHeight, scrollHeight } = battleBoxs.value;
        arrowVisible.showBottom = scrollHeight > clientHeight;
        registeScrollEvent();
      });
    });

    const registeScrollEvent = () => {
      if (battleBoxs.value.onscroll) return;
      battleBoxs.value.onscroll = battleBoxs.value.ontouchmove = () => {
        const { scrollTop, scrollHeight, clientHeight } = battleBoxs.value;
        arrowVisible.showTop = scrollTop > 0;
        arrowVisible.showBottom = scrollTop + clientHeight < scrollHeight - 3;
      };
    };

    const roomStatusText = computed(() => {
      const { detail } = props;
      const { status } = detail;
      return status2str(status);
    });

    return {
      roomStatusText,

      handleClickButton(senoNumber?: number) {
        if (loading.value) return;

        const { detail } = props;
        const { id } = detail;
        const { status, users, price } = detail;

        const goto = () => {
          router.push(`/battle/${id}`);
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
      },

      handleToBattleDetail() {
        const { detail } = props;
        const { id } = detail;
        router.push(`/battle/${id}`);
      },

      seats,

      buttonText: computed(() => {
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
      }),

      loading,
      battleBoxs,
      arrowVisible,
    };
  },

  props: {
    detail: {
      type: Object as PropType<BattleRoomListItem>,
      default: () => ({}),
    },
  },
});
</script>

<style scope lang="scss">
$playerAvatarSize: 36px;

.battle-room-item {
  width: 304px;
  max-height: 365px;
  background: linear-gradient(180deg, #3f3772 0%, #1c1551 100%);
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;

  &.in-progress {
    background: linear-gradient(180deg, #6482e5 0%, #0d1a37 100%);
  }

  &.game-over {
    background: linear-gradient(180deg, #9596ae 0%, #494560 100%);
  }

  .battle-room-left {
    width: 248px;
    padding-bottom: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .battle-room-right {
    flex: 1;
    margin: 20px 0 20px 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      &:nth-child(1),
      &:nth-child(3) {
        opacity: 0;
        transition: opacity 0.2s linear;

        &.is-show {
          opacity: 1;
        }

        img {
          width: 16px;
        }
      }

      &:nth-child(1) {
        margin-bottom: 8px;

        img {
          transform: rotate(180deg);
          transform-origin: center;
        }
      }

      &:nth-child(2) {
        display: flex;
        // justify-content: center;
        align-items: center;
        flex-direction: column;
        overflow: auto;
        flex: 1;

        img {
          width: 32px;
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0px;
          }
        }
      }

      &:nth-child(3) {
        margin-top: 8px;
      }
    }

    &::before {
      content: "";
      width: 1px;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 51%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }
}

.battle-room-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23px 16px 32px 16px;
  color: rgba(255, 255, 255, 0.5);
  box-sizing: border-box;

  .room-status {
    display: flex;
    align-items: center;

    img {
      width: 13px;
    }

    span {
      margin-left: 5px;
    }
  }
}

.battle-room-info {
  width: 200px;
  text-align: center;

  .battle-player {
    height: 160px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 6px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .icon-vs {
      width: 46px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .players {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      top: 16px;
      bottom: 16px;
      left: 36px;
      right: 36px;

      > div {
        display: flex;
        align-items: center;
        justify-content: center;

        img:nth-child(2) {
          margin-left: 50px;
        }

        &:nth-child(2) {
          margin-top: auto;
        }
      }

      .battle-user-winner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 39px;
        height: 39px;
        background: url(@/assets/img/battle/avatar.png) no-repeat;
        background-size: 100% 100%;

        &:nth-child(2) {
          margin-left: 50px;
        }
      }

      img {
        width: $playerAvatarSize;
        height: $playerAvatarSize;
        border-radius: 50%;
      }
    }
  }

  .battle-price {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-top: 16px;

    img {
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 16px;
      margin-left: 5px;
      height: 18px;
      line-height: 20px;
    }
  }

  .battle-button {
    width: 143px;
    height: 42px;
    font-size: 16px;
    margin-top: 23px;
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .battle-room-item {
    width: calc(50% - 3px);
    max-height: 281px;
    margin-bottom: 8px;
    margin-right: 0;

    .battle-room-left {
      width: 152px;
      padding-bottom: 15px;
      flex: 1;

      .battle-room-header {
        padding: 10px 16px 12px;
      }

      .battle-room-info {
        width: 100%;
        padding: 0 8px;
        box-sizing: border-box;
      }
    }

    .battle-room-right {
      width: 23px;
      flex: none;

      > * {
        &:nth-child(1),
        &:nth-child(3) {
          img {
            width: 8px;
          }
        }

        &:nth-child(2) {
          justify-content: flex-start;
          img {
            width: 12px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .battle-room-info {
    .battle-price {
      margin-top: 6px;
      img {
        width: 16px;
        height: 16px;
      }

      span {
        font-size: 14px;
        margin-left: 6px;
      }
    }

    .battle-button {
      width: 120px;
      height: 32px;
      margin-top: 11px;
      font-size: 14px;
    }
  }
}
</style>
