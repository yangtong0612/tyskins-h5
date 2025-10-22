<template>
    <div class="user-wrap">
        <v-container class="container-box">
            <!-- {{userInfo}} -->
            <div class="userbox">
                <v-row :no-gutters="true">
                    <v-col cols="3" class="mhide">
                        <div class="left-nav">
                            <div class="pt-8 d-flex aj-center flex-column mx-4">
                                <v-avatar class="avatar-box" size="90" style="margin-bottom: 5px;">
                                    <img class="avatar" style="width: 100%;" :src="processImageUrl(userInfo?.avatar)"
                                        alt="">
                                </v-avatar>
                                <div class="mt-2 mb-3 d-flex a-center">
                                    <span class="user-nickname mr-1">{{ userInfo?.nickname }}</span>
                                    <img @click="realNameRef.open()" v-if="userInfo?.is_real_auth" class="icon_rname"
                                        src="@/assets/img/bos/icon_rname2.png" />
                                    <img @click="realNameRef.open()" v-else class="icon_rname"
                                        src="@/assets/img/bos/icon_rname.png" />
                                </div>
                                <div>
                                    <span class="user-level">Lv.{{ userInfo?.grade }}</span>
                                </div>
                                <div class="mt-4">
                                    <v-btn  style="border-radius: 10px;" elevation="0" @click="realNameRef.open()" class="mr-2"
                                        v-if="!userInfo?.is_real_auth" width="80" height="30" color="#ff8000"><span class="text-white">实名认证</span></v-btn>
                                    <v-btn style="border-radius: 10px;" elevation="0" @click="signPopupRef.open()" width="80" height="30"
                                        color="#f8bc76"><span class="text-white">签到</span></v-btn>
                                </div>
                            </div>

                            <div class="py-4">
                                <v-tabs class="vertical-tabs" direction="vertical">
                                    <v-tab to="/user/mystock">
                                        <img style="width: 18px;" src="@/assets/img/bos/icon_001.png">
                                        <span>我的库存</span>
                                    </v-tab>
                                    <v-tab to="/user/record">
                                        <img style="width: 12px;" src="@/assets/img/bos/icon_002.png">
                                        <span>历史记录</span>
                                    </v-tab>
                                    <v-tab to="/user/signin">
                                        <img style="width: 14px;" src="@/assets/img/bos/icon_004.png">
                                        <span>我的签到</span>
                                    </v-tab>
                                    <v-tab to="/user/setting">
                                        <img style="width: 15px;" src="@/assets/img/bos/icon_003.png">
                                        <span>账号设置</span>
                                    </v-tab>
                                </v-tabs>
                            </div>
                        </div>
                    </v-col>
                    <v-col :cols="isMobile ? 12 : 9">
                        <div class="px-4 m-main-box">
                            <div class="right-info-box">
                                <div class="d-flex a-center space-between m-main-top">
                                    <div class="d-flex space-between">
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
                                        <v-btn  style="border-radius: 10px;" @click="openPopup()" color="#f3a45d" width="102" height="32"
                                            elevation="0">转换金币</v-btn>
                                    </div>
                                    <div class="d-flex a-center">
                                        <span class="fs12 mr-2" style="white-space: nowrap;">steam交易链接</span>
                                        <div style="height: 32px; background-color: #2D2F3E;" class="text-gray px-2 mr-2">
                                            <div class="line1" style="width: 180px; line-height: 32px;">
                                                {{ userInfo?.trade_url }}
                                            </div>
                                        </div>
                                        <v-btn style="border-radius: 10px;" @click="steamPopupRef.open()" color="#f3a45d" width="53" height="32"
                                            elevation="0">{{ isBindTradeUrl ? '编辑' : '绑定' }}</v-btn>
                                    </div>
                                </div>
                            </div>
                            <v-tabs class="bor-1px-b mhide" v-show="isMobile" color="blue darken-3">
                                <v-tab :to="item.url" v-for="(item, index) in tabs">
                                    {{ item.name }}
                                </v-tab>
                            </v-tabs>
                            <div class="router-box">
                                <router-view />
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
        <q-popup wrapClass="popup_bg01" :width="isMobile ? '100%' : '400px'" bg="" height="260px" title="钻石转换金币"
            ref="popupRef">
            <div class="pt-10">
                <div class=""> <el-input v-model="num" style="text-align: center;" size="large" placeholder="请输入数量" /></div>
                <div class="mt-3 tr fs12"><span class="text-gray">钻石余额{{ userInfo?.diamond }}， </span> <span
                        @click="num = userInfo?.diamond" class="text-yellow cursor">全部转换</span></div>
            </div>
            <template #footer>
                <v-btn class="mt-4" @click="transformHandle()" block height="40" color="#f8bc76" elevation="0">确认</v-btn>
            </template>
        </q-popup>

        <q-popup wrapClass="popup_bg02" :width="isMobile ? '100%' : '490px'" height="348px" bg="" title="Steam交易链接绑定"
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
                    <v-btn style="border-radius: 10px; width: 100%;" @click="bindUrl()"   height="40" color="#f8bc76" elevation="0">{{
                        isBindTradeUrl ? '编辑' : '绑定' }}</v-btn>
                </div>
            </div>

            <template #footer>
                <div style="color: #999; line-height: 2em;" class="fs12 mt-5">
                    <div>国内用户访问Steaml时，需使用网络加速器</div>
                    <div>建议使用网易UU加速器，可前往<span class="cursor" style="color: #f8bc76;">官网下载</span></div>
                    <div>请确认您的报价链接有效，并且设置5team库存公开。<span style="color: #f8bc76;" @click="exploreTradeHref"
                            class="cursor">点击STEAM获取交易连接</span></div>
                </div>
            </template>
        </q-popup>

        <!-- 签到弹框 -->
        <q-popup wrapClass="popup_bg04" :width="isMobile ? '100%' : '694px'" bg="" height="450px" title=""
            ref="signPopupRef">

            <div style="flex-direction: column; height: 350px;" class="d-flex  a-center justify-center text-white">
                <div class="fs12">签到信息</div>
                <div class="fs20 mt-6">当月累计签到 <span class="text-yellow">{{ count_days }}</span> 天</div>
                <div class="mt-6">
                    <v-btn style="border-radius: 10px;" v-if="isSing" elevation="0"  width="170" height="40" color="#f8bc76">
                        <span class="text-white">已签到</span>
                    </v-btn>
                    <v-btn style="border-radius: 10px;" v-else elevation="0" @click="postSign" width="170" height="40" color="#f8bc76">
                        <span class="text-white">签到</span>
                    </v-btn>
                </div>
            </div>
        </q-popup>
        <RealName ref="realNameRef"></RealName>
       
    </div>
