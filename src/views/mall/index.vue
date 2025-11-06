<template>
    <div class="mall-bg">
        <div class="v-container">
            <!-- Cases Header -->
            <div class="cases-header">
                <div class="cases-title">
                    <div class="title-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" fill="#f3a45d"/>
                            <path d="M8 8h8v8H8V8z" fill="#f3a45d"/>
                        </svg>
                    </div>
                    <h1 class="title-text">Cases</h1>
                </div>

                <!-- Filter Buttons -->
                <div class="filter-buttons">
                    <button 
                        v-for="filter in filters" 
                        :key="filter.value"
                        class="filter-btn"
                        :class="{ active: activeFilter === filter.value }"
                        @click="setActiveFilter(filter.value)"
                    >
                        <span class="filter-label">{{ filter.label }}</span>
                        <span v-if="filter.badge" class="filter-badge">{{ filter.badge }}</span>
                    </button>
                </div>

                <!-- Controls Row -->
                <div class="controls-row">
                    <!-- Price Range -->
                    <div class="price-range">
                        <img class="coin-icon" src="@/assets/img/bos/douzi.svg" alt="">
                        <span class="price-value">{{ formatPrice(priceRange[0]) }}</span>
                        <el-slider
                            v-model="priceRange"
                            :min="0"
                            :max="maxPrice"
                            :step="100"
                            range
                            class="price-slider"
                            @change="handlePriceChange"
                        />
                        <img class="coin-icon" src="@/assets/img/bos/douzi.svg" alt="">
                        <span class="price-value">{{ formatPrice(priceRange[1]) }}</span>
                    </div>

                    <!-- Sort Dropdown -->
                    <div class="sort-dropdown">
                        <el-select 
                            v-model="sortBy" 
                            placeholder="Sort by"
                            class="sort-select"
                            @change="handleSortChange"
                        >
                            <el-option label="Price Descending" value="price_desc" />
                            <el-option label="Price Ascending" value="price_asc" />
                            <el-option label="Name A-Z" value="name_asc" />
                            <el-option label="Name Z-A" value="name_desc" />
                        </el-select>
                    </div>

                    <!-- Search -->
                    <div class="search-box">
                        <el-input
                            v-model="state.keyword"
                            placeholder="Search for cases..."
                            class="search-input"
                            @keyup.enter="handleSearch"
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>

            <!-- Product Grid -->
            <div class="product-grid">
                <div class="cases-grid">
                    <case-item 
                        v-for="(item, index) in list" 
                        :key="index" 
                        :item="item" 
                        @buy="buy(item)"
                    ></case-item>
                </div>
            </div>

            <!-- Pagination -->
            <div class="d-flex j-center pb-8 pt-4">
                <el-pagination 
                    :page-size="page_size" 
                    :total="total" 
                    background 
                    pager-count="4" 
                    hide-on-single-page
                    layout="prev, pager, next" 
                    @current-change="currentChange" 
                />
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
import CaseItem from "@/components/CaseItem.vue";
import { SkinItem } from "@/types";
import { toast } from "@/composables/util.js";
import { useStore } from "@/store";
import { parseSimpleTreeData, processImageUrl } from "@/utils";
import { Search } from '@element-plus/icons-vue';
const store = useStore();
const isMobile = computed(() => window.innerWidth < 600);

// Filters
const filters = ref([
    { label: '麒麟工会', value: 'qilin' },
    { label: '猩红潮汐', value: 'scarlet', badge: '血压' },
    { label: '终焉之门', value: 'final', badge: '一九' },
    { label: '追逐黎明', value: 'dawn', badge: '三七' },
    { label: '命运之锁', value: 'destiny', badge: '四六、保底' },
]);

const activeFilter = ref('qilin');
const priceRange = ref([0, 7265]);
const maxPrice = ref(7265);
const sortBy = ref('price_desc');
const activeCategoryIndex = ref(-1);

let currentShop: SkinItem | null = null;

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
    page_size: 18,
    category_ids: [],
});

const setActiveFilter = (value: string) => {
    activeFilter.value = value;
    skinList();
};

const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handlePriceChange = (value: number[]) => {
    state.min_price = value[0];
    state.max_price = value[1];
    skinList();
};

