<template>
  <div class="battle-block">
    <div class="battle-topbox">
      
      <div
        class="battle-main"
        :class="{ 'main-winner': isWinner, equal: resultStatus === 2 }"
      >
        <!-- 状态 -->
        <div class="result" v-if="isGameOver">
          <img
            class="result-img"
            v-if="resultText == '失败'"
            src="@/assets/img/bos/bt_fail.png"
            alt=""
          />
          <img
            class="result-img"
            v-if="resultText == '胜利'"
            src="@/assets/img/bos/bt_success.png"
            alt=""
          />
          <img
            class="result-img"
            v-if="resultText == '平局'"
            src="@/assets/img/bos/bt_pingju.png"
            alt=""
          />
        </div>

        <!-- 已就位/等待 -->
        <div class="status d-flex aj-center" v-if="text">
          <img class="checked-img" v-if="user" src="@/assets/img/checked.png" />
          <v-btn
            v-else
            color="info"
            @click="handleClickButton"
            :size="isMobile ? 'small' : void 0"
            >{{ buttonText }}</v-btn
          >
        </div>

        <div
          v-show="room.status === 1"
          class="skin-list-wrapper"
          ref="skinListWrapperRef"
        >
          <img style="opacity: 0;" v-show="room.status === 1" src="@/assets/img/battle/skin-list-bg.png" />
          <skin-list :skin-list="boxSkinList" ref="skinListRef"></skin-list>
        </div>
      </div>
      <div class="topbg">
        <div class="top-user-info">
          <template v-if="user">
            <!-- {{user}} -->
            <div class="user-avatar-box" :class="{'winbor':isWinner}">
              <img class="user-avatar" :src="user.avatar" />
            </div>
            <span class="nickname text-overflow">{{ user.nickname }}</span>
          </template>
          <!-- 金额 -->
          <div
            class="user-info-amount text-yellow"
            :class="{ 'is-show': amount > 0 }"
          >
            <img style="width: 11px;" src="@/assets/img/bos/douzi.svg" />
            <count-to :number="amount"></count-to>
            <span
              class="current-skin-price"
              :class="{ 'is-show': isShowSkinPrice }"
              >+{{ price }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="block-skin-list" :class="{ solo: room.num === 2 }">
      <battle-skin-item
        v-for="award in listRecords"
        :key="award.skin_id"
        :award="award"
      ></battle-skin-item>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  nextTick,
  reactive,
  toRefs,
} from "vue";
import BattleSkinItem from "../BattleSkinItem.vue";

import type {
  BattleUserInfo,
  BattleRoomInfo,
  BattleAward,
  BattleRoundData,
} from "../../services";
import { SkinItem } from "@/types";
import SkinList from "./SkinList.vue";
import { shuffle } from "@/utils";
import CountTo from "@/components/count-to/index.vue";
import { UserBattleRole } from "../../services";
import { emitter } from "@/libs";
import btbg01 from "@/assets/img/btbg01.png";
import btbg02 from "@/assets/img/btbg02.png";

import { useStore } from "@/store";

