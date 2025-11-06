<template>
    <div v-if="show" class="right-drawer-wrap">
        <div @click="show = false" class="mask"></div>
        <div class="right-drawer">
            <div class="drawer-body">

                <div class="pt-2 d-flex aj-center flex-column mx-4">
                    <!-- <v-avatar class="avatar-box" size="50" style="margin-bottom: 5px;">
                        <img class="avatar" style="width: 100%;" :src="processImageUrl(userInfo?.avatar)" alt="">
                    </v-avatar> -->
                    <div class="d-flex a-center">
                        <span class="user-nickname mr-1">{{ userInfo?.nickname }}</span>
                        <img @click="realNameRef.open()" v-if="userInfo?.is_real_auth" class="icon_rname"
                            src="@/assets/img/bos/icon_rname2.png" />
                        <img @click="realNameRef.open()" v-else class="icon_rname" src="@/assets/img/bos/icon_rname.png" />
                        <div>
                        <span class="user-level">Lv.{{ userInfo?.grade }}</span>
                    </div>
                    </div>
                   
                    <div class="mt-2 mb-2">
                        <v-btn elevation="0" @click="realNameRef.open()" class="mr-2" v-if="!userInfo?.is_real_auth"
                            width="80" height="26" color="##e79d5d">实名认证</v-btn>
                        <v-btn elevation="0" @click="signPopupRef.open()" width="80" height="26" color="#FFB300"><span
                                class="text-white">签到</span></v-btn>
                    </div>
                </div>
                <div class="d-flex space-between balance-info">
                    <div class="d-flex a-center" style="width: 150px;">
                        <img class="jbimg" src="@/assets/img/bos/douzi.svg" alt="">
                        <div class="text">
                            <div class="text-gray fs12">金币</div>
                            <div class="fw600 text-yellow">{{ userInfo?.coin }}</div>
                        </div>
                    </div>
                    <div class="d-flex a-center" style="width: 150px;">
                        <img class="jbimg" src="@/assets/img/bos/suipian.svg" alt="">
                        <div class="text">
                            <div class="text-gray fs12">钻石</div>
                            <div class="fw600" style="color: #FF8000;">{{ userInfo?.diamond }}</div>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px;">
                    <v-btn @click="openPopup()" color="#e79d5d" width="100%" height="32" elevation="0">转换金币</v-btn>
                </div>

                <div class="m-steam-url">
                    <div class="tit">steam交易链接</div>
                    <div class="inputbox">

                        <div class="inp">
                            {{ store.getters.userInfo?.trade_url }}
                        </div>
                        <div @click="steamPopupRef.open()" class="btn">编辑</div>
                    </div>
                </div>
                <div class="m-user-menu">
                    <ul>
                        <li @click="goto('/user/mystock', 0)" :class="activeIndex == 0 ? 'active' : ''">
                            <img style="width: 16px;" src="@/assets/img/bos/icon_001.png">
                            <span>我的库存</span>
                        </li>
                        <li @click="goto('/user/cdk', 1)" :class="activeIndex == 1 ? 'active' : ''">
                            <img style="width: 18px;" src="@/assets/img/bos/icon_001.png">
                            <span>我的CDK</span>
                        </li>
                        <li @click="goto('/user/record', 2)" :class="activeIndex == 2 ? 'active' : ''">
                            <img style="width: 12px;" src="@/assets/img/bos/icon_002.png">
                            <span>历史记录</span>
                        </li>
                        <li @click="goto('/user/signin', 3)" :class="activeIndex == 3 ? 'active' : ''">
                            <img style="width: 14px;" src="@/assets/img/bos/icon_004.png">
                            <span>我的签到</span>
                        </li>
                        <li @click="goto('/user/setting', 4)" :class="activeIndex == 4 ? 'active' : ''">
                            <img style="width: 15px;" src="@/assets/img/bos/icon_003.png">
                            <span>账号设置</span>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="drawer-footer">
                <div @click="handleLogout" class="logout_btn">
                    退出登录
                </div>
            </div>
        </div>

        <q-popup wrapClass="popup_bg02" :width="isMobile ? '95vw' : '490px'" height="358px" bg="" title="Steam交易链接绑定"
            ref="steamPopupRef">
            <div class="pt-4">
                <div class="">
                    <el-input size="large" v-model="trade_url" placeholder="请输入Steam交易链接" />
                </div>
                <div class="mt-5">
                    <el-input style="text-align: center;" size="large" placeholder="请输入验证码" v-model="code">
                        <template #append>
                            <div @click="sendPhoneCodeBefore(userInfo?.mobile)">{{ buttonText }}</div>
                        </template>
                    </el-input>
                </div>
                <div class="mt-5" style="width: 100%;">
                    <v-btn @click="bindUrl()" style="width: 100%;" height="40" color="primary" elevation="0">{{
                        isBindTradeUrl ? '编辑' : '绑定' }}</v-btn>
                </div>
            </div>

            <template #footer>
                <div style="color: #999; line-height: 2em;" class="fs12 mt-5">
                    <div>国内用户访问Steaml时，需使用网络加速器</div>
                    <div>建议使用网易UU加速器，可前往<span class="text-blue cursor">官网下载</span></div>
                    <div>请确认您的报价链接有效，并且设置5team库存公开。<span @click="exploreTradeHref"
                            class="text-blue cursor">点击STEAM获取交易连接</span></div>
                </div>
            </template>
        </q-popup>

        <q-popup wrapClass="popup_bg01" :width="isMobile ? '95vw' : '400px'" bg="" height="260px" title="钻石转换金币"
            ref="popupRef">
            <div class="pt-10">
                <div class=""> <el-input v-model="num" style="text-align: center;" size="large" placeholder="请输入数量" /></div>
                <div class="mt-3 tr fs12"><span class="text-gray">钻石余额{{ userInfo?.diamond }}， </span> <span
                        @click="num = userInfo?.diamond" class="text-yellow cursor">全部转换</span></div>
            </div>
            <template #footer>
                <v-btn class="mt-4" @click="transformHandle()" block height="40" color="primary" elevation="0">确认</v-btn>
            </template>
        </q-popup>

         <!-- 签到弹框 -->
         <q-popup wrapClass="popup_bg04" :width="isMobile ? '94vw' : '994px'" bg="" height="450px" title=""
            ref="signPopupRef">

            <div style="flex-direction: column; height: 350px;" class="d-flex  a-center justify-center text-white">
                <div class="fs12">签到信息</div>
                <div class="fs20 mt-6">当月累计签到 <span class="text-yellow">{{ count_days }}</span> 天</div>
                <div class="mt-6">
                    <v-btn v-if="isSing" elevation="0"  width="170" height="40" color="#ffb300">
                        <span class="text-white">已签到</span>
                    </v-btn>
                    <v-btn v-else elevation="0" @click="postSign" width="170" height="40" color="#ffb300">
                        <span class="text-white">签到</span>
                    </v-btn>
                </div>
            </div>
        </q-popup>
        <RealName ref="realNameRef"></RealName>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "@/store";
