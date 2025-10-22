<template>
    <div>
        <div v-show="!isMobile">
            <div class="d-flex">
                <div  class="flex-1 text-white" style="font-size: 22px;">我的库存</div>
                <div v-if="list.length">
                    <v-btn style="border-radius: 10px;" @click="batchSell" color="#FF8000" height="32" class="mr-3" elevation="0">
                            <span class="fs14 text-white">兑换{{ totalPrice }}</span>
                        </v-btn>
                        <v-btn style="border-radius: 10px;" @click="sellAll" color="#f8bc76" width="104" height="32" elevation="0">
                            <span class="fs14 text-white">一键兑换</span>
                        </v-btn>

                </div>
            </div>
            
        </div>
        <div>
            <div class="wd-mtitle">
                <span>我的库存</span>
            </div>

            <div v-if="list.length" class="m-dhbtn">
               <div>
                <v-btn style="border-radius: 10px;" width="100%" @click="batchSell" color="#FF8000" height="32" class="mr-3" elevation="0">
                    <span class="fs14 text-white">兑换{{ totalPrice }}</span>
                </v-btn>
               </div>
                <div>
                    <v-btn style="border-radius: 10px;" width="100%" @click="sellAll" color="#f8bc76" height="32" elevation="0">
                    <span class="fs14 text-white">一键兑换</span>
                </v-btn>
                </div>
            </div>

            <div class="d-flex" style="flex-wrap: wrap; margin-right: -8px; margin-left: -8px;">
                <!-- width:25%; -->
                <div v-for="(item, index) in list" :key="index" :style="isMobile ? 'width:50%;' : ''" class="shop-item">
                    <div class="px-2 py-2">
                        <shop-item :item="item" :rarity="false">
                            <template #check>
                                <div class="check" @click="selectHandle(item)">
                                    <el-icon v-if="item.selected" color="#ff8000" :size="20">
                                        <CircleCheckFilled />
                                    </el-icon>
                                    <el-icon v-else color="rgba(255,255,255,0.2)" :size="20">
                                        <CircleCheckFilled />
                                    </el-icon>

                                </div>
                            </template>
                            <template #btns>
                                <div class="d-flex mt-2">
                                    <v-btn style="border-radius: 10px;" @click="sell(item.id)" width="110" height="22" elevation="0" color="#FF8000">
                                    <span class="text-white fs12">兑换{{ item.price }}</span>
                                </v-btn>
                                <v-btn style="border-radius: 10px; margin-left: 2px;" @click="retrieve(item.id)"   height="22" elevation="0" color="#f8bc76">
                                    <span class="fs12">提取</span>
                                </v-btn>
                                </div>
                            </template>
                        </shop-item>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-center my-5">
                <el-pagination :page-size="page_size" :total="total" :pager-count="isMobile ? 5 : 7" background
                    hide-on-single-page layout="prev, pager, next" @current-change="currentChange">
                </el-pagination>
            </div>
        </div>
        <confirm-box ref="confirmBox"></confirm-box>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, computed } from "vue";
import avatar from "@/assets/img/avatar.png";
import QTitle from "@/components/QTitle.vue";
import ShopItem from "@/components/ShopItem.vue";
import { BackpackService } from "@/services/BackpackService";
import { toast } from "@/composables/util";
import { useStore } from "@/store";
import { ElMessageBox, ElNotification } from "element-plus";

const store = useStore();
const state = reactive({
    list: [],
    selectID: [],
    total: 0,
    currentPage: 1,
    page_size: 12,
    loading: {
        list: false,
        handle: false,
    },
    paperCount: 0,
});
const isMobile = computed(() => window.innerWidth < 600);
const { list, total, page_size } = toRefs(state);

const selectHandle = (item) => {
    item.selected = !item.selected;
}
const isSelect = computed(() => {
    let len = state.list.filter(i => {
        return i.selected;
    }).length;
    if (len > 0) {
        return true;
    } else {
        return false;
    }
})

// 计算已选id
const ids = computed(() => {
    let selectedList = state.list.filter(item => item.selected);
    return selectedList.map(v => {
        return v.id
    })
})

// 计算已选兑换总价
const totalPrice = computed(() => {
    let selectedList = state.list.filter(item => item.selected);
    let price = 0;
    selectedList.forEach(item => {
        price += item.price;
    })
    return price.toFixed(2);
})

