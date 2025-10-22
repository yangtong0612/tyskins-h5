<template>
  <div class="welfare-box">
    <div class="welfare-title-group">
      <div v-for="(title, index) in titles" :key="index" class="welfare-title" :class="{ active: index == titleIndex }"
        @click="onChangeWelfare(index)">
        {{ title }}
      </div>
    </div>
    <div class="welfare-content">
      <div class="mobile-welfare-title-group" style="display:none">
        <div v-for="(title, index) in titles" :key="index" class="mobile-welfare-title"
          :class="{ active: index == titleIndex }" @click="onChangeWelfare(index)">
          {{ title }}
        </div>
      </div>
      <div class="welfare-list">
        <div class="welfare-item" @click="toUnpack(item)" v-for="item in boxList" :key="item.id">
          <div class="upper">
            <div class="top">
              <div class="left">今日</div>
              <div class="right">{{todayRecharge >= item.amount ? "已满足" : "未满足"}}</div>
            </div>
            <div class="img">
              <img :src="processImageUrl(item.box_img)" alt="" />
              <img class="box_bg" :src="processImageUrl(item.box_cover)" alt="">
            </div>
          </div>
          <div class="lower">
            <div class="title">{{item.box_name}}</div>
            <!-- <div class="coin">{{item.box_price}}</div> -->
            <div class="coin">0</div>
            <div class="desc">
              <p>今日充值{{item.amount}}免费开启</p>
              <p>每日限开一次</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import WelfareBoxService from "@/services/WelfareBoxService";
import { UserService } from "@/services/UserService";
import { defineComponent, toRefs, reactive, onMounted, watch, inject } from "vue";
import { processImageUrl } from "@/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
export default defineComponent({
  name: "Welfare",
  setup() {
    const store = useStore()
    const router = useRouter()
    const closeDialog: any = inject("closeDialog")
    const state = reactive({
      titles: ["充值福利", "每周拼箱", "每日消化任务", "其他福利"],
      titleIndex: 0,
      boxList: [],
      todayRecharge: 0,
    });

    watch(() => store.getters.userInfo, (userInfo) => {
      if (userInfo != null) getTodayRecharge()
    })

    onMounted(async () => {
      await getRechargeWelfareBoxList()
    })

    async function getTodayRecharge() {
      const resp = await UserService.getTodayRecharge()
      const { data: { today_recharge } } = resp.data
      state.todayRecharge = today_recharge
    }

    async function getRechargeWelfareBoxList() {
      const resp = await WelfareBoxService.rechargeWelfareBoxList({
        disabled: 0,
        sorts: "+amount"
      })
      const { data: { list, total } } = resp.data
      state.boxList = list
    }

    function onChangeWelfare(index) {
      if (index > 0) {
        ElMessage.info("暂未开放")
        return
      }
      state.titleIndex = index;
    }

    function toUnpack(item) {
      const { box_id, id } = item
      router.push(`/welfarebox/${id}/${box_id}`)
      closeDialog()
    }

    return {
      ...toRefs(state),
      onChangeWelfare,
      processImageUrl,
      toUnpack
    };
  },
});
</script>

<style lang="scss" scoped>
.welfare-box {
  .welfare-title-group {
    display: flex;
    border-bottom: 2px solid #4782F5;
    box-sizing: border-box;
    height: 42px;
    margin-bottom: 20px;

    .welfare-title {
      flex: 2;
      height: 42px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      cursor: pointer;
      box-sizing: border-box;

      &:first-child {
        flex: 1;
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    .active {
      position: relative;
      color: #4782F5;
      &::before{
        content: "";
        position: absolute;
        width: 0;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #4782F5 transparent;
      }
    }
  }

  .welfare-content {
    display: flex;
    margin-top: 6px;
    padding-bottom: 8px;
  }

  .welfare-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 24%);
    grid-gap: 8px;
    margin-top: 8px;
  }

  .welfare-item {
    // width: 25%;
    // height: 202px;
    background: #fff;
    // margin-top: 8px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    .upper {
      width: 100%;
      height: 108px;
      background-image: url(@/assets/img/welfare/bg_box.png);
      background-size: 100%;
      color: #fff;

      .top {
        opacity: 0.5;
        display: flex;
        justify-content: space-between;
        padding: 6px 5px;

        .left {
          font-size: 12px;
        }

        .right {
          width: 60px;
          height: 20px;
          line-height: 20px;
          background: #FF9900;
          border-radius: 10px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          font-weight: bold;
        }
      }

      .img {
        position: relative;
        width: 66px;
        max-height: 66px;
        margin: 0 auto;

        img {
          position: relative;
          z-index: 1;
          height: 100%;
          width: 100%;
        }

        .box_bg {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
      }
    }

    .lower {
      padding: 5px 10px;

      .title {
        min-height: 22px;
        font-size: 14px;
        color: #333333;
      }

      .coin {
        display: none;
        align-items: center;
        color: #FF9900;
        font-weight: 500;
        font-size: 14px;
      }

      .coin::before {
        content: "";
        background-image: url(@/assets/img/jb_01.png);
        background-size: 100%;
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-right: 5px;
      }

      .desc {
        margin-top: 4px;
        font-size: 12px;
        color: #707070;
      }
    }
  }

  .welfare-item:nth-of-type(3n) {
    margin-right: 0;
  }
}

@media screen and (max-width: 768px) {
  .welfare-box {
    .welfare-title-group {
      display: none;
    }

    .welfare-content {
      flex-direction: column;
      margin-top: 0;
    }

    .welfare-list {
      display: grid;
      grid-template-columns: repeat(2, 49%);
      grid-gap: .8rem;
      padding: 0 .8rem;

      .welfare-item {
        width: 100%;
        margin: 0;

        .upper {
          height: 11.2rem;
          background-size: cover;

          .top {
            align-items: center;
            color: #fff;
          }
        }

        .lower {
          padding: 1rem;
        }
      }
    }

    .mobile-welfare-title-group {
      display: flex !important;
      justify-content: space-around;
      align-items: center;
      height: 3.7rem;
      font-size: 1.2rem;
      color: #2B3340;

      .mobile-welfare-title {
        min-width: 7.4rem;
        text-align: center;
      }

      .active {
        font-weight: bold;
        color: #FFD17E;
        background: url(@/assets/img/welfare/bg_mobile_tab.png) no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>