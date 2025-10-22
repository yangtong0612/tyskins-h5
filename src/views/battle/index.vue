<template>
    <div class="battle-wrap">
        <v-container class="container-box" style="min-height: 1000px;">
            <!-- {{ isMobile }} -->
            <div class="battle-tabs">
                <div v-if="isMobile()" class="q-tabs">
                    <div class="q-tab-item" :class="tabIndex == index ? 'active' : ''" @click="changeTab(index)"
                        v-for="(item, index) in tabs2" :key="index">
                        {{ item }}
                    </div>
                </div>
                <div v-else class="q-tabs">
                    <div class="q-tab-item" :class="tabIndex == index ? 'active' : ''" @click="changeTab(index)"
                        v-for="(item, index) in tabs" :key="index">
                        {{ item }}
                    </div>
                </div>
                <div class="ml-auto d-flex a-center fs12">
                    <span @click="ruleRef.open()" class="fs14 mx-4 text-muted cursor mhide">活动规则</span>
                    <!-- <div class="mx-4 mhide cursor" @click="rewardRef.open()">
                        <span style="color: #EB4B4B;">榜单奖励</span>
                    </div> -->
                    <div class="mx-4 mhide cursor text-muted" @click="createBattle">
                        <span class="ml-1 fs14">创建对战</span>
                    </div>
                </div>
            </div>
            <div class="d-flex space-between m-create-btn-row mshow">
                <span @click="ruleRef.open()" class="fs12 text-muted cursor">活动规则</span>
                <div class="cursor btn" @click="createBattle">
                    <span class="ml-1">创建对战</span>
                </div>
            </div>
            <div class="container-box2" v-show="tabIndex == 0">
                <div class="d-flex m-dflex">
                    <div class="battle-left">
                        <!-- top3 昨日三甲 -->
                        <BattleTop3 @open="() => { rewardRef.open() }"></BattleTop3>
                        <!-- 实时排名 -->
                        <Runking></Runking>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <v-row dense>
                            <v-col v-for="(item, index) in roomList" :key="index" cols="6" lg="4" md="6">
                                <battle-item :detail="item"></battle-item>
                                <!-- <div style="height: 100px;background-color: red;">das</div> -->
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
            <div class="container-box2" v-show="tabIndex == 1">
                <History ref="HistoryRef"></History>
            </div>
            <div class="container-box2" v-show="tabIndex == 2">
                <div class="top3-runking">
                        <!-- top3 昨日三甲 -->
                        <BattleTop3 @open="() => { rewardRef.open() }"></BattleTop3>
                        <!-- 实时排名 -->
                        <Runking></Runking>
                    </div>
            </div>
        </v-container>
        <!-- <div class="CreateMask" v-show="isCreate">
            <CreateRoom @back="backBattle"></CreateRoom>
        </div> -->
        <!-- <v-dialog z-index="999" v-model="isCreate">
            <CreateRoom @back="backBattle"></CreateRoom>
        </v-dialog> -->
        <CreateRoom @back="backBattle" v-model="isCreate"></CreateRoom>
        <battle-rule ref="ruleRef"></battle-rule>
        <battle-rewards ref="rewardRef"></battle-rewards>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed, onMounted } from "vue";
import BattleItem from "./components/battleItem.vue";
// import BoxItem from "@/components/BoxItem.vue";
import BattleTop3 from "./components/BattleTop3.vue";
import Runking from "./components/Runking.vue";
import History from "./components/History.vue";
import CreateRoom from "./components/CreateRoom/Index.vue";
import BattleRule from "./components/BattleRule.vue";
import BattleRewards from "./components/BattleRewards.vue";

import { useBattleList } from "./services";
const { roomList } = useBattleList();
let tab = ref("tab0");
const rewardRef = ref(null);
const ruleRef = ref(null);

import { useRouter, useRoute } from "vue-router";
import { isMobile } from "@/utils";
const router = useRouter();
const route = useRoute();
const tabs = ref(["玩家对战", "历史记录"]);
const tabs2 = ref(["玩家对战", "历史记录","实时排名"]);
let isCreate = ref(false);
const createBattle = () => {
    isCreate.value = true;
};

const canJoin = computed(() => {
    return roomList.value.filter((item) => item.status == 0).length;
});
const backBattle = () => {
    isCreate.value = false;
    tab.value = "tab0";
};
const HistoryRef = ref(null);
const tabIndex = ref(0);
const changeTab = (index) => {
    tabIndex.value = index;
    if (tabIndex == 1) {
        HistoryRef.value.initData();
    }
};
onMounted(() => {
    if (route.query.for == "history") {
        tabIndex.value = 1;
        HistoryRef.value.initData();
    } else {
        tabIndex.value = 0;
    }
});
</script>

<style lang="scss" scoped>
.top3-runking{
    min-height: 300px;
}
.battle-tabs {
    position: relative;
    display: flex;
    height: 58px;
    margin-bottom: 10px;

    .text99A {
        color: #99a5b7;
    }

    .q-tabs {
        display: flex;
        align-items: center;

        .q-tab-item {
            color: #99a5b7;
            padding: 4px 24px;
            cursor: pointer;
            position: relative;
            height: 34px;
            font-size: 14px;

            &.active {
                color: #e79d5d;
                font-weight: 500;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    right: 0;
                    background-color: #e79d5d;
                    height: 3px;
                    z-index: 9;;
                }
            }
        }
    }

    &::after {
        content: "";
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 4px;
        background-color: #292931;
        height: 2px;
    }
}

.battle-wrap {
    background-size: 100%;
    background-position: center bottom;
    background-repeat: no-repeat;

    .container-box {
   
    }

    .container-box2 {
        padding-top: 0;
        padding: 30px 20px;
        margin-left: -1px;
        margin-right: -1px;
    }
}

.battle-left {
    padding-top: 0px;
    min-height: 952px;
    margin-right: 15px;
    width: 382px;
}

.mshow {
    display: none !important;
}

@media screen and (max-width: 600px) {
    .battle-wrap{
        margin-top: 295px;
        .container-box2{
            padding: 10px 10px;
        }
    }
    .m-create-btn-row{
        background-color: #11151B;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 0 !important;
        padding-bottom: 10px;
        align-items: center;
        margin-top: 0px;
        position: relative;
        z-index: 0;
        margin-bottom: 15px;
        .btn{
            width: 76px;
            height: 24px;
            background-color: #e79d5d;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
        }
    }
    .battle-tabs{
        margin-bottom: 0;
        height: 50px;
        
        .q-tabs{
            
            .q-tab-item{
                height: 28px;
                padding: 0 0;
                margin-right: 20px;
                &.active{
                   
                }
            }
        }
    }
    .battle-left {
        width: 100%;
        margin-bottom: 10px;
		min-height: inherit !important;
        margin-right: 0;
    }

    .top1-3 {
        transform: scale(0.9) translateX(-20px);
    }

    .mhide {
        display: none;
    }

    .m-dflex {
        display: flex !important;
        flex-direction: column-reverse;
    }

    .mshow {
        display: flex !important;
    }
   
}

.CreateMask {
    z-index: 99999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    transition: all 0.3s;
}</style>