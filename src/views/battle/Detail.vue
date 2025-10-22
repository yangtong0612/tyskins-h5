<template>
    <div class="battle-room">
        <v-container class="battle-room-container">
            <q-title v-if="!isMobile" class="bg2" title="箱子对战">
                <template #desc>
                    <span class="text-muted fs12 cursor" @click="handleBack">返回上一页</span>
                </template>
            </q-title>
            <div class="wd-mtitle wd-mtitle2">
                <span>箱子对战</span>
                <div class="desc fs12 text-muted" @click="handleBack">返回上一页</div>
            </div>
            <div class="d-flex a-center round-row">
                <div class="fs14  text-white">
                    共{{ round }}/{{ detail?.room?.rounds }}个回合
                    <span style="color: #99a5b7" class="ml-4">{{ battleStatus }}</span>
                </div>
                <div v-if="!isMobile" class="d-flex a-center flex-1 justify-center">
                    <el-switch v-model="isOpenSound" size="small" />
                    <span class="text-white fs12 mr-1">开箱音效</span>
                </div>
                <div class="d-flex a-center">
                    <span v-if="!isMobile" @click="shareBattleRoom" class="fs14 cursor text-muted">复制链接邀请好友</span>
                    <span class="fs13 ml-8 text-muted">总消耗</span>
                    <img style="width: 11px;" class="mx-2" src="@/assets/img/bos/douzi.svg" alt="" />
                    <span class="fs14 text-yellow">{{ detail?.room?.price }}</span>
                </div>
            </div>
            <div  v-if="isMobile" class="sound-row">
                <div class="d-flex a-center">
                    <el-switch v-model="isOpenSound" size="small" />
                    <span class="text-white fs12 ml-1">开箱音效</span>
                </div>
                <span  @click="shareBattleRoom" class="fs14 cursor text-muted">复制链接邀请好友</span>
            </div>

            <div style="overflow: hidden">
                <div :class="detail?.boxs.length < 6 ? 'j-center' : ''" class="d-flex case-list"
                    style="overflow-x: auto">
                    <div v-for="(box, i) in detail?.boxs" class="d-box-item" :class="{ active: i === round - 1 }">
                        <img :src="box.box_cover" />
                        <img :src="box.box_img" />
                    </div>
                </div>
            </div>

            <div class="battle-detail" v-if="detail">
                <div class="main">
                    <!-- 参与人员 -->
                    <!-- {{blocks}} -->
                    <!-- {{ detail.room.status }} -->
                    <div style="width: 100%;" class="d-flex battle-users" v-if="detail"
                        v-loading="loading.join">
                        
                        <battle-block v-for="(block, i) in blocks" :user="block.user" :awards="block.awards"
                            :room="detail.room" :key="block.key" :loading="loading.join" :skin-list="skinList"
                            :ref="(ref) => setBlockRef(i, ref)" :user-role="userRole" :round="round"
                            :comfort-award="comfortAward" :has-robot="hasRobot"
                            @join-battle="(isRobot) => joinBattle(i, isRobot)" @share="shareBattleRoom">
                        </battle-block>
                        <img v-if="detail.room.status == 1" class="battle-line" style="width: 101%; height: 20px;"
                            src="@/assets/img/bos/battle-line.png" alt="">
                    </div>
                </div>
            </div>
            <div class="boxskin-box" v-show="!loading.detail">
                <div class="d-flex py-4 a-center">
                    <div class="flex-1" style="overflow-x: auto">
                        <div class="d-flex">
                            <div style="width: 80px; height: 80px; position: relative; flex-shrink: 0;"
                                v-for="(box, i) in detail?.boxs" class="d-flex aj-center mr-1 cursor"
                                :class="{ active: i === round - 1 }">
                                <img class="abs" style="height: 60%" :src="box.box_cover"
                                    @click="getSkinList(box.box_id, i)" />
                                <img class="abs" style="height: 60%" :src="box.box_img"
                                    @click="getSkinList(box.box_id, i)" />
                            </div>
                        </div>
                    </div>
                    <div class="ml-3">
                        <span class="fs12 mr-1 sbltext text-white">显示爆率</span>
                        <el-switch v-model="showProbability" size="small" />
                    </div>
                </div>
                <div class="pb-4">
                    <BoxSkin :showProbability="showProbability" :box="activeBox2?.id ? activeBox2 : activeBox"
                        ref="boxSinkRef">
                    </BoxSkin>
                </div>
            </div>
        </v-container>
        <battle-rule ref="battleRuleRef"></battle-rule>

        <el-dialog :lock-scroll="true" :fullscreen="true" custom-class="battle-dialog" v-model="endShow"
            :retain-focus="true">
            <div class="endPopup">
                <div class="title">
                    <span>结果</span>
                    <el-icon size="20px" @click="endShow = false">
                        <Close />
                    </el-icon>
                </div>
                <div class="endshowList">
                    <div class="endshowList_item" v-for="(item, index) in endshowList" :key="index">
                        <div class="skin_img_box" :class="'bgimg_' + (item.color ? item.color.slice(1) : 'bdc2c2')">
                            <img class="skin_img" :src="item.image_url" alt="" />
                        </div>
                        <div class="text-white line1">{{ item.item_name }}</div>
                        <div class="d-flex a-center j-center py-3">
                            <img style="display: block; width: 13px;" src="@/assets/img/bos/suipian.svg" alt="" />
                            <span style="color: #FF8000;" class="fs16 ml-1">{{ item.price }}</span>
                        </div>
                    </div>
                </div>
                <div class="popup_foot">
                    <!-- <div class="text-red fs14">关闭弹窗饰品自动存入背包</div> -->
                    <div class="mt-5">
                        <v-btn  elevation="0" @click="sellAll('coin')" color="#FFB300">
                            <div class="d-flex a-center">
                                <span class="text-white">兑换</span>
                                <img class="ml-1 method2" style="width: 12px;" src="@/assets/img/bos/douzi.svg" alt="" />
                                <span class="text-white">{{ totalPrice }}</span>
                            </div>
                        </v-btn>
                        <v-btn elevation="0" @click="sellAll('diamond')" color="#FF8000" class="ml-3 btnw">
                            <div class="d-flex a-center">
                                <span class="text-white">兑换</span>
                                <img class="ml-1 method2" style="width: 12px;" src="@/assets/img/bos/suipian.svg" alt="" />
                                <span class="text-white">{{ totalPrice }}</span>
                            </div>
                        </v-btn>
                        <v-btn v-if="!isMobile" elevation="0" @click="handleBack" color="#4782F5" class="ml-3">
                            <div class="d-flex a-center">
                                <span class="text-white">继续对战</span>
                            </div>
                        </v-btn>
                    </div>
                    <div class="mt-3" v-if="isMobile">
                        <v-btn  elevation="0" width="252" height="36" @click="handleBack" color="#4782F5">
                            <div class="d-flex a-center">
                                <span class="text-white">继续对战</span>
                            </div>
                        </v-btn>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import QTitle from "@/components/QTitle.vue";
