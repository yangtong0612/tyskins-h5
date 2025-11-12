<template>
  <div class="user-wrap">
    <div class="mobile-nav d-md-none">
      <div class="avatar-area">
        <v-avatar class="avatar-box" size="60">
          <img class="avatar" :src="processImageUrl(userInfo?.avatar)" alt="" />
        </v-avatar>
        <div class="user-info">
          <div class="user-nickname">
            {{ userInfo?.nickname || "匿名用户" }}
          </div>
          <div class="user-level">Lv.{{ userInfo?.grade || 0 }}</div>
        </div>
      </div>
      <v-btn
        @click="signPopupRef.open()"
        color="#f8bc76"
        height="32"
        elevation="0"
        class="sign-btn"
      >
        签到
      </v-btn>
    </div>

    <v-container class="container-box">
      <div class="userbox">
        <v-row :no-gutters="true">
          <!-- 桌面端左侧导航 -->
          <v-col cols="3" class="d-none d-md-block">
            <div class="left-nav">
              <div class="pt-8 d-flex aj-center flex-column mx-4">
                <v-avatar
                  class="avatar-box"
                  size="90"
                  style="margin-bottom: 5px"
                >
                  <img
                    class="avatar"
                    :src="processImageUrl(userInfo?.avatar)"
                    alt=""
                  />
                </v-avatar>
                <div class="mt-2 mb-3 d-flex a-center">
                  <span class="user-nickname mr-1">{{
                    userInfo?.nickname
                  }}</span>
                  <img
                    @click="realNameRef.open()"
                    v-if="userInfo?.is_real_auth"
                    class="icon_rname"
                    src="@/assets/img/bos/icon_rname2.png"
                  />
                  <img
                    @click="realNameRef.open()"
                    v-else
                    class="icon_rname"
                    src="@/assets/img/bos/icon_rname.png"
                  />
                </div>
                <div>
                  <span class="user-level">Lv.{{ userInfo?.grade }}</span>
                </div>
                <div class="mt-4">
                  <v-btn
                    v-if="!userInfo?.is_real_auth"
                    @click="realNameRef.open()"
                    class="mr-2"
                    width="80"
                    height="30"
                    color="#ff8000"
                    elevation="0"
                  >
                    实名认证
                  </v-btn>
                  <v-btn
                    @click="signPopupRef.open()"
                    width="80"
                    height="30"
                    color="#f8bc76"
                    elevation="0"
                  >
                    签到
                  </v-btn>
                </div>
              </div>

              <div class="py-4">
                <v-tabs class="vertical-tabs" direction="vertical">
                  <v-tab to="/user/mystock">
                    <img
                      src="@/assets/img/bos/icon_001.png"
                      style="width: 18px"
                    />
                    <span>我的库存</span>
                  </v-tab>
                  <v-tab to="/user/cdk" class="tab-active">
                    <img
                      src="@/assets/img/bos/icon_001.png"
                      style="width: 18px"
                    />
                    <span>我的CDK</span>
                  </v-tab>
                  <v-tab to="/user/record">
                    <img
                      src="@/assets/img/bos/icon_002.png"
                      style="width: 12px"
                    />
                    <span>历史记录</span>
                  </v-tab>
                  <v-tab to="/user/signin">
                    <img
                      src="@/assets/img/bos/icon_004.png"
                      style="width: 14px"
                    />
                    <span>我的签到</span>
                  </v-tab>
                  <v-tab to="/user/setting">
                    <img
                      src="@/assets/img/bos/icon_003.png"
                      style="width: 15px"
                    />
                    <span>账号设置</span>
                  </v-tab>
                </v-tabs>
              </div>
            </div>
          </v-col>

          <!-- 移动端顶部标签栏 + 桌面端右侧内容 -->
          <v-col :cols="isMobile ? 12 : 9" style="width: 100vh">
            <div class="px-4 m-main-box">
              <!-- 移动端顶部标签栏（替代左侧导航） -->
              <v-tabs
                v-model="activeTab"
                class="mobile-tabs d-md-none"
                color="primary"
                slider-color="#f8bc76"
              >
                <v-tab
                  v-for="(item, index) in tabs"
                  :key="index"
                  :to="item.url"
                >
                  {{ item.name }}
                </v-tab>
              </v-tabs>

              <!-- 页面内容容器 -->
              <div class="router-box">
                <router-view />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- 弹窗组件保持不变 -->
    <q-popup
      wrapClass="popup_bg01"
      :width="isMobile ? '100%' : '400px'"
      bg=""
      height="260px"
      title="钻石转换金币"
      ref="popupRef"
    >
      <div class="pt-10">
        <div class="">
          <el-input
            v-model="num"
            style="text-align: center"
            size="large"
            placeholder="请输入数量"
          />
        </div>
        <div class="mt-3 tr fs12">
          <span class="text-gray">钻石余额{{ userInfo?.diamond }}， </span>
          <span @click="num = userInfo?.diamond" class="text-yellow cursor"
            >全部转换</span
          >
        </div>
      </div>
      <template #footer>
        <v-btn
          class="mt-4"
          @click="transformHandle()"
          block
          height="40"
          color="#f8bc76"
          elevation="0"
          >确认</v-btn
        >
      </template>
    </q-popup>

    <q-popup
      wrapClass="popup_bg02"
      :width="isMobile ? '100%' : '490px'"
      height="348px"
      bg=""
      title="Steam交易链接绑定"
      ref="steamPopupRef"
    >
      <div class="pt-4">
        <div class="">
          <el-input
            size="large"
            v-model="trade_url"
            placeholder="请输入Steam交易链接"
          />
        </div>
        <div class="mt-5">
          <el-input
            style="text-align: center"
            size="large"
            placeholder="请输入验证码"
            v-model="code"
          >
            <template #append>
              <div @click="sendPhoneCodeBefore(userInfo?.mobile)">
                {{ buttonText }}
              </div>
            </template>
          </el-input>
        </div>
        <div class="mt-5" style="width: 100%">
          <v-btn
            @click="bindUrl()"
            style="border-radius: 10px; width: 100%"
            height="40"
            color="#f8bc76"
            elevation="0"
          >
            {{ isBindTradeUrl ? "编辑" : "绑定" }}
          </v-btn>
        </div>
      </div>
      <template #footer>
        <div style="color: #999; line-height: 2em" class="fs12 mt-5">
          <div>国内用户访问Steaml时，需使用网络加速器</div>
          <div>
            建议使用网易UU加速器，可前往<span
              class="cursor"
              style="color: #f8bc76"
              >官网下载</span
            >
          </div>
          <div>
            请确认您的报价链接有效，并且设置5team库存公开。<span
              style="color: #f8bc76"
              @click="exploreTradeHref"
              class="cursor"
              >点击STEAM获取交易连接</span
            >
          </div>
        </div>
      </template>
    </q-popup>

    <q-popup
      wrapClass="popup_bg04"
      :width="isMobile ? '100%' : '694px'"
      bg=""
      height="450px"
      title=""
      ref="signPopupRef"
    >
      <div
        style="flex-direction: column; height: 350px"
        class="d-flex a-center justify-center text-white"
      >
        <div class="fs12">签到信息</div>
        <div class="fs20 mt-6">
          当月累计签到 <span class="text-yellow">{{ count_days }}</span> 天
        </div>
        <div class="mt-6">
          <v-btn
            v-if="isSing"
            style="border-radius: 10px"
            elevation="0"
            width="170"
            height="40"
            color="#f8bc76"
          >
            <span class="text-white">已签到</span>
          </v-btn>
          <v-btn
            v-else
            style="border-radius: 10px"
            elevation="0"
            @click="postSign"
            width="170"
            height="40"
            color="#f8bc76"
          >
            <span class="text-white">签到</span>
          </v-btn>
        </div>
      </div>
    </q-popup>
    <RealName ref="realNameRef"></RealName>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import QPopup from "@/components/QPopup.vue";