export default defineComponent({
  setup(props, { emit }) {
    const { round: currentRound } = props;

    const inAnimation = ref(false);
    const store = useStore();
    const state = reactive({
      boxSkinList: [] as SkinItem[],
      skinListWrapperRef: void 0 as any,
      skinListRef: void 0 as any,
      price: 0,
      currentSkin: {} as SkinItem,
      // 跟随动画流程的进行回合数
      falseRound: currentRound,
      isGameOver: computed(() => {
        return props.room.status === 2;
      }),
      userInfo: computed(() => {
        return store.getters.userInfo;
      }),
      text: computed(() => {
        const { user, room } = props;
        if (!user) {
          return "等待";
        }

        const { status } = room;
        if (status === 0) {
          // 等待中
          return "已就位";
        }
        return "";
      }),
      isWinner: computed(() => {
        const { user } = props;
        return user?.winner === 1 || user?.winner === 2;
      }),
      resultText: computed(() => {
        const { user } = props;
        if (!user) return "";

        const { winner } = user;

        if (winner === 1) {
          return "胜利";
        }

        if (winner === 2) {
          return "平局";
        }

        return "失败";
      }),
      resultStatus: computed(() => {
        const user = props.user;
        if (!user) return -1;
        return props.user.winner;
      }),
      isShowSkinPrice: computed(() => {
        return props.room.status === 1 && !inAnimation.value && state.price;
      }),
    });

    // 开始动画
    const start = (data: BattleRoundData): Promise<void> => {
      const { battle_record } = data;
      const { user, skinList } = props;

      return new Promise((resolve, reject) => {
        try {
          if (!skinList.length) {
            console.error("盒子里没饰品", skinList);
            resolve();
            return;
          }

          if (!user) {
            console.error("该列无用户");
            resolve();
            return;
          }

          const record = battle_record.find(
            (record) => record.user_id === user.user_id
          );

          if (!record) {
            console.error(
              "开箱结果匹配失败",
              user.user_id,
              battle_record.slice()
            );
            resolve();
            return;
          }

          inAnimation.value = true;

          let list: SkinItem[] = [];
          const padding = 60;
          const offset = 2;

          while (list.length !== padding) {
            list.push(...skinList.slice(0, padding - list.length));
          }

          // 寻找目标饰品
          const skin = skinList.find((skin) => skin.skin_id === record.skin_id);
          if (!skin) {
            console.error("没有找到目标饰品", record.skin_id, skinList.slice());
            resolve();
            return;
          }

          list = shuffle(list);
          list[padding - offset] = skin;

          state.currentSkin = skin;
          state.boxSkinList = list;

          setTimeout(() => {
            state.price = record?.skin_price;

            state.skinListRef
              .scroll(state.skinListWrapperRef.clientHeight, offset)
              .then(() => {
                state.falseRound++;
                inAnimation.value = false;
              })
              .finally(resolve);
          }, 100);
        } catch (e) {
          console.error(e);
          resolve();
        }
      });
    };

    const listRecords = computed(() => {
      const { awards, comfortAward, user } = props;
      if (state.isGameOver) {
        if (user.user_id == state.userInfo?.user_id) {
          emit("gameOver", state.isWinner ? awards.slice() : [comfortAward!]);
        }

        return state.isWinner ? awards.slice() : [comfortAward!];
      }

      return awards.slice(0, state.falseRound);
    });

    return {
      listRecords,

      handleAddRobot: () => {
        emit("add-robot");
      },

      handleClickButton() {
        const { userRole, hasRobot } = props;
        if (userRole === UserBattleRole.Owner) {
          if (hasRobot) {
            // 复制链接
            emit("share");
          } else {
            emit("join-battle", true);
          }
        }

        if (userRole === UserBattleRole.Participant) {
          // 复制链接
          emit("share");
        }

        if (userRole === UserBattleRole.Audience) {
          // 加入房间
          emit("join-battle", false);
        }

        if (userRole === UserBattleRole.Tourist) {
          // 登录
          emitter.emit("login");
        }
      },

      start,
      amount: computed(() => {
        return listRecords.value.reduce((amount, next) => {
          return amount + next.skin_price;
        }, 0);
      }),

      buttonText: computed(() => {
        const { userRole, user, hasRobot } = props;

        if (user) return "";

        switch (userRole) {
          case UserBattleRole.Owner:
            if (hasRobot) return "分享链接";
            return "邀请AI对战";
          case UserBattleRole.Participant:
            return "分享链接";
          case UserBattleRole.Audience:
            return "加入";
          case UserBattleRole.Tourist:
            return "登录";
          default:
            console.warn("异常角色: ", userRole);
            return "";
        }
      }),

      ...toRefs(state),
      isMobile: window.screen.width <= 600,
    };
  },

  components: {
    BattleSkinItem,
    SkinList,
    CountTo,
  },

  props: {
    user: {
      type: Object as PropType<BattleUserInfo>,
      default: null,
    },
    room: {
      type: Object as PropType<BattleRoomInfo>,
      default: null,
    },
    awards: {
      type: Array as PropType<BattleAward[]>,
      default: () => [],
    },
    skinList: {
      type: Array as PropType<SkinItem[]>,
      default: () => [],
    },
    userRole: {
      type: Number as PropType<UserBattleRole>,
    },
    round: {
      type: Number,
      default: 0,
    },
    comfortAward: {
      type: Object as PropType<BattleAward>,
    },
    hasRobot: Boolean,
  },
});
</script>