import {
    nextTick,
    computed,
    ref,
    reactive,
    watchEffect,
    onMounted,
    watch,
    toRefs,
} from "vue";
import BattleBlock from "./components/BattleBlock/BattleBlock.vue";
// import BattleSkinItem from "./components/BattleSkinItem.vue";
import BoxSkin from "@/components/BoxSkin2.vue";
import { useBattleRoomDetail } from "./services";
import { BackpackService } from "@/services/BackpackService";
import BattleRule from "./components/BattleRule.vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "@/composables/util.js";

const router = useRouter();
const route = useRoute();
const isOnRound = ref(false);

const { id } = route.params;

const roomId = id;
const {
    loading,
    detail,
    joinRoom,
    round,
    blocks,
    skinList,
    userRole,
    comfortAward,
    hasRobot,
    isOpenSound,
} = useBattleRoomDetail({
    onRound: (data): Promise<void> => {
        console.log("on round", data.battle_record[0].rounds, data);

        return new Promise((resolve) => {
            nextTick(() => {
                isOnRound.value = true;
                Promise.all(blockRef.map((block) => block.start(data))).finally(
                    resolve
                );
            });
        });
    },
    onEnd: async (data) => {
        nextTick(() => {
            console.log("onEnd", data);
            let { battle_record } = data;
            endshowList.value = data.backpacks.filter((item) => {
                return item.user_id == userInfo.value?.user_id;
            });
            let users = battle_record
                .filter((item) => item.user_id > 0)
                .map((v) => {
                    return v.user_id;
                });

            if (users.includes(userInfo.value?.user_id)) {
                endShow.value = true;
            }
        });
    },
});
const store = useStore();
const isMobile = computed(() => window.innerWidth < 600);
const endShow = ref(false);
// const endShow2 = ref(true);
const blockRef: any[] = [];
const userInfo = computed(() => store.getters.userInfo);
const backpacks = ref([]);
// const bottomRef = ref < any > ();
const boxListRef = ref<any>();
const battleRuleRef = ref<any>();
const boxSinkRef = ref<any>();
const showProbability = ref(true);
const endshowList = ref([]);
watchEffect(() => {
    const index = round.value - 1;

    nextTick(() => {
        if (index < 0) return;
        // if(!state.activeBox2) {
        // 	state.activeBox2 = detail.value?.boxs[boxIndex]
        // }
        if (boxListRef.value) {
            const elements = boxListRef.value.querySelectorAll(".box-item");
            const element = elements[index];

            const { offsetLeft, offsetWidth } = element;

            const left =
                offsetLeft - boxListRef.value.clientWidth + offsetWidth;

            if (left > 0) {
                boxListRef.value.scroll({
                    top: 0,
                    left,
                    behavior: "smooth",
                });
            }
        } else {
            // console.log("没找到元素");
        }
    });
});
const joinBattle = (i: number, isRobot: boolean) => {
    const index = i + 1;
    return joinRoom(index, isRobot).then(() => {
        console.log("加入房间成功");
    });
};