import { useStore, useRoute, useRouter } from "vue-router"; // 【新增】导入useRoute和useRouter
import { useStore as useVuexStore } from "@/store"; // 重命名避免冲突
const store = useVuexStore();
const route = useRoute(); // 【新增】获取当前路由实例
const router = useRouter(); // 【新增】获取路由实例
import { processImageUrl } from "@/utils";
const userInfo = computed(() => store.getters.userInfo);
import { UserService } from "@/services/UserService";
import avatar from "@/assets/img/avatar.png";
import RealName from "./RealName.vue";
import { toast } from "@/composables/util";
import { useCode } from "@/composables/useCommon";
import SignService from "@/services/SignService";
import { ElNotification, ElMessage } from "element-plus";
import { emitter } from "@/libs";
const { sendPhoneCode, buttonText } = useCode();

const steamPopupRef = ref(null);
const popupRef = ref(null);
const realNameRef = ref(null);
const signPopupRef = ref(null);

const isMobile = computed(() => window.innerWidth < 768);
const activeTab = ref("/user/cdk"); // 移动端默认激活“我的CDK”

function openPopup() {
  popupRef.value.open();
}

const trade_url = ref(store.getters.userInfo?.trade_url);
const isBindTradeUrl = !!trade_url.value;
const code = ref(null);
const num = ref("");

const bindUrl = async () => {
  const res = await UserService.bindSteam({
    trade_url: trade_url.value,
    code: code.value,
  });
  if (res.data.code == 0) {
    const msg = isBindTradeUrl ? "编辑成功" : "绑定成功";
    toast(msg);
    store.dispatch("getUserInfo");
    steamPopupRef.value.close();
    code.value = "";
  }
};