</template>

<script lang="ts"  setup>
import { ref, reactive, computed, onMounted } from "vue";
import QPopup from "@/components/QPopup.vue";
import { useStore } from "@/store";
const store = useStore();
import { processImageUrl } from "@/utils";
const userInfo = computed(() => store.getters.userInfo);
import { UserService } from "@/services/UserService";
import avatar from "@/assets/img/avatar.png";
import RealName from './RealName.vue'
import { toast } from "@/composables/util";
import { useCode } from "@/composables/useCommon";
import SignService from "@/services/SignService";
import { ElNotification } from 'element-plus'
import { emitter } from "@/libs";
const { sendPhoneCode, buttonText } = useCode();

const steamPopupRef = ref(null);

const popupRef = ref(null);

function openPopup() {
    popupRef.value.open();
}
const isMobile = computed(() => window.innerWidth < 600);
// const trade_url = computed(()=>store.getters.userInfo.trade_url);
const trade_url = ref(store.getters.userInfo?.trade_url);
const isBindTradeUrl = !!trade_url;
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
const tabs = ref([
    {
        name: "我的库存",
        url: "/user/mystock",
    },

    {
        name: "历史记录",
        url: "/user/record",
    },
    {
        name: "账号设置",
        url: "/user/setting",
    },
]);

onMounted(() => {
    getSignInfo();
})

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
        // background: url("@/assets/img/bos/tabhl.png") no-repeat center center;
        background-size: 70% 48px;
        color: #f8bc76;
    }

    .v-btn__content .v-tab__slider {
        display: none !important;
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
    // width: 1200px;
    min-height: 584px;
    opacity: 1;
    margin-top: 24px;
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

.right-info-box {
    padding: 30px;
    background: #12161d;
    color: #ffffff;
    // background-image: url(@/assets/img/bos/user_right_topbg.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right center;
}

.router-box {
   
    padding: 20px;
    margin-top: 20px;
    min-height: 500px;
    margin-bottom: 20px;
    margin-left: -1px;
    margin-right: -1px;
}

.icon_rname {
    width: 16px;
}

@media screen and (max-width: 600px) {
    .router-box{
        padding: 15px;
    }
    .mhide {
        display: none;
    }

    .boxtitle {
        font-size: 14px;
    }

    .m-v-container {
        padding: 8px;
    }

    .m-main-box {
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-top: 0 !important;
    }

    .userbox {
        width: 100%;
        box-shadow: none;
        background-color: rgba(0, 0, 0, 0) !important;
        margin-top: 8px;
    }

    .m-main-top {
        flex-direction: column;
    }

    .m-main-boxp6 {
        padding-left: 8px !important;
        padding-right: 8px !important;
        padding-top: 16px !important;
        padding-bottom: 16px !important;
    }

    .m-main-top>div:first-child {
        width: 100%;
    }

    .m-main-top>div:last-child {
        margin-top: 10px;
    }
}

@media screen and (max-width: 768px) {
    .right-info-box{
        display: none;
    }
    .popupbox {
        .footer {
            button {
                width: 15.2rem !important;
                height: 4rem !important;
            }
        }
    }
}
</style>