const handleSortChange = (value: string) => {
    if (value === 'price_desc') {
        state.order = 'desc';
    } else if (value === 'price_asc') {
        state.order = 'asc';
    }
    skinList();
};

const dialog = ref(false);
onMounted(() => {
    skinList();
    // 获取最大价格
    ShopService.skinList({}, { page: 1, page_size: 1 }).then((res) => {
        if (res.data.data.list && res.data.data.list.length > 0) {
            const prices = res.data.data.list.map((item: any) => item.price || 0);
            maxPrice.value = Math.max(...prices, 7265);
            priceRange.value[1] = maxPrice.value;
        }
    });
});
const buy = async (skin: SkinItem) => {
    state.currentShop = skin;
    dialog.value = true;
};
const getAllSkin = () => {
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
    background-color: #17171f;
    min-height: 100vh;
    padding: 40px 0;
}

// Cases Header
.cases-header {
    margin-bottom: 30px;
}

.cases-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .title-icon {
        width: 32px;
        height: 32px;
        background: #f3a45d;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title-text {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
    }
}

// Filter Buttons
.filter-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 10px 18px;
    background: rgba(23, 23, 31, 0.8);
    border: none;
    border-radius: 8px;
    color: rgba(153, 165, 183, 0.8);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    position: relative;

    &:hover {
        background: rgba(26, 26, 32, 0.9);
        color: rgba(255, 255, 255, 0.9);
    }

    &.active {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
    }

    .filter-label {
        font-weight: 500;
    }

    .filter-badge {
        background: rgba(243, 164, 93, 0.25);
        color: #f3a45d;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 4px;
        line-height: 1.2;
    }

    &.active .filter-badge {
        background: rgba(243, 164, 93, 0.35);
        color: #ffcd7f;
    }
}

// Controls Row
.controls-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.price-range {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 300px;

    .coin-icon {
        width: 16px;
        height: 16px;
    }

    .price-value {
        font-size: 14px;
        color: #ffffff;
        min-width: 60px;
    }

    .price-slider {
        flex: 1;
        max-width: 300px;

        :deep(.el-slider__runway) {
            background-color: rgba(243, 164, 93, 0.2);
            height: 4px;
        }

        :deep(.el-slider__bar) {
            background-color: #f3a45d;
        }

        :deep(.el-slider__button) {
            border-color: #f3a45d;
            width: 14px;
            height: 14px;
        }
    }
}

.sort-dropdown {
    min-width: 200px;

    .sort-select {
        width: 100%;

        :deep(.el-input__wrapper) {
            background: rgba(26, 26, 32, 0.8);
            border: 1px solid rgba(243, 164, 93, 0.2);
            border-radius: 8px;

            .el-input__inner {
                color: #ffffff;
            }
        }
    }
}

.search-box {
    flex: 1;
    min-width: 250px;
    max-width: 400px;

    .search-input {
        :deep(.el-input__wrapper) {
            background: rgba(26, 26, 32, 0.8);
            border: 1px solid rgba(243, 164, 93, 0.2);
            border-radius: 8px;

            .el-input__inner {
                color: #ffffff;

                &::placeholder {
                    color: #99a5b7;
                }
            }
        }
    }
}

// Category Tabs styles removed

// Product Grid
.product-grid {
    margin-bottom: 40px;
}

.cases-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    width: 100%;
}

@media (min-width: 1920px) {
    .cases-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (min-width: 1280px) and (max-width: 1919px) {
    .cases-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (min-width: 960px) and (max-width: 1279px) {
    .cases-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 600px) and (max-width: 959px) {
    .cases-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 599px) {
    .cases-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}

@media screen and (max-width: 600px) {
    .cases-title {
        .title-text {
            font-size: 24px;
        }
    }

    .filter-buttons {
        gap: 8px;
    }

    .filter-btn {
        padding: 6px 12px;
        font-size: 12px;
    }

    .controls-row {
        flex-direction: column;
        align-items: stretch;
    }

    .price-range {
        min-width: 100%;
    }

    .sort-dropdown,
    .search-box {
        min-width: 100%;
        max-width: 100%;
    }

    .category-tabs {
        gap: 8px;
    }

    .category-tab {
        padding: 8px 16px;
        font-size: 12px;
    }
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