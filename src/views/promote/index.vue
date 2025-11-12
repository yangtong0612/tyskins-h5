<template>
  <div class="promote-wrap">
    <v-container class="container-box">
      <div class="promote-topbg">
        <div class="tc text-white mb-8 fs14">当前等级</div>
        <div class="level-line">
          <div
            :class="index == 4 ? 'active' : ''"
            v-for="(item, index) in 9"
            :key="index"
          >
            <span>LV.{{ userInfo?.level || 0 }}</span>
          </div>
        </div>
        <div
          style="margin: 0 auto"
          class="stats d-flex space-between tc text-white w70"
        >
          <div class="stat-item">
            <div class="fs24">{{ stat.rebate_rate || 0 }}</div>
            <div style="color: #99a5b7" class="fs14">佣金比例</div>
          </div>
          <div class="stat-item">
            <div class="fs24">{{ stat.num || 0 }}</div>
            <div style="color: #99a5b7" class="fs14">累计推广人数</div>
          </div>
          <div class="stat-item">
            <div class="fs24">{{ stat.rebate_total || 0 }} 金币</div>
            <div style="color: #99a5b7" class="fs14">累计推广收入</div>
          </div>
          <div class="stat-item">
            <div>
              <span class="fs24">{{ stat.rebate_current || 0 }} 金币 </span>
              <v-btn
                @click="receiveRebate"
                class="ml-1"
                elevation="0"
                color="primary"
                height="24"
                type="primary"
                v-if="stat.rebate_current"
                >领取</v-btn
              >
            </div>
            <div style="color: #99a5b7" class="fs14">待领返利</div>
          </div>
        </div>
        <div
          style="margin-left: auto; margin-right: auto"
          class="d-flex space-between px-4 py-4 mt-12 w80 mhide"
        >
          <div class="d-flex" style="align-items: center">
            <span class="fs13 mr-2 text-white tglable">你的推广链接</span>
            <section class="d-flex">
              <div class="fs13 pl-2 inpbg line1 tglzinp">
                {{ `${BASE_URL}/?code=${inviteCode}` }}
              </div>
              <v-btn
                style="border-radius: 0 10px 10px 0px"
                @click="copyText(`${BASE_URL}/?code=${inviteCode}`)"
                class="ml-1"
                elevation="0"
                color="#f3a55e"
                height="34"
                >复制</v-btn
              >
            </section>
          </div>
          <div class="d-flex" style="align-items: center">
            <span class="fs13 mr-2 text-white tglable">你的推广码</span>
            <section class="d-flex">
              <div class="inpbg fs13 pl-2 tglzinp">
                {{ inviteCode }}
              </div>
              <v-btn
                style="border-radius: 0 10px 10px 0px"
                @click="copyText(inviteCode)"
                class="ml-1"
                elevation="0"
                color="#f3a55e"
                height="34"
                >复制</v-btn
              >
            </section>
          </div>
        </div>
      </div>
    </v-container>
    <v-container class="container-box2">
      <div class="mt-5">
        <div v-if="!isMobile" class="d-flex">
          <div class="flex-1 text-white fs24">充值金额</div>
          <span class="text-yellow fs12"
            >(下级累计充值金额:{{ stat.recharge }})</span
          >
        </div>

        <div class="wd-mtitle">
          <span>充值金额</span>
          <div class="desc" style="color: #ffb300">
            （下级累计充值金额：{{ stat.recharge }}）
          </div>
        </div>

        <div
          class="mt-6 mb-2 fs14"
          style="color: #ffffff; background-color: rgba(255, 255, 255, 0.1)"
        >
          <v-row class="fs12">
            <v-col cols="1"></v-col>
            <v-col cols="3" class="tc">推广等级</v-col>
            <v-col cols="3">邀请下级充值金额达到</v-col>
            <v-col cols="3">返利比例</v-col>
          </v-row>
        </div>
        <div
          v-for="(item, index) in levelSetting.list"
          :key="index"
          class="py-3 bor_b"
        >
          <v-row class="fs14">
            <v-col cols="1"></v-col>
            <v-col cols="3" class="tc"
              ><span class="text-white">Lv.{{ item?.level }}</span></v-col
            >
            <v-col cols="3" v-if="index + 1 < levelSetting.list.length">
              <span class="text-white">{{
                `${item.recharge_amount}-${
                  levelSetting.list[index + 1].recharge_amount - 1
                }`
              }}</span></v-col
            >
            <v-col cols="3" v-else
              ><span class="text-white">{{
                `${item.recharge_amount}-`
              }}</span></v-col
            >
            <v-col cols="3"
              ><span class="text-white">{{ item.rebate_rate }}%</span></v-col
            >
          </v-row>
        </div>
      </div>
      <div class="mt-6">
        <div v-if="!isMobile" class="d-flex">
          <div class="flex-1 text-white fs24">下线详情</div>
        </div>

        <div class="wd-mtitle">
          <span>下线详情</span>
        </div>

        <div
          class="mt-6 mb-2 fs14"
          style="color: #ffffff; background-color: rgba(255, 255, 255, 0.1)"
        >
          <v-row class="fs12">
            <v-col cols="3" class="tc">下线名称</v-col>
            <v-col cols="3">充值金额</v-col>
            <v-col cols="3">注册时间</v-col>
            <v-col cols="3">贡献返利</v-col>
          </v-row>
        </div>
        <div v-for="(item, index) in record" :key="index" class="py-3">
          <v-row class="fs14 text-gray">
            <v-col cols="3" class="tc"
              ><span class="text-white">{{ item.nickname }}</span></v-col
            >
            <v-col cols="3"
              ><span class="text-white">{{ item.recharge_total }}</span></v-col
            >
            <v-col cols="3"
              ><span class="text-white">{{
                $dayjs.unix(item.created_at).format("YYYY-MM-DD")
              }}</span></v-col
            >
            <v-col cols="3"
              ><span class="text-white"
                >{{ item.rebate_total }} 金币</span
              ></v-col
            >
          </v-row>
        </div>
      </div>
      <div class="d-flex py-15 justify-center">
        <el-pagination
          :page-size="state.page_size"
          :total="state.total"
          background
          layout="prev, pager, next"
          @current-change="onPageChange"
        />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, toRefs } from "vue";