const shareBattleRoom = () => {
    const input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.value = location.href;
    document.body.appendChild(input);
    input.select();

    const result = document.execCommand("Copy");
    if (result) {
        ElMessage.success("已复制房间链接，分享给好友一起对战吧！");
        document.body.removeChild(input);
    } else {
        ElMessage.error("复制链接失败，请手动复制该页面地址");
    }
};

const openRuleDialog = () => {
    battleRuleRef.value.open();
};
const handleBack = () => {
    if (route.query.for == "history") {
        router.push("/battle?for=" + route.query.for);
        return;
    } else {
        router.push("/battle");
    }
};
const setBlockRef = (i: number, ref: any) => {
    blockRef[i] = ref;
};

const battleStatus = computed(() => {
    const status = detail.value?.room.status;
    if (status === -1) return "超时";
    if (status === 0) return "等待中";
    if (status === 1) return "进行中";
    if (status === 2) return "已结束";
});

let boxIndex = 0;
let state = reactive({
    activeBox: computed(() => {
        return detail.value?.boxs[boxIndex];
    }),
    activeBox2: {},
});

const { activeBox, activeBox2 } = toRefs(state);
const handleClickBox = (id: number) => {
    bottomRef.value.open(id);
};

const getSkinList = (id, index) => {
    boxIndex = index;
    boxSinkRef.value.getSkinList(id, roomId);
    state.activeBox2 = detail.value?.boxs[boxIndex];
};

const getUserInfo = () => {
    store.dispatch("getUserInfo");
};

const totalPrice = computed(() => {
    let price = 0;
    endshowList.value.forEach((item) => {
        price += item.price;
    });
    return price.toFixed(2);
});

const sellAll = async (convert) => {
    const ids = endshowList.value.map((item) => {
        return item.id;
    });
    if (!ids.length) {
        toast("没有可出售的饰品", "warning");
        return;
    }
    await BackpackService.batchSell({
        ids: ids,
        all_sell: false,
        convert: convert,
    });
    getUserInfo();
    toast("出售成功");
    endShow.value = false;
};

// 初始化箱子饰品列表
watch(detail, (n, o) => {
    let boxId = n.boxs[0].box_id;
    setTimeout(() => {
        getSkinList(boxId, 0);
    }, 500);
});
</script>

<style scope lang="scss">
.method2 {
	filter: grayscale(100%) brightness(200%);
}
.battle-dialog {
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: saturate(150%) contrast(50%) blur(30px);
    -webkit-backdrop-filter: saturate(150%) contrast(50%) blur(30px);
    display: flex;
    flex-direction: column;
    align-content: center;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        flex-direction: column;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.endshowList {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .endshowList_item {
        
        margin-bottom: 10px;
        text-align: center;
        width: 180px;
        position: relative;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        flex-wrap: wrap;
        &:last-child{
            margin-right: 0;
        }
        .skin_img_box{
            width: 100%;
            height: 160px;
            margin: 0 auto;
            background-size: 100%;
            background-position: center top;
            background-repeat: no-repeat;
            overflow: hidden;
            position: relative;
        }
        .skin_img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
        }
    }


}

.battle-room-container {
    background-color: #11151b;
    padding: 30px;
    margin-top: 20px;
}


