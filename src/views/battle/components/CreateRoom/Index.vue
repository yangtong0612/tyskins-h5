<template>
    <el-dialog @close="closeDialog" fullscreen custom-class="overlay-dialog" lock-scroll align-center v-bind="$attrs"
        :model-value="modelValue">


        <div class="create-room-wrap">
            <div class="create-room-container">
                <div class="createpopup-header">
                    <div>创建对战</div>
                    <el-icon size="16px" @click="backBattle">
                        <Close />
                    </el-icon>
                </div>
                <div class="createpopup-body">
                    <div class="d-flex a-center mb-1"><span :class="isMobile ? 'fs12' : 'fs16'" class="fw600">设置对战</span>
                    </div>
                    <div>
                        <v-btn-toggle class="const-btntoggle" v-model="mode" color="primary">
                            <v-btn color="#e79d5d" class="radiobtn mr-3" :width="isMobile ? '90' : '118'" :height="isMobile ? '28' : '40'"
                                value="2">双人模式
                            </v-btn>
                            <v-btn color="#e79d5d" class="radiobtn mr-3" :width="isMobile ? '90' : '118'" :height="isMobile ? '28' : '40'"
                                value="3">三人模式
                            </v-btn>
                            <v-btn color="#e79d5d" class="radiobtn mr-3" :width="isMobile ? '90' : '118'" :height="isMobile ? '28' : '40'"
                                value="4">四人模式
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                    <div>
                        <div class="d-flex a-center selectedbox-row">
                            <div class="flex-1 d-flex a-center">
                                <span class="label">已选择箱子</span>
                                <div class="selected-box-list">
                                    <div class="item" v-for="(item, index) in selectedBoxList" :key="index">
                                       <div class="imgbox">
                                         <img class="mr-1 itemimg" :src="item.img" alt="">
                                         <img class="mr-1 itemcover" :src="processImageUrl(item.cover)" alt="">
                                       </div>
                                        <span class="num">{{ item.num }}</span>
                                     
                                    </div>
                                </div>
                            </div>
                            <div v-if="!isMobile" class="d-flex a-center">
                                <span class="fs16">已选择：{{ selectInfo.boxCount }}/{{ max }}</span>
                                <span class="ml-4 fs16">价值</span>
                                <img style="width: 11px;" class="mx-1" src="@/assets/img/bos/douzi.svg" alt="">
                                <span class="fs16 text-yellow ml-1">{{ selectInfo.totalPrice }}</span>
                            </div>
                        </div>
                        <div v-if="isMobile" class="d-flex a-center">
                            <span class="fs12">已选择：{{ selectInfo.boxCount }}/{{ max }}</span>
                            <span class="ml-4 fs12">价值</span>
                            <img style="width: 11px;" class="mx-1" src="@/assets/img/bos/douzi.svg" alt="">
                            <span class="fs12 text-yellow ml-1">{{ selectInfo.totalPrice }}</span>
                        </div>
                    </div>
                    <div class="d-flex a-center mb-2 mt-2">
                        <span class="fs12">设置对战盲盒 （至多可添加{{ max }}个）</span>
                    </div>
                    <div>
                        <v-btn-toggle class="const-btntoggle" v-model="boxTypeId" color="primary" style="overflow-x: auto;">
                            <v-btn color="#e79d5d"  class="radiobtn mr-3" :width="isMobile ? '80' : '152'" :height="isMobile ? '28' : '40'"
                                v-for="boxType in boxTypes" :key="boxType.id" :value="boxType.id">{{ boxType.name }}</v-btn>
                        </v-btn-toggle>
                    </div>
                    <div class="boxlist-box" v-for="(box, key, index) in allBoxList" :key="key" v-show="boxTypeId == key">
                        <v-row :dense="isMobile ? true : false">
                            <v-col v-for="(item, index) in box" :key="index" cols="4" lg="3" md="4">
                                <box-item style="background-color:#1C2942;" @scanBoxInner="scanBoxInner" class="boxitem"
                                    :class="item.num > 0 ? 'hasnum' : ''" :noClick="true" :item="item"
                                    :showDetailsIncon="true">
                                    <template #text>
                                        <div class="px-1 py-2">
                                            <div class="d-flex px-1" style="justify-content: space-between;">
                                                <div class="fw500 line1 boxname">{{ item?.name || '月光宝盒' }}</div>
                                            </div>
                                            <div v-if="isMobile" class="d-flex a-center flex-1">
                                                <img style="width: 11px;" class="mr-1" src="@/assets/img/bos/douzi.svg"
                                                    alt="">
                                                <span class="fs12 text-yellow">{{ item?.price || '0.00' }}</span>
                                            </div>
                                            <div class="d-flex a-center">
                                                <div v-if="!isMobile" class="d-flex a-center flex-1">
                                                    <img style="width: 11px;" class="mr-1" src="@/assets/img/bos/douzi.svg"
                                                        alt="">
                                                    <span class="fs14 text-yellow">{{ item?.price || '0.00' }}</span>
                                                </div>
                                                <div class="numbox">
                                                    <i @click="minus(item)">-</i>
                                                    <span class="num">{{ item.num }}</span>
                                                    <i @click="plus(item)">+</i>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </box-item>
                            </v-col>
                            <div class="no-data" v-if="!box.length">暂无数据</div>
                        </v-row>
                    </div>
                </div>
                <div class="d-flex j-center">
                    <v-btn style="border-radius: 10px;" @click="createRoom" width="168" height="40" color="#e79d5d" elevation="0"><span class="text-white">创建房间</span></v-btn>
                </div>
            </div>

            <el-dialog :append-to-body="true" :fullscreen="true" custom-class="scan-dialog" v-model="state.dvisible">
                <div class="scan-boxSkin-dialog">
                    <div class="header">
                        <div>查看箱子详情</div>
                        <el-icon @click="state.dvisible = false" size="20">
                            <Close />
                        </el-icon>
                    </div>
                    <div class="body">
                        <div class="skin-item" v-for="(item, key) in state.boxDetail" :key="key">
                            <ShopItem :item="item">
                                <template #btns>
                                    <div class="template_btns_row">
                                        <div v-if="isMobile" class="text-yellow line1">
                                            爆率：{{ times(item.show_probability, 100) }}%
                                        </div>
                                        <div class="d-flex a-center"
                                            style="height: 26px; justify-content: space-between; width: 100%;">
                                            <div v-if="!isMobile" class="text-yellow line1">
                                                爆率：{{ times(item.show_probability, 100) }}%
                                            </div>
                                            <div class="d-flex a-center">
                                                <img style="width: 10px;" src="@/assets/img/bos/suipian.svg" alt="">
                                                <span style="color: #FF8000;" class="ml-1">{{ item.price }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </ShopItem>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, computed } from "vue";