import QPopup from "@/components/QPopup.vue";
const store = useStore();
import { processImageUrl } from "@/utils";
const userInfo = computed(() => store.getters.userInfo);
import { useRoute, useRouter } from "vue-router";
import { toast } from "@/composables/util";
import SignService from "@/services/SignService";
import RealName from '@/views/user/RealName.vue'
import {
    UserService
} from "@/services/UserService";
import { useCode } from "@/composables/useCommon";
const router = useRouter();
const route = useRoute();
const activeIndex = ref(0);
import { emitter } from "@/libs";
import { watch } from "vue";
const isMobile = computed(() => window.innerWidth < 600);
const { sendPhoneCode, buttonText } = useCode();

// 根据路由设置activeIndex
watch(() => route.path, (path) => {
    if (path === '/user/mystock') activeIndex.value = 0;
    else if (path === '/user/cdk') activeIndex.value = 1;
    else if (path === '/user/record') activeIndex.value = 2;
    else if (path === '/user/signin') activeIndex.value = 3;
    else if (path === '/user/setting') activeIndex.value = 4;
}, { immediate: true });

const goto = (url, index) => {
    activeIndex.value = index;
    router.push(url)
    close();
}
const popupRef = ref(null);

import { ElNotification } from 'element-plus'

function openPopup() {
    popupRef.value.open();
}
const trade_url = ref(store.getters.userInfo?.trade_url);
const steamPopupRef = ref(null);
const show = ref(false);
const code = ref(null);
const isBindTradeUrl = !!trade_url;
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