.endPopup {
    width: 1200px;
    border-radius: 8px;
    overflow: hidden;

    .title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 0 20px;
        color: #ffffff;
        height: 40px;
        font-size: 20px;
        margin-bottom: 30px;
        font-weight: bold;

        .el-icon {
            position: absolute;
            right: 0;
            cursor: pointer;
        }
    }

    .popup_body {
        min-height: 200px;
        max-height: 600px;
        overflow-y: auto;
    }

    .popup_foot {
        padding: 20px 0;
        text-align: center;
    }
}

.battle-detail {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
}

.main {
    padding-bottom: 30px;

    .battle-info {
        display: flex;
        align-items: center;

        .round {
            width: 152px;
            height: 152px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            flex: none;

            .round-progress {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: rgba(40, 37, 59, 0.39);
                border: 4px solid #8e7eed;
                box-shadow: 0px 0px 24px rgba(142, 126, 237, 0.78);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                span:first-child {
                    font-size: 22px;
                    line-height: 22px;
                    font-weight: bold;
                    color: #ffffff;
                }

                span:last-child {
                    font-size: 14px;
                    line-height: 14px;
                    color: rgba(255, 255, 255, 0.7);
                }
            }

            .round-status {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                font-size: 18px;
                color: rgba(255, 255, 255, 0.56);
                text-align: center;
            }
        }

        .box-list {
            display: flex;
            flex-wrap: nowrap;
            flex: 1;
            overflow-x: auto;
            overflow-y: hidden;
            position: relative;

            .box-item {
                width: 96px;
                height: 96px;
                flex: none;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: transform 0.3s linear;

                &.active {
                    background: url(@/assets/img/battle/box-active.png) center no-repeat;
                    background-size: 90% 90%;
                    transform: scale(1.3);
                    transform-origin: center;
                    filter: brightness(120%);
                }

                img {
                    width: 66px;
                }
            }
        }

        .share-button {
            // width: 207px;
            margin: 0 32px;
            flex: none;

            >* {
                width: 86px;
                font-size: 12px;
                color: #fff;
            }
        }
    }
}

.battle-users {
    position: relative;
    margin-top: 30px;
    .battle-line {
        position: absolute;
        top: 105px;
        left: -5px;
        right: -5px;
        z-index: 999;
        margin-left: 0;
    }

    &::after {
        // content: "";
        // position: absolute;
        // left: 0;
        // right: 0;
        // top: 115px;
        // height: 2px;
        // background-color: #f9c917;
        // z-index: 9;
    }

    >* {
        margin-left: 20px;

        &:first-child {
            margin-left: 0;
        }
    }
}
</style>

<style scoped lang="scss">
.bigbg2 {
    background-size: 100%;
    background-repeat: repeat-y;
    min-height: 890px;
}

@media screen and (max-width: 600px) {
    .endshowList{
        .endshowList_item{
            width: 100px;
            .skin_img_box{
                height: 100px;
            }
            .py-3{
                padding-top: 0 !important;
            }
            
        }
    }
    .battle-line{
        top: 31px;
        left: -4px;
    }
    .battle-users{
        margin-top: 20px;
    }
    .endPopup {
        width: 100%;
    }

    .battle-detail {
        width: 100%;
    }

    .battle-info {
        padding-left: 16px;

        .round {
            width: 48px;
            height: 100px;

            .round-progress {
                width: 48px;
                height: 48px;

                span:first-child {
                    font-size: 13px;
                }

                span:last-child {
                    font-size: 12px;
                }
            }

            .round-status {
                font-size: 14px;
            }
        }

        .box-list {
            margin-left: 8px;

            .box-item {
                width: 50px;
                height: 50px;

                img {
                    width: 30px;
                }
            }
        }

        .share-button {
            // width: 85px;
            // height: 24px;
            margin-left: 32px;
            margin-right: 15px;
        }
    }

    .battle-users {
        >* {
            margin-left: 4px;
        }
    }

    .header {
        padding: 8px;

        .header-left {
            font-size: 14px;
        }

        .header-right {
            font-size: 14px;
            padding-right: 10px;
            // padding: 0 10px;

            >* {
                margin-right: 16px;
            }

            img {
                width: 17px;
                height: 17px;
                margin-right: 5px;
            }
        }
    }
}

.d-box-item {
    width: 110px;
    height: 83px;
    position: relative;
    flex-shrink: 0;
    margin-right: 65px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        position: absolute;
    }
}