import BoxItem from "@/components/BoxItem.vue";
import ShopItem from "@/components/ShopItem.vue";
import BoxService from "@/services/BoxService";
import BattleService from "@/services/BattleService";
import { processImageUrl, times } from "@/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 600);

// const modelValue = porp
const props = defineProps({
    modelValue: {
        type: Boolean,
    },
})


const emit = defineEmits(['update:modelValue', 'back']);

function closeDialog() {
    emit("update:modelValue", false);
}

let mode = ref("2");
const state = reactive({
    loading: false,
    boxTypes: [],
    // boxList: [],
    allBoxList: {},
    selectedBoxType: [],
    // selectedBoxList: computed(() => {
    //   return state.boxList.filter(item => item.num>0);
    // }),
    selectedBoxList: [],
    submitBoxList: [],
    boxTypeId: -1,
    activeBoxType: 0,

    selectInfo: computed(() => {
        let totalPrice = 0;
        let boxCount = 0;

        state.selectedBoxList.forEach((box) => {
            const { price, num } = box;
            totalPrice += price * num;
            boxCount += num;
        });

        return {
            totalPrice: totalPrice.toFixed(2),
            boxCount,
        };
    }),
    dvisible: false,
    showProbability: true,
    boxDetail: [],
});

const { selectedBoxList, selectInfo, boxTypes, boxTypeId, allBoxList } =
    toRefs(state);
const max = ref(20);

const disabled = computed(() => {
    return state.selectInfo.boxCount === max.value;
});

const plus = (item: any) => {
    if (state.selectInfo.boxCount === max.value) {
        ElMessage.warning(`最多只能选择${max.value}个箱子`);
        return;
    }
    const selectedBoxList = state.selectedBoxList;
    const existedBox = selectedBoxList.find((box) => {
        return box.id === item.id;
    });
    if (!existedBox) {
        state.selectedBoxList.push(item);
    }
    item.num += 1;
    // state.submitBoxList.push(item)
    // item.num += 1
};
const minus = (item) => {
    if (item.num < 1) return;
    const selectedBoxList = state.selectedBoxList;
    const existedBox = selectedBoxList.find((box) => {
        return box.id === item.id;
    });
    if (existedBox) {
        existedBox.num -= 1;
        if (existedBox.num === 0) {
            state.selectedBoxList = selectedBoxList.filter(
                (f) => f.id !== item.id
            );
            console.log(state.selectedBoxList);
        }
    }
    // item.num -= 1
};