import { PromoteService } from "@/services/PromoteService";
import { useStore } from "@/store";
import { processImageUrl } from "@/utils";
import { toast } from "@/composables/util";
import QTitle from "@/components/QTitle.vue";

import useClipboard from "vue-clipboard3";
const isMobile = computed(() => window.innerWidth < 600);
const { toClipboard } = useClipboard();

const copyText = async (text) => {
  try {
    await toClipboard(text);
    //复制成功提示
    toast("复制成功");
  } catch (e) {
    //复制失败回调
    console.error(e);
  }
};

const shortcuts = [
  {
    text: "最近一周",
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    })(),
  },
  {
    text: "最近一个月",
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    })(),
  },
  {
    text: "最近三个月",
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    })(),
  },
];

const store = useStore();

const state = reactive({
  shortcuts,
  value: "",
  stat: computed(() => store.getters.promoteStat),
  record: [],
  levelSetting: computed(() => store.getters.levelSetting),
  inventInfo: computed(() => store.getters.inviterInfo),
  inviteCode: computed(() => store.state.user?.invite_code),
  userInfo: computed(() => store.getters.userInfo),
  page: 1,
  page_size: 10,
  total: 0,
});

const { inviteCode, levelSetting, record, userInfo, stat } = toRefs(state);

onMounted(() => {
  stats();
  getRecord();
  getLevelSetting();
  inventInfo();
});

const stats = async () => {
  store.dispatch("getPromoteStat");
};

const getRecord = async () => {
  const record = await PromoteService.record({
    page: state.page,
    page_size: 10,
  });
  console.log(record.data);
  const { list, total } = record.data.data;
  state.record = list;
  state.total = total;
};

const onPageChange = (e) => {
  console.log(e);
  // state.page++;
  state.page = e;
  getRecord();
};

const inventInfo = () => {
  return store.dispatch("getInviterInfo");
};

const getUserInfo = () => {
  store.dispatch("getUserInfo");
};

const receiveRebate = async () => {
  await PromoteService.receiveRebate();
  stats();
  getUserInfo();
};

const getLevelSetting = async () => {
  store.dispatch("getLevelSetting");
};
</script>

