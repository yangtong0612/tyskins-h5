<template>
    <div class="mall-bg">
        <div class=" v-container">
            <div class="category-box">
                <div class="d-flex classify-nav">
                    <div class="nav-item pl-4">
                        <div @click="getAllSkin()" class="btn" :class="activeIndex == -1 ? 'active' : ''">
                            <span class="icon">
                                <img class="allimg" src="@/assets/img/bos/allCategory.png" />
                            </span>
                            <div class="name line1">全部</div>
                        </div>
                    </div>
                    <div class="nav-item" v-for="(item, index) in categoryList" :key="index">
                        <div @click="selectCate(item, index)" class="btn" :class="activeIndex == index ? 'active' : ''">
                            <span class="icon">
                                <img :src="processImageUrl(item.icon)" />
                            </span>
                            <div class="name">{{ item.category_name }}</div>
                        </div>
                    </div>
                </div>
                <div class="d-flex px-4 py-4 mt-4">
                    <div class="flex-1 d-flex a-center">
                        <div class="mr-8 mhide">
                            <el-select class="sh-inp" @change="change" size="small" v-model="value" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                        <div class="mr-2">
                            <div @click="handleChangeSort" class="d-flex a-center cursor">
                                <img style="width: 8px;" class="mr-1" :src="state.order === 'desc' ? sort1 : sort2" alt="">
                                <span style="white-space: nowrap;" class="fs12">{{ state.order === "desc" ? '价格降序' : '价格升序'
                                }}</span>
                            </div>
                        </div>
                        <!-- <div class="d-flex align-center">
                            <span class="fs12 text-gray">最低价</span>
                            <el-input  type="number" v-model="min_price" class="w-50 mx-2 sh-inp" size="small" placeholder="" @blur="handleSearch" />
                            <span class="fs12 text-gray">B 豆</span>
                        </div>
                        <div class="d-flex align-center">
                            <span class="fs12 text-gray">最高价</span>
                            <el-input type="number" v-model="max_price" class="w-50 mx-2 sh-inp" size="small" placeholder="" @blur="handleSearch" />
                            <span class="fs12 text-gray">B 豆</span>
                        </div> -->
                    </div>
                    <div>
                        <el-input class="w-100 m-2 sh-inp" v-model="state.keyword" size="small" placeholder="搜索名称">
                            <template #append>
                                <el-button @click="handleSearch" type="primary">搜索</el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>

            <div class="px- py-6 mt-2 mallrowbox">
                <v-row class="q-row--dense">
                    <v-col v-for="(item, index) in list" :key="index" cols="6" lg="3" md="3">
                        <shop-item :rarity="false" @buy="buy(item)" :item="item"></shop-item>
                    </v-col>
                </v-row>
            </div>

            <div class="d-flex j-center pb-8 pt-4">
                <el-pagination :page-size="page_size" :total="total" background pager-count="4" hide-on-single-page
                    layout="prev, pager, next" @current-change="currentChange" />
            </div>

        </div>

        <v-dialog v-model="dialog">
            <div class="buypopup-box">
                <div class="popup-header">
                    <span>兑换商品</span>
                    <el-icon @click="dialog = false">
                        <Close />
                    </el-icon>
                </div>
                <div class="popup-body">
                    <div class="mr-4">
                        <img  class="shopimg" :src="state.currentShop.image_url" alt="">
                    </div>
                    <div class="flex-1">
                        <div class="fs16">{{ state.currentShop.item_name }}</div>
                        <div class="m-price-row">
                            <div style="color: #FF8000;" class="mt-3 d-flex a-center fs14">
                                <img style="width: 11px;" src="@/assets/img/bos/suipian.svg" alt="">
                                <span class="ml-2">{{ state.currentShop.price }}</span>
                            </div>
                            <div style="color: #FF8000;" v-if="userInfo" class="fs12 mt-3">
                                剩余 <img style="width: 11px;" src="@/assets/img/bos/suipian.svg" alt=""> {{ userInfo?.diamond }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popup-footer">
                    <v-btn style="border-radius: 10px;" @click="confirmBuy" elevation="0" width="163" height="40" color="#f3a45d">确认兑换</v-btn>
                </div>
            </div>

        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import ShopService from "@/services/ShopService";
import { ref, reactive, toRefs, onMounted, computed } from "vue";
import ShopItem from "@/components/ShopItem.vue";
// import QPopup from '@/components/QPopup.vue'
import { SkinItem } from "@/types";
import { toast } from "@/composables/util.js";
import { useStore } from "@/store";
import { parseSimpleTreeData, processImageUrl } from "@/utils";
import sort1 from "@/assets/img/bos/icon_sort1.png";
import sort2 from "@/assets/img/bos/icon_sort2.png";
const store = useStore();
const items = ref(["Foo", "Bar", "Fizz", "Buzz"]);
const value = ref("不艰外观");
const value2 = ref("0");
let currentShop: SkinItem | null = null;
const isMobile = computed(() => window.innerWidth < 600);

const state = reactive({
    userInfo: computed(() => store.getters.userInfo),
    classify: "csgo",
    shopTab: "hot",
    app_id: 730,
    type: "hot",
    order: "desc",
    list: "",
    total: "",
    keyword: "",
    exterior_name: "",
    min_price: null,
    max_price: null,
    showDialog: false,
    currentShop,
    page: 1,
    page_size: 45,
    categoryList: [],
    activeIndex: -1,
    category_ids: [],
});

const dialog = ref(false);
onMounted(() => {
    skinList();
    getSkinCategory();
});
const buy = async (skin: SkinItem) => {
    state.currentShop = skin;
    dialog.value = true;
};
const selectCate = (item, index) => {
    let ids = [];
    if (item.children && item.children.length > 0) {
        ids = item.children.map((v) => {
            return v.id;
        });
    } else {
        ids = [item.id];
    }

    state.activeIndex = index;
    state.category_ids = ids;
    skinList();
};
const getAllSkin = () => {
    state.activeIndex = -1;
    state.keyword = "";
    state.max_price = null;
    state.min_price = null;
    state.exterior_name = "";
    state.category_ids = [];
    skinList();
};
const change = () => {
    if (value.value == "不艰外观") {
        state.exterior_name = "";
    } else {
        state.exterior_name = value.value;
    }
    skinList();
};
const getSkinCategory = () => {
    ShopService.skinCategory().then((res) => {
        let list = res.data.data.list;
        let obj = {
            id: "id",
            pId: "parent_id",
            rootPId: null,
        };

        state.categoryList = parseSimpleTreeData(list, obj);
    });
};

const confirmBuy = () => {
    if (!state.userInfo) {
        toast("请登录后兑换", "warning");
        return;
    }
    ShopService.buy({
        skin_id: state.currentShop.id,
    })
        .then(() => {
            toast("兑换成功");
            store.dispatch("getUserInfo");
            dialog.value = false;
        })
        .finally(() => {
            dialog.value = false;
        });
};

// const { currentShop } = toRefs(state);
const popupRef = ref(null);

const handleChangeSort = () => {
    state.order = state.order == "desc" ? "asc" : "desc";
    skinList();
};

const currentChange = async (val) => {
    state.page = val;
    skinList();
};

const handleSearch = () => {
    skinList();
};
const skinList = async () => {
    const res = await ShopService.skinList(
        {
            app_id: state.app_id,
            type: state.type,
            order: state.order,
            category_ids: state.category_ids,
            keyword: state.keyword,
            exterior_name: state.exterior_name,
            min_price: state.min_price || null,
            max_price: state.max_price || null,
        },
        {
            page: state.page,
            page_size: state.page_size,
        }
    );
    state.list = res.data.data.list;
    state.total = res.data.data.total;
};

const options = [
    {
        value: "不艰外观",
        label: "不艰外观",
    },
    {
        value: "崭新出厂",
        label: "崭新出厂",
    },
    {
        value: "略有磨损",
        label: "略有磨损",
    },
    {
        value: "久经沙场",
        label: "久经沙场",
    },
    {
        value: "累痕累累",
        label: "累痕累累",
    },
    {
        value: "无涂装",
        label: "无涂装",
    },
    {
        value: "破损不堪",
        label: "破损不堪",
    },
];

const {
    list,
    page_size,
    total,
    userInfo,
    order,
    categoryList,
    activeIndex,
    min_price,
    max_price,
} = toRefs(state);
</script>

<style lang="scss">
.sh-inp {
    border: 1px solid #f3a55e;
    border-radius: 2px;
    overflow: hidden;

    &.el-select:hover:not(.el-select--disabled) .el-input__wrapper {
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);
    }

    .el-input__wrapper {
        background: #233132;
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);

        .el-input__inner {
            color: #ffffff;
        }

        .el-input-group__append {
            box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);
            border-radius: 2px;

        }
    }

    .el-input-group__append,
    .el-input-group__prepend {
        background-color: #f3a55e;
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0 !important;
        color: #ffffff;

    }
}
</style>