// 全选 取消全选
const isAllSelect = ref(false)
const selectAll = () => {
    if (isAllSelect.value) {
        state.list.map(v => {
            v.selected = false
            return v;
        })
        isAllSelect.value = false;
    } else {
        state.list.map(v => {
            v.selected = true
            return v;
        })
        isAllSelect.value = true;
    }

}

// 计算已选数量
const quantity = computed(() => {
    let selectedList = state.list.filter(item => item.selected);
    return selectedList.length
})

const currentChange = (val) => {
    state.currentPage = val;
    getList();
};

const getList = async () => {
    // this.loading.list = true;
    const res = await BackpackService.list({
        page: state.currentPage,
        page_size: state.page_size,
    }).finally(() => {
        // this.loading.list = false;
    });
    state.list = res.data.data.list;
    state.total = res.data.data.total;
    state.paperCount = Math.ceil(state.total / state.page_size);
};

onMounted(async () => {
    await getList();
});

const sell = async (id) => {
    ElMessageBox.confirm("确认出售？")
        .then(async () => {
            state.loading.handle = true;
            BackpackService.sell({
                id,
                convert: "diamond",
            })
                .then(() => {
                    if (state.list.length === 1) {
                        if (state.currentPage > 1) {
                            state.currentPage--;
                        }
                    }
                    toast("兑换成功！");
                    refresh();
                })
                .finally(() => {
                    state.loading.handle = false;
                });
        })
        .catch(() => {
            // catch error
        });
};
const trade_url = computed(() => store.getters.userInfo?.trade_url);

const retrieve = async (id) => {
    if (!trade_url.value) {
        toast("请先绑定交易链接", "warning");
        return;
    }

    ElMessageBox.confirm("确认提货？")
        .then(async () => {
            state.loading.handle = true;
            await BackpackService.retrieveSkin2({ backpack_id: id })
                .then(() => {
                    if (state.list.length === 1) {
                        if (state.currentPage > 1) {
                            state.currentPage--;
                        }
                    }
                    refresh();
                    toast("提交成功，请耐心等待发货");
                })
                .finally(() => {
                    state.loading.handle = false;
                });
        })
        .catch(() => {
            // catch error
        });
};
const getUserInfo = () => {
    store.dispatch("getUserInfo");
};
const refresh = () => {
    getList();
    getUserInfo();
};


// 兑换
const batchSell = async () => {

    if (!ids.value.length) {
        ElNotification({
            message: "请选择兑换的饰品",
            type: "warning",
        });
        return;
    }

    // const ids = state.list.map((item) => {
    //     return item.id;
    // });

    ElMessageBox.confirm("确认兑换？").then(() => {
        console.log(ids);
        state.loading.handle = true;
        BackpackService.batchSell({
            ids: ids.value,
            convert: "diamond",
        })
            .then(() => {
                toast("兑换成功！");
                refresh();
            })
            .finally(() => {
                state.loading.handle = false;
            });
    });
};

const sellAll = async () => {
    if (!state.list.length) {
        ElNotification({
            message: "当前背包没有可兑换的饰品",
            type: "warning",
        });
        return;
    }
    ElMessageBox.confirm("确认兑换？").then(() => {
        state.loading.handle = true;
        BackpackService.batchSell({
            all_sell: true,
            convert: "diamond",
        })
            .then(async () => {
                state.currentPage = 1;
                toast("兑换成功！");
                refresh();
            })
            .finally(() => {
                state.loading.handle = false;
            });
    });
};
</script>

<style scoped lang="scss">


.userbox {
    width: 1200px;
    min-height: 584px;
    background: rgba(245, 245, 245, 1);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.21);
    opacity: 1;
}

.left-nav {
    background-color: #ffffff;
    min-height: 584px;
}

.buttons button:hover {
    color: #fff !important;
    background-color: rgba(var(--v-theme-primary));
}

@media (min-width: 1280px) {
    .shop-item {
        width: 25% !important;
    }
}

@media (min-width: 960px) {
    .shop-item {
        width: 33.33%;
    }
}

.check {
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
    z-index: 9;

    .el-icon {
       
    }
}
</style>

<style lang="scss" scoped>
.m-dhbtn{
    display: none;
}
@media screen and (max-width: 768px) {

    .m-dhbtn{
        margin-top: 10px;
        display: flex;
        
        &>div{
            flex: 1;
        }
        &>div:nth-child(1){
            padding-right: 7px;
        }
        &>div:nth-child(2){
            padding-left: 7px;
        }
    }
}
</style>