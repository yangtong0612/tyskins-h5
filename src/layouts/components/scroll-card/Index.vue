<template>
  <div class="card-scroll">
    <div class="card-list" style="color: #ffffff">
      <div
        v-for="item in unboxList"
        :key="item.id"
        class="card-item"
        :class="{ load: item.created_at > createTime }"
        @click="handleClickCard(item)"
      >
        <div
          class="bgbase"
          :class="`bg_${item.color ? item.color.slice(1) : 'B0C3D9'}`"
        ></div>
        <div class="card-image-box">
          <img referrerpolicy="no-referrer" class="card-image" :src="item.image_url" />
        </div>
        <p class="name">{{ item.item_name }}</p>
        <div class="card-reverse">
          <img
            v-if="item.user_id === 0"
            src="@/assets/img/battle/robot-avatar.jpg"
          />
          <img
            v-else
            :src="processImageUrl(item.avatar.replace(/^\/*/g, ''))"
          />
          <div class="user">
            <p class="nickname">{{ item.nickname }}</p>
          </div>
        </div>

        <!-- <img
          v-if="item.message_type === 'openBox'"
          src="@/assets/img/top/open-box-icon.png"
          class="card-icon"
        /> -->
        <template v-if="item.message_type === 'upgrade'">
          <div>
            <span
              v-if="item.extend_data.result && item.extend_data.range"
              class="upgrade-range"
              >{{ item.extend_data.range }}%</span
            >
            <img
              src="@/assets/img/bos/sj1.png"
              v-if="item.extend_data.result"
              class="card-icon"
            />
            <img src="@/assets/img/bos/sj2.png" v-else class="card-icon" />
          </div>
        </template>

        <img
          v-else-if="item.message_type === 'battleBox'"
          src="@/assets/img/bos/duiz.png"
          class="card-icon"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { emitter } from "@/libs";
import { OpenBoxResult } from "@/types/box";
import { useStore } from "@/store";
import { processImageUrl } from "@/utils";
import BoxService from "@/services/BoxService";
import img from "./img.json";
import { processRobot } from "@/views/battle/util";
let id = 0;