<style lang="scss" scoped>
.buypopup-box {
    width: 510px;
    height: 319px;
    background-image: url("@/assets/img/bos/buypopup_bg.png");
    background-size: 100% 100%;
    color: #ffffff;

    .popup-header {
        text-align: center;
        padding: 20px;
        font-size: 20px;
        font-weight: bold;
        position: relative;

        .el-icon {
            position: absolute;
            right: 20px;
            cursor: pointer;
        }
    }

    .popup-body {
        display: flex;
        padding: 20px 60px;
    }

    .popup-footer {
        display: flex;
        justify-content: center;
    }
}

.category-box {
    background-color: #11151b;
    color: #99a5b7;
}

.mall-bg {
    background-size: 100%;
    background-position: center bottom;
    background-repeat: no-repeat;
    min-height: 1000px;
}

.classify-nav {
    .icon {
        display: inline-block;

        width: 58px;
        height: 58px;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        img {
            width: 100%;
            filter: grayscale(100%);
        }
        .allimg{
            width: 30px;
        }
    }

    .icon01 {
        background-image: url("@/assets/img/mall/cls_01.png");
    }

    .icon02 {
        background-image: url("@/assets/img/mall/cls_02.png");
    }

    .icon03 {
        background-image: url("@/assets/img/mall/cls_03.png");
    }

    .icon04 {
        background-image: url("@/assets/img/mall/cls_04.png");
    }

    .icon05 {
        background-image: url("@/assets/img/mall/cls_05.png");
    }

    .icon06 {
        background-image: url("@/assets/img/mall/cls_06.png");
    }

    .icon07 {
        background-image: url("@/assets/img/mall/cls_07.png");
    }

    .icon08 {
        background-image: url("@/assets/img/mall/cls_08.png");
    }

    .icon09 {
        background-image: url("@/assets/img/mall/cls_09.png");
    }

    .nav-item {
        flex: 1;
        text-align: center;
        margin-right: 50px;
        font-size: 13px;
        cursor: pointer;
        max-width: 100px;
        position: relative;

        .btn {
            padding-top: 15px;
        }

        img {
            width: 55px;
        }
    }

    .nav-item:hover {
        // background-color: #e5e8ed;
    }

    .nav-item:hover .btn {
        // background-color: #e5e8ed;

        img {
            filter: grayscale(0%);
        }
    }

    .nav-item .btn.active {
        img {
            filter: grayscale(0%);
        }
    }

    .children {
        display: none;
        width: 280px;
        position: absolute;
        left: 0;
        top: 100%;
        background-color: #e5e8ed;
        padding: 15px;
        z-index: 99;

        &>div {
            float: left;
            width: 50%;

            a {
                display: block;
                border: 1px solid #99a5b7;
                background-color: #ffffff;
                padding: 5px 10px;
                color: #99a5b7;
                border-radius: 4px;

                &:hover {
                    border: 1px solid #4782f5;
                    color: #4782f5;
                }

                &.clicked {
                    border: 1px solid #4782f5;
                    color: #4782f5;
                }
            }
        }
    }

    .nav-item:hover .children {
        display: block;
    }
}

.mallrowbox {
    // background-color: #f5f5f5;
}


@media (min-width: 1280px) {
    .v-col-lg-3 {
        flex: 0 0 20%;
        max-width: 20%;
    }
}
.shopimg{
    width: 140px;
}
@media screen and (max-width: 600px) {
    .mhide {
        display: none;
    }

    .mallrowbox {
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        background-color: rgba(255, 255, 255, 0);
        overflow: hidden;
    }

    .buypopup-box{
        width: 90%;
        height: auto;
        padding-bottom: 20px;
        .popup-body{
            padding-top: 0px;
            flex-direction: column;
            align-items: center;
            .shopimg{
                width: 100px;
            }
            .m-price-row{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }

    .mall-bg {
        margin-top: 0px;

        .container-box {
            margin-top: 0px;
        }
    }

    .classify-nav{
        overflow: auto;
        .nav-item{
            text-align: center;
            margin-right: 30px;
            flex-shrink: 1;
            flex: auto !important;
        }
        .icon{
            width: 40px;
            height: 40px;
            img{
                width: 100% !important;
            }
        }
        .name{
            font-size: 10px;
            text-align: center;
        }
    }
}</style>