.d-box-item::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    // background-color: #ffffff;
    // border: 2px solid #ccc;
    bottom: -30px;
    box-sizing: content-box;
}

.d-box-item::before {
    // content: "";
    // position: absolute;
    // width: 130px;
    // height: 0px;
    // border-top: 1px dashed #ccc;
    // bottom: 5px;
    // margin-left: 34px;
    // box-sizing: content-box;
    // transform: translateX(50%);
}

.d-box-item:last-child::before {
    width: 20px;
}

.d-box-item:last-child {
    margin-right: 0;
}

.d-box-item.active {
    // background-image: url('@/assets/img/bos/activebg.png');
    transform: scale(1.2);
}

.d-box-item.active::after {
    // background-color: #4782f5;
    // border-color: #4782f5;
    background-image: url('@/assets/img/bos/activebg.png');
    background-repeat: no-repeat;
    width: 160px;
    height: 48px;
    background-size: 100% 100%;
}

.slist {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -7px;

    .sitem {
        width: 16.666%;
        height: 214px;
        margin-bottom: 14px;

        &>div {
            padding: 0 7px;
        }
    }
}

.bslist {
    display: flex;
    margin-bottom: 14px;
    border: 1px solid red;
    height: 422px;
    overflow: hidden;

    .left {
        width: 368px;
        height: 422px;
        margin-right: 14px;

        .bitem {
            width: 368px;
            height: 442px;
            background-color: #4782f5;
            margin-bottom: 14px;
        }
    }

    .right {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        justify-content: space-between;
        align-items: flex-end;
        margin: 0 -7px;

        .sitem {
            flex: auto;
            height: 214px;
            width: 25%;
            margin-bottom: 14px;

            .right-inner {
                padding: 0 7px;
            }
        }
    }
}

.tritem {
    background-color: #745f2d;
}

.boxskin-box {
    background: #182033;
    padding-left: 14px;
    padding-right: 14px;
}

.case-list {
    padding: 50px 0;
    margin-bottom: 24px;

    &::-webkit-scrollbar {
        height: 0;
    }
    &:hover::-webkit-scrollbar {
        height: 10px;
        background: rgba(223, 229, 232, 0.75);
        border-radius: 8px;
    }

    &:hover::-webkit-scrollbar-thumb {
        background: #99a5b7;
        border-radius: 8px;
    }
}
.round-row{
    margin-top: 24px;
    margin-bottom: 24px;
}
.btnw{
    min-width: 120px !important;
}
@media screen and (max-width: 600px) {
    .case-list{
        padding: 10px 0;
        margin-bottom: 0;
        overflow: hidden;
        .d-box-item{
            margin-right: 10px;
            width: 73px;
            height: 55px;
            &.active{
                &::after{
                    width: 100px;
                    height: 30px;
                    bottom: -10px;
                }
            }
        }
    }
    .round-row{
        margin-top: 10px;
        margin-bottom: 10px;
        justify-content: space-between;
    }
    .sound-row{
        display: flex;
        justify-content: space-between;
    }
    .battle-room-container{
        margin-top: 10px;
        padding: 15px;
    }
    .m-v-container {
        padding-left: 8px;
        padding-right: 8px;
    }

    .boxskin-box {
        background-color: rgba(255, 255, 255, 0);
        padding-left: 0px;
        padding-right: 0px;
    }

    .sbltext {
        color: #ffffff;
    }

    .endPopup .popup_body {
        max-height: 300px;
    }
}

// 自定义背景色
.bgimg_d6b45b {
	// 黄
	// border-color: #FEC900;
	background-image: url('@/assets/img/bos/bgimg_gold.png');
}

.bgimg_ff8789 {
	// 红
	// border-color: #EB323F;
	background-image: url('@/assets/img/bos/bgimg_red.png');
}

.bgimg_e448e2 {
	// 粉
	// border-color: #9844b4;
	background-image: url('@/assets/img/bos/bgimg_pink.png');
}

.bgimg_4d82da {
	// 蓝
	background-image: url('@/assets/img/bos/bgimg_blue.png') !important;
}

.bgimg_bdc2c2 {
	border-color: #b7b7b7;
	background-image: url('@/assets/img/bos/bgimg_white.png') !important;
}

.wd-mtitle2{
    &::before{
        background-image: url(/src/assets/img/bos/wdkctit2.png);
    }
    border-bottom: 1px solid #3D547D;
}
</style>