export default defineComponent({
  name: "ScrollCard",

  setup() {
    const state = reactive({
      unboxList: <any>[],
    });

    return {
      ...toRefs(state),
      img,
      processImageUrl,
      useAnimation: ref(false),
      store: useStore(),
      createTime: Math.floor(Date.now() / 1000),
      boxShadowBlur: window.screen.width <= 600 ? "25px 26px" : "28px 36px",
    };
  },

  created() {
    this.registerEvent();
  },

  computed: {
    // 开箱动画时间
    loadingTime() {
      return this.store.getters.loadingTime;
    },
    openBoxLoadingTime() {
      return this.store.getters.loadingTime;
    },
    // 饰品升级动画时间
    upgradeLoadingTime() {
      return this.store.getters.upgradeLoadingTime;
    },
    disableOpenBoxAnimation() {
      return this.store.getters.disableOpenBoxAnimation;
    },
    userInfo() {
      return this.store.getters.userInfo;
    },
    rechargeWelfareBoxTypeId() {
      return this.store.getters.rechargeWelfareBoxTypeId;
    },
  },

  methods: {
    registerEvent() {
      window.openBoxEventStatus = 1;

      emitter.on("scrollCard", (data) => {
        data?.reverse();

        console.log("scrollCard", data);

        if (data && this.userInfo && Array.isArray(data) && data.length) {
          const first = data[0];
          const messageType = first.message_type;
          let loadingTime = 0;

          if (messageType === "openBox") {
            if (!this.disableOpenBoxAnimation) {
              loadingTime = this.loadingTime;
            }
          } else if (messageType === "upgrade") {
            loadingTime = this.upgradeLoadingTime;
          }

          const delayList: Array<
            OpenBoxResult & {
              message_type: "openBox" | "upgrade";
            }
          > = [];

          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (
              item.user_id === this.userInfo.user_id &&
              item.created_at > this.createTime
            ) {
              delayList.push(item);
              data.splice(i, 1);
              i--;
            }
          }

          setTimeout(() => {
            this.onOpenBox(delayList);
          }, loadingTime);
        }

        this.onOpenBox(data);
      });
    },

    onOpenBox(data) {
      if (!data) return;
      this.unboxList.unshift(
        ...data
          .map((item) => ({
            ...item,
            id: item.id || `id_${id++}`,
          }))
          .map(processRobot)
      );
      if (this.unboxList.length > 30) {
        this.unboxList = this.unboxList.slice(0, 30);
      }
      // this.unboxList.pop();
    },

    getBox(box_id) {
      return BoxService.id({
        box_id,
      });
    },

    handleClickCard(item) {
      const { message_type, extend_data } = item;
      console.log(item);
      if (message_type === "openBox") {
        const boxId = extend_data.box_id;
        // 查询是否是福利箱子，如果是则跳转到对应路由
        if (boxId) {
          // this.getBox(boxId).then(res => {
          //   let path = `/welfarebox/${}/${}`
          //   if (res.data.data.type_id != this.rechargeWelfareBoxTypeId) {
          //     path = `/openbox/${boxId}`
          //   }
          //   this.$router.push(path)
          // })
          this.$router.push(`/openbox/${boxId}`);
        }
      } else if (message_type === "upgrade") {
        this.$router.push("/upgrade");
      } else if (message_type === "battleBox") {
        this.$router.push("/battle");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.card-scroll {
  position: relative;
  width: 100%;
  height: 104px;
  background-color: #1a1c24;
  z-index: 0;

  .card-list {
    position: absolute;
    left: 0px;
    height: 104px;
    right: 0;
    display: flex;
    flex-wrap: nowrap;
    // background-color: #1a1c24;
    overflow: hidden;
    .card-item {
      cursor: pointer;
      position: relative;
      width: 160px;
      box-sizing: border-box;
      border-radius: 0px;
      flex: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 2px;
      mask-image: url("@/assets/img/skinbasebg.png");
      mask-position: 50%;
      mask-size: cover;
      &::before {
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-image: url("@/assets/img/o-white.png");
        background-repeat: no-repeat;
        background-position: center 10px;
        background-size: 40%;
        z-index: 1;
        opacity: 0.2;
      }
      .card-image-box {
        z-index: 2;
        height: 80px;
        overflow: hidden;
        position: relative;
        background-size: 60%;
        background-position: center center;
        position: relative;
        .card-image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        // img{
        //   width: 100%;
        // }
      }

      // & img {
      //   position: relative;
      //   display: block;
      //   margin: 4px auto 10px auto;
      //   width: 100%;
      //   z-index: 5;
      // }

      .name {
        position: relative;
        width: 100%;
        color: #ffffff;
        font-weight: 700;
        font-size: 12px;
        z-index: 9;
        margin: 0;
        text-align: center;
        transform: scale(0.9);
        margin-bottom: 2px;
        transition: 0.3s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .text {
        position: relative;
        color: #67706a;
        width: 100%;
        font-weight: 900;
        font-size: 12px;
        transform: scale(0.85);
        transform-origin: top;
        transition: 0.3s;
        text-align: center;
        margin: 0;
      }

      .icon {
        width: 20%;
        right: 2px;
        font-weight: 700;
        z-index: 10;
        color: #bcc2be;
        position: absolute;

        img {
          margin: 0 !important;
          position: relative;
          display: block;
          margin: 14px auto 10px auto;
          width: 100%;
          z-index: 5;
        }
      }

      .top-rate {
        position: absolute;
        color: #aeaeae;
        box-sizing: border-box;
        padding: 3px 0;
        font-weight: 700;
        bottom: auto;
      }

      .card-reverse {
        display: grid;
        opacity: 0;
        transition: 0.3s;
        transform: rotateY(90deg);
        grid-template-rows: 40% 40%;
        padding-top: 15%;
        align-items: center;
        justify-items: center;
        top: 0;
        height: 100%;
        position: absolute;
        left: 0;
        width: 100%;
        z-index: 10;

        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-bottom: 0px;
          background-color: #eee;
          margin-top: 10px;
        }

        .user {
          display: grid;
          width: 100%;
          position: relative;
          transform: scale(0.9);
          justify-items: center;
          top: 0.4rem;

          .level {
            display: flex;
            align-items: center;
            justify-content: center;
            text-indent: 1rem;
            background-position-y: 4px;
            width: 52px;
            height: 30px;
            background-size: contain;
            background-repeat: no-repeat;
          }

          .nickname {
            width: 100%;
            text-align: center;
            color: #fff;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .card-icon {
        width: 30px;
        position: absolute;
        top: 0px;
        right: 4px;
        margin: 0;
      }
      &:hover .card-reverse {
        opacity: 1;
        transform: rotateY(0deg);
      }

      &:hover > img,
      &:hover .top-rate,
      &:hover .name,
      &:hover .text {
        opacity: 0;
        transform: rotateY(-90deg);
      }

      &.load {
        animation: new-card-Item 1s;
      }
    }
  }
}

@keyframes new-card-Item {
  0% {
    opacity: 0;
    width: 0;
  }

  to {
    opacity: 1;
    width: 113px;
  }
}

@keyframes new-card-Item-mobile {
  0% {
    opacity: 0;
    width: 0;
  }

  to {
    opacity: 1;
    width: 20%;
  }
}

.bgbase {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

// 自定义背景色
.bg_E4AE39 {
  background-color: #ffd700;
}

.bg_EB4B4B {
  background-color: #eb4b4b;
}

.bg_D32CE6 {
  background-color: #d32ce6;
}

.bg_8847FF {
  background-color: #8847ff;
}

.bg_4B69FF {
  background-color: #4b69ff;
}

.bg_5E98D9 {
  background-color: #5e98d9;
}

.bg_B0C3D9 {
  background-color: #b0c3d9;
}

.upgrade-range {
  position: absolute;
  left: 5px;
  top: 5px;
  color: #fee092;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .v-tab:first-child {
    margin-inline-start: 0px;
  }

  .card-scroll {
    height: 86px;
    overflow: hidden;
    .tit {
      display: none;
    }
    .card-list {
      width: 100%;
      height: 100%;
      left: 0;
      position: relative;
      .card-item {
        width: 97px;
        // height: 100%;
        &.load {
          animation: new-card-Item-mobile 0.6s;
        }
        .card-image-box {
          height: 50px;
        }
        .card-image {
          width: 70px;
          margin: 6px auto;
        }

        .card-background {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