<style scope lang="scss">
.battle-block {
  flex: 1;
  &.is-winner {
    .result {
      color: #ffed47;
    }

    .block-detail {
      border-color: #ffed47;

      &::after {
        background: linear-gradient(
          180deg,
          rgba(255, 237, 71, 0) 0%,
          #ffec41 100%
        );
      }
    }

    .block-header {
      &::before {
        background: url(@/assets/img/battle/battle-status-winner.png);
        background-size: cover;
      }
    }
  }
}

.block-header {
  text-align: center;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 0;

  &.game-over {
    // &::before {
    //   content: "";
    //   background: url(@/assets/img/battle/battle-status.png);
    //   background-size: cover;
    //   width: 115px;
    //   height: 115px;
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   z-index: 0;
    // }
  }

  > * {
    z-index: 2;
  }

  .result {
    font-size: 24px;
  }

  .status {
    text-align: center;
    margin-bottom: 14px;

    .status-text {
      font-size: 18px;
      margin-bottom: 15px;
    }

    img {
      width: 50px;
    }

    .icon-wait {
      animation: rotate 3s linear infinite;
    }
  }

  .block-amount {
    font-size: 16px;
    display: flex;
    align-items: center;
    margin-top: 12px;

    img {
      width: 23px;
      margin-right: 5px;
    }
  }
}

.skin-list-wrapper {
  height: 230px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  > img {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 3;
  }
  .skin-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    text-align: center;
    transition: top 3.5s cubic-bezier(0, 0, 0.01, 1);
    img {
      width: 50%;
    }
  }
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  height: 80px;
  z-index: 1;
  flex-direction: column;

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 6px;
  }

  .nickname {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
  }
}
.user-info-amount {
  font-size: 14px;
  margin-top: 0px;
  transition: height 0.3s linear;
  display: flex;
  align-items: center;
  height: 0;
  position: relative;
  overflow: hidden;

  &.is-show {
    height: 26px;
    overflow: initial;
  }

  img {
    margin-right: 5px;
  }

  .current-skin-price {
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translate(100%, -50%);
    color: #7affed;
    opacity: 0;
    transition: opacity 0.1s linear;


    &.is-show {
      opacity: 1;
    }
  }
}

.block-skin-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;

  &.solo {
    justify-content: flex-start;

    > * {
      width: 33%;
      margin-right: 1px;
    }
  }

  > * {
    width: calc(50% - 1px);
    margin-top: 2px;
  }
}

@keyframes rotate {
  50% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<style scoped lang="scss">
.battle-topbox {

  .topbg {
    height: 100px;
    position: relative;
    & > img {
      width: 100%;
      height: 100px;
      display: block;
    }
  }
}
.top-user-info {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  z-index: 9;
  .user-avatar-box{
    position: relative;
    width: 56px;
    height: 56px;
    transform: translateY(-50%);
    &.winbor{
      &::after{
        content: "";
        width:80px;
        height: 80px;
        position: absolute;
        background-image: url('@/assets/img/bos/winer_avatarborder.png');
        background-size: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .user-avatar{
        border: 0px;
      }
    }
  }
  .user-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    
    background-color: #f8f8f8;
  }
  .nickname {
    margin-top: -20px;
  }
}

.battle-main {
  height: 230px;
  // background: linear-gradient(0deg, #496191, #37496c);
  background-image: url('@/assets/img/bos/main-fail-bg.png');
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.equal {
    // background-color: #DBB24D;
    background: radial-gradient(closest-side, #5e5237, #dbb24d);
  }
}
.main-winner {
  // background: linear-gradient(0deg, #496191, #37496c);
  background-image: url('@/assets/img/bos/main-winner-bg.png');
}
.winner-color {
  background-color: #d95b50 !important;
}

.result-img{
  width: 108px;
}
@media screen and (max-width: 600px) {
  .checked-img{
    width: 30px;
  }
  .result-img{
    width: 58px;
  }
  .block-skin-list.solo > * {
    width: 49%;
  }
  .battle-main {
    height: 82px;
  }
  .skin-list-wrapper {
    height: 82px;
  }
  .battle-topbox{
    .topbg{
      height: 60px;
    }
  }
  .top-user-info{
    .nickname{
      margin-top: -10px;
    }
    .user-avatar-box{
      width: 30px;
      height: 30px;
      .user-avatar{
        width: 30px;
        height: 30px;
      }
      &.winbor{
        &::after{
          width: 36px;
          height: 37px;
        }
      }
    }
  }
}
</style>