// 实名认证
const realNameRef = ref(null);
const sendPhoneCodeBefore = async (mobile) => {
    if (buttonText.value != "获取验证码") {
        return;
    }
    if (mobile == "") {
        toast("请输入手机号码", "error");
        return;
    }
    let ticket = "";
    let rand_str = "";
    if (import.meta.env.VITE_TCAPTCHA_OPEN === "true") {
        console.log("open tencent captcha");
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
                console.log(captcha);
                captcha.show(); // 显示验证码
            });
            ticket = res.ticket;
            rand_str = res.randstr;
        } catch (err) {
            console.log(err);
            ElMessage.error("验证失败");
            return false;
        }
    }

    sendPhoneCode(mobile, ticket, rand_str);
};

const num = ref("");
const transformHandle = async () => {
    const num2 = parseFloat(num.value);

    if (!num2) {
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

// 获取签到信息
const isSing = ref(false);
const count_days = ref('');
const getSignInfo = async () => {
    const getSign = await SignService.getSign();
    let res = getSign.data;
    if (res.code == 0) {
        count_days.value = res.data.count_sign_days;
        isSing.value = res.data.signs[0].is_sign
    }
}
// 签到
const signPopupRef = ref(null);
const postSign = async () => {
    signPopupRef.value.close();
    const postSign = await SignService.postSign();
    const res = postSign.data;

    if (res.code == 0) {
        ElNotification({
            title: '',
            message: '签到成功',
            type: 'success',
        })
        emitter.emit("getSign")
    }
}


emitter.on("openMenu", () => {
    open()
})

const open = () => {
    show.value = true;

    getSignInfo();
}
const close = () => {
    show.value = false;
}

function handleLogout() {
    logout()
}

function logout() {
    UserService.logout();
    commitUserToken("");
}
function commitUserToken(token) {
    store.commit("setToken", token);
    window.location.reload();
}

</script>



<style lang="scss">
.right-drawer-wrap {
    position: fixed;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99998;
    overflow: hidden;

    .mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }
}

.right-drawer {
    color: #99A5B7;
    position: fixed;
    background-color: #141221;
    width: 60%;
    top: 60px;
    bottom: 0;
    right: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;

    .drawer-body {
        flex: 1;
    }

    .balance-info {
        padding: 10px;

        .jbimg {
            width: 30px;
            margin-right: 5px;
        }
    }

    .drawer-footer {
        width: 100%;
        padding: 15px;

        .logout_btn {
            height: 32px;
            line-height: 32px;
            background: #EB4B4B;
            border-radius: 2px 2px 2px 2px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
        }
    }

    .m-steam-url {
        margin-left: 10px;
        margin-right: 10px;

        .tit {
            margin-bottom: 3px;
        }

        .inputbox {
            display: flex;
            align-items: center;

            .inp {
                flex: 1;
                height: 32px;
                line-height: 32px;
                background: #2D2F3E;
                border-radius: 2px 2px 2px 2px;
                margin-right: -2px;
                outline: none;
                color: #fff;
                text-indent: 10px;
                width: 120px;
                white-space: nowrap;
                overflow: hidden;
            }

            .btn {
                width: 53px;
                height: 32px;
                background: #e79d5d;
                border-radius: 2px 2px 2px 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                cursor: pointer;
            }
        }
    }

    .m-user-menu {
        margin-top: 20px;

        li {
            display: flex;
            height: 50px;
            align-items: center;
            padding-left: 20px;
            font-size: 14px;
            position: relative;

            img {
                margin-right: 10px;
            }

            &.active {
                border-left: 4px solid #e79d5d;
                background-color: rgba(71, 130, 245, 0.1);
            }
        }
    }
}

.avatar-box {
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-radius: 100%;
}


.user-nickname {
    color: #ffffff;
    font: 700 16px/20px Arial;
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
.icon_rname {
    width: 16px;
}
</style>