function backBattle() {
    emit("back");
}

const getBoxTypes = () => {
    state.loading = true;

    return BoxService.allType({
        type: 1,
    })
        .then((response) => {
            const { data } = response;
            state.boxTypes = data.data;
            return data.data;
        })
        .finally(() => {
            state.loading = false;
        });
};

const getBoxs = (type_id) => {
    state.loading = true;

    return BoxService.list({
        type_id,
        page: 1,
        page_size: 999,
        box_type: 1,
    })
        .then((response) => {
            const { list, total } = response.data.data;
            const mapList = list.map((item: any) => ({
                ...item,
                img: processImageUrl(item.img),
                num: 0,
            }));
            state.boxList = mapList;
            if (!state.selectedBoxType.includes(type_id)) {
                state.allBoxList[type_id] = mapList;
            }
            state.selectedBoxType.push(type_id);
        })
        .finally(() => {
            state.loading = false;
        });
};

const initData = () => {
    getBoxTypes().then((types) => {
        const promises = types.map((type, idx) => {
            if (idx === 0) state.boxTypeId = type.id;
            return getBoxs(type.id);
        });
        Promise.all(promises);
    });
};

onMounted(() => {
    initData();
});

const createRoom = () => {
    if (!state.selectInfo.boxCount) {
        ElMessage.warning("还未选择箱子");
        return;
    }

    const { selectedBoxList } = state;
    state.loading = true;

    let box_ids = [];
    selectedBoxList.forEach((box) => {
        const { num, id } = box;
        console.log(Array(num).fill(id));
        box_ids = box_ids.concat(Array(num).fill(id));
    });

    BattleService.createRoom({
        num: mode.value,
        box_ids,
    })
        .then((res) => {
            emit("back");
            ElMessage.success("创建房间成功");
            const roomId = res.data.data.room_id;
            emit("close");
            emit("created", roomId);
            router.push(`/battle-detail/${roomId}`);
        })
        .finally(() => {
            state.loading = false;
        });
};

const getBoxAllSkin = (box_id) => {
    BattleService.boxAllSkin({
        box_id,
    }).then((res) => {
        state.boxDetail = res.data.data.sort((a, b) => b.price - a.price) || [];
    });
};

const scanBoxInner = (id) => {
    getBoxAllSkin(id);
    state.dvisible = true;
};
</script>



<style scoped lang="scss">
.selected-box-list {
    margin-left: 20px;
    display: flex;

    &>div {
        position: relative;
        width: 60px;
        height: 60px;
        // border: 1px solid rgba(255,255,255,0.1);
        margin-right: 6px;
        border-radius: 2px;

        img {
            width: 100%;
        }

        .num {
            line-height: 1em;
            position: absolute;
            right: 0px;
            color: #ffffff;
            top: 0;
            height: 14px;
            line-height: 14px;
            width: 14px;
            font-size: 10px;
            border-radius: 50%;
        }
    }
}

.create-room-wrap {
    position: absolute;
    top: 50px;
    width: 1233px;
    // height: 1023px;
    height: 840px;
    // background-image: url("@/assets/img/bos/create-room-bg.png");
    background-size: 100% 100%;
    color: #fff;
    // border: 1px solid green;
    display: flex;
    flex-direction: column;
    // transform: scale(1) translateY(-50%);
    background-color: #000a1c;
    border: 1px solid #f8bc76;
    border-radius: 10px;

    .el-icon {
        position: absolute;
        right: 50px;
        cursor: pointer;
    }
}

.createpopup-header {
    padding: 28px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    line-height: 1em;
}

.create-room-container {
    margin: 0 50px;
}

.createpopup-body {
    flex: 1;

    .boxlist-box {
        margin-top: 10px;
        margin-bottom: 5px;
        // border: 1px solid red;
        height: 470px;
        flex: 1;
        overflow: auto;
        padding-right: 15px;
        // border: 1px solid red;
    }
}

.const-btntoggle {
    flex-wrap: wrap;
    height: auto;
    border-radius: 2px;
}

.radiobtn {
    border: 1px solid #e79d5d !important;
    border-radius: 2px;
    background-color: #1c2942;
    font-size: 12px;
    color: #ffffff;
}