const sendPhoneCodeBefore = async (mobile) => {
  if (buttonText.value != "获取验证码") {
    return;
  }
  if (!mobile) {
    toast("请先绑定手机号", "error");
    return;
  }
  let ticket = "";
  let rand_str = "";
  if (import.meta.env.VITE_TCAPTCHA_OPEN === "true") {
    try {
      let res = await new Promise<void>((resolve, reject) => {
        let captchaAppid = import.meta.env.VITE_TCAPTCHA_APPID;
        const captcha = new window.TencentCaptcha(
          captchaAppid,
          function (res) {
            if (res.ret === 0) {
              resolve(res);
            } else {
              reject(res);
            }
          },
          {
            type: "popup",
            userLanguage: "zh-cn",
            needFeedBack: true,
          }
        );
        captcha.show();
      });
      ticket = res.ticket;
      rand_str = res.randstr;
    } catch (err) {
      ElMessage.error("验证失败");
      return false;
    }
  }
  sendPhoneCode(mobile, ticket, rand_str);
};

const postSign = async () => {
  signPopupRef.value.close();
  const postSign = await SignService.postSign();
  const res = postSign.data;
  if (res.code == 0) {
    ElNotification({
      title: "",
      message: "签到成功",
      type: "success",
    });
    emitter.emit("getSign");
  }
};

const isSing = ref(false);
const count_days = ref("");
const getSignInfo = async () => {
  const getSign = await SignService.getSign();
  let res = getSign.data;
  if (res.code == 0) {
    count_days.value = res.data.count_sign_days;
    isSing.value = res.data.signs[0].is_sign;
  }
};

const transformHandle = async () => {
  const num2 = parseFloat(num.value);
  if (!num2 || num2 <= 0) {
    toast("请输入正确的数字", "warning");
    return;
  }
  const res = await UserService.exchange({ num: num2 });
  popupRef.value.close();
  if (res.data.code == 0) {
    toast("转换成功");
    store.dispatch("getUserInfo");
  }
};

const tabs = ref([
  { name: "我的库存", url: "/user/mystock" },
  { name: "我的CDK", url: "/user/cdk" },
  { name: "历史记录", url: "/user/record" },
  { name: "账号设置", url: "/user/setting" },
]);

// 【修改】监听route.path而非store.state.route.path
watch(
  () => route.path,
  (newPath) => {
    if (isMobile.value) {
      activeTab.value = newPath;
    }
  }
);

onMounted(() => {
  getSignInfo();
});

const exploreTradeHref = () => {
  window.open(
    "https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
  );
};
</script>

<style lang="scss">
.vertical-tabs {
  .v-tab {
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-bottom: 15px;
    .v-btn__content {
      display: flex;
      align-items: center;
      img {
        margin-right: 7px;
      }
    }
  }
  .v-tab--selected {
    background-color: black;
    color: #f8bc76;
  }
  .v-btn__content .v-tab__slider {
    display: none !important;
  }
}

/* 移动端导航样式 */
.mobile-nav {
  background-color: #13161b;
  padding: 15px;
  color: #fff;
  margin-top: 70px;
  .avatar-area {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .avatar-box {
      border: 2px solid rgba(255, 255, 255, 0.4);
      margin-right: 10px;
    }
    .user-info {
      .user-nickname {
        font-size: 16px;
        font-weight: 600;
      }
      .user-level {
        font-size: 12px;
        color: #f8bc76;
      }
    }
  }
  .sign-btn {
    width: 100%;
    border-radius: 8px;
  }
}

.mobile-tabs {
  margin-bottom: 15px;
  .v-tab {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
}

@media screen and (max-width: 768px) {
  .d-md-none {
    display: block !important;
  }
  .d-md-block {
    display: none !important;
  }
  .router-box {
    padding: 10px;
  }
  .userbox {
    margin-top: 0;
  }
  .m-main-box {
    padding: 0 !important;
  }
}
</style>

<style scoped lang="scss">
.user-wrap {
  background-size: 100%;
  background-position: center bottom;
  background-repeat: no-repeat;
  .container-box {
    padding-top: 0;
  }
}

.userbox {
  min-height: 584px;
  opacity: 1;
  margin-top: 16px;
}

.left-nav {
  background-color: #13161b;
  min-height: 490px;
  color: #fff;
}

.jbimg {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.avatar-box {
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 100%;
}

.user-nickname {
  color: #ffffff;
  font: 700 18px/20px Arial;
  margin-bottom: 6px;
}

.user-level {
  position: relative;
  margin-left: 5px;
  padding: 3px 6px 2px 24px;
  height: 14px;
  line-height: 14px;
  color: #fff38d;
  font-size: 12px;
  background-color: rgba(255, 179, 0, 0.1);
  border-radius: 12px;
  &:before {
    content: "";
    position: absolute;
    left: 8px;
    top: 5px;
    width: 14px;
    height: 12px;
    background: url(@/assets/img/bos/icon_lv.png) no-repeat;
    background-position: 0px center;
    background-size: 13px;
  }
}

.router-box {
  padding: 15px;
  margin-top: 15px;
  min-height: 400px;
  margin-bottom: 15px;
  margin-left: -1px;
  margin-right: -1px;
}

.icon_rname {
  width: 16px;
}
</style>