<style lang="scss" scoped>
.level-line {
  display: flex;
  color: #666666;
  font-size: 14px;
  border-bottom: 2px solid #2d2f3e;

  margin-bottom: 50px;
  & > div {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: #666666;
      border-radius: 50%;
      outline: 2px solid rgba(255, 255, 255, 0.1);
    }
    span {
      opacity: 0;
    }
  }
  .active {
    color: #ffb300;
    font-size: 19px;
    font-weight: bold;

    span {
      position: relative;
      top: -10px;
      display: inline-block;
      width: 102px;
      height: 30px;
      background: rgba(255, 179, 0, 0.1);
      border-radius: 29px 29px 29px 29px;
      opacity: 1;
    }
  }
}
.inpbg {
  background: #2d2f3e;
  color: #99a5b7;
  margin-right: -10px;
}
.promote-wrap {
  .container-box {
    box-shadow: 0px 1px 20px 1px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
  }
  .container-box2 {
    padding: 30px;
    .bor_b {
      border-bottom: 1px solid #23242a;
    }
  }
}
.promote-topbg {
  height: 376px;
  background: url("@/assets/img/bos/promote-topbg.png");
  background-size: 100% 100%;
  padding-top: 30px;

  .w50 {
    width: 50%;
  }
  .w70 {
    width: 70%;
  }
  .w80 {
    width: 80%;
  }
  .w90 {
    width: 90%;
  }
}

.toph {
  height: 150px;
}

.stats {
  .stat-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div:first-child {
      margin-bottom: 5px;
    }
  }
}
.tglzinp {
  height: 34px;
  width: 294px;
  line-height: 34px;
  border-radius: 10px;
}
@media screen and (max-width: 600px) {
  .promote-wrap {
    margin-top: 0;
    overflow: hidden;
    .container-box {
      margin-top: 0;
      margin-bottom: 0;
    }
    .container-box2 {
      padding: 10px;
    }
  }
  .tglzinp {
    width: 194px;
  }
  .tglable {
    width: 80px;
    flex-shrink: 0;
    font-size: 12px !important;
  }

  .mhide {
    flex-direction: column;

    > div {
      // flex-direction: column;

      span {
        margin-bottom: 5px;

        + section {
          > div {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      &:first-child {
        margin-bottom: 8px;
      }
    }
  }

  .level_img {
    width: 50px;
  }

  .promote-topbg {
    // height: 156px;
    margin-top: 52px;
    height: auto;

    .pt-8 {
      padding-top: 24px !important;
    }

    .mb-8 {
      margin-bottom: 6px !important;
    }

    .w50 {
      width: 95%;
    }
    .w70 {
      width: 90%;
    }
    .w80 {
      width: 100%;
    }
    .level-line {
      margin-bottom: 20px;
    }
    .fs24 {
      font-size: 16px !important;
    }
    .fs14 {
      font-size: 12px !important;
    }
    .mt-12 {
      margin-top: 10px !important;
    }
  }

  .toph {
    height: 60px;
  }
}

.level-openbox {
  position: relative;
  display: flex;
  height: 360px;
  padding: 0 30px;

  .box-item {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 180px;
    margin-right: -65px;

    .sline {
      content: "";
      height: 100%;
      border-left: 1px dashed #99a5b7;
      position: absolute;
      left: 50%;
      z-index: 0;
    }

    .boximg {
      position: relative;
      z-index: 9;
      width: 175px;
      height: 133px;
      background-color: #99a5b7;
      flex-shrink: 0;

      .btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      p {
        position: absolute;
        bottom: 10px;
        text-align: center;
        width: 100%;
        color: #ffffff;
      }
    }

    .num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #99a5b7;
      border: 1px solid #99a5b7;
      background-color: #ffffff;
      transform: translateY(50%);
    }
  }

  .box-item:nth-child(2n) {
    flex-direction: column-reverse;
    transform: translateY(100%);

    .num {
      transform: translateY(-50%);
    }
  }

  .box-item.active {
    .num {
      background-color: #4782f5;
      border-color: #4782f5;
      color: #ffffff;
    }
  }

  .mline {
    position: absolute;
    z-index: 1;
    left: 20px;
    right: 20px;
    top: 50%;
    height: 0px;
    transform: translateY(-50%);
    border-bottom: 1px dashed #99a5b7;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      width: 10px;
      height: 10px;
      background-color: #99a5b7;
      border-bottom: 1px dashed #99a5b7;
      border-radius: 50%;
      transform: translate(-100%, -50%);
    }

    &::before {
      content: "";
      position: absolute;
      right: 0;
      width: 10px;
      height: 10px;
      background-color: #99a5b7;
      border-bottom: 1px dashed #99a5b7;
      border-radius: 50%;
      transform: translate(100%, -50%);
    }
  }

  .icon_key {
    width: 16px;
    height: 16px;
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 10px;
    background-image: url("@/assets/img/icon_key.png");
  }
}
</style>