.v-btn--selected.radiobtn {
    border: none !important;
}

.box-coin {
    display: flex;
    align-items: center;

}

.numbox {
    flex: 1;
    display: flex;
    align-items: center;
    user-select: none;
}

.numbox i {
    font-style: inherit;
    color: #e79d5d;
    font-size: 20px;
    display: inline-block;
    width: 24px;
    height: 32px;
    line-height: 32px;
    text-align: center;
}

.num {
    display: inline-block;
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: #ffffff;
    height: 32px;
    line-height: 32px;
    background: #2C3B57;
    border-radius: 2px 2px 2px 2px;
    font-size: 14px;
    font-weight: 500;
}

.boxitem .numbox {
    // opacity: 0;
    transition: opacity 0.3s;
}

.boxitem:hover .numbox {
    opacity: 1;
}

.hasnum .numbox {
    opacity: 1;
}



.no-data {
    width: 100%;
    text-align: center;
    font-size: 13px;
    padding: 100px 0;
}
.template_btns_row{
    flex: 1;
    display: flex;
    justify-content: space-between;
}
@media screen and (max-width: 768px) {
    .template_btns_row{
        flex-direction: column;
    }
    .scan-boxSkin-dialog {
        border-radius: 0.8rem;
        width: 100vw;

        .header {
            height: 4rem;
            min-height: 4rem;
            border-radius: 0.8rem 0.8rem 0 0;
            padding-left: 2.4rem;
            padding-right: 2rem;
            width: 100%;
        }

        .body {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-row-gap: 0.8rem;
            grid-column-gap: 0.8rem;
            padding: 0.8rem;
            overflow-y: auto;
        }
    }

    .box-coin {
        margin-top: 5px;

        img {
            width: 12px;
            height: 12px;
        }

        span {
            font-size: 12px !important;
        }
    }
}



@media (min-width: 1280px) {
    .v-col-lg-3 {
        flex: 0 0 20%;
        max-width: 20%;
    }
}
</style>


<style lang="scss">
.scan-dialog {
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

    .scan-boxSkin-dialog {
        border-radius: 2px;
        width: 1003px;
        display: flex;
        flex-direction: column;

        .header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            border-radius: 8px 8px 0 0;
            padding-left: 24px;
            padding-right: 20px;
            width: 100%;
            font-size: 20px;
            margin-bottom: 20px;
            color: #333333;

            .el-icon {
                position: absolute;
                right: 20px;
                cursor: pointer;
            }
        }

        .body {
            display: grid;
            grid-template-columns: repeat(5, minmax(auto, 1fr));
            grid-row-gap: 15px;
            grid-column-gap: 15px;
            height: 442px;
            padding: 15px 30px;
            overflow-y: auto;
        }
    }
}
</style>

<style lang="scss" scoped>
.selectedbox-row {
    height: 40px;
    margin-top: 20px;

    .label {
        width: 80px;
        font-size: 14px;
    }
    .imgbox{
        position: relative;
        .itemcover{
            position: absolute;
            top: 0;
            left: 0;
        }
        .itemimg{
            position: relative;
            z-index: 2;
        }
    }


}

.boxname {
    font-size: 16px;
    margin-bottom: 4px;
}

@media screen and (max-width: 600px) {

    .scan-dialog {
        .scan-boxSkin-dialog {
            width: 100%;

            .body {
                padding: 0;
                grid-template-columns: repeat(2, minmax(auto, 1fr));
                grid-row-gap: 10px;
                grid-column-gap: 10px;
            }
        }
    }

    .selectedbox-row {

        .label {
            width: 60px;
            font-size: 12px;
        }

        .selected-box-list {
            margin-left: 0;

            .item {
                width: 40px;
                height: 40px;
            }
        }
    }

    .boxname {
        font-size: 12px;
    }

    .boxitem .numbox {
        opacity: 1;
    }

    .num {
        height: 18px;
        line-height: 18px;
    }

    .numbox i {
        height: 18px;
        line-height: 18px;
    }

    .createpopup-header {
        padding: 20px 10px 10px 10px;

        .el-icon {
            right: 30px;
        }
    }

    .create-room-wrap {
        // transform: scale(1) translateY(-50%);
        width: 98vw;
        height: 594px;

        .boxlist-box {
            height: 275px;
            padding-right: 5px;
        }
    }

    .create-room-container {
        margin: 0 20px;
    }
}
</style>
