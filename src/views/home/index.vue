<template>
  <div class="bigbg">
    <!-- 欢迎横幅区域 -->
    <section class="welcome-section">
      <v-container>
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome to ooskins</h1>
          <p class="welcome-subtitle">
            Ready to be part of the best unboxing site? Dive in and start
            unboxing today!
          </p>
          <!-- <div class="welcome-buttons" v-if="!store.getters.userInfo">
            <v-btn class="login-btn" @click="openLogin"
              >登录</v-btn
            >
            <v-btn
              class="register-btn"
              @click="openRegister"
              >注册</v-btn
            >
          </div> -->
        </div>
      </v-container>
    </section>

    <!-- 商品过滤栏 -->
    <section class="filter-section">
      <v-container>
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
            <span v-if="filter.badge" class="filter-badge">{{
              filter.badge
            }}</span>
          </button>
        </div>

        <!-- Controls Row -->
        <div class="controls-row">
          <!-- Price Range -->
          <div class="price-range">
            <img class="coin-icon" src="@/assets/img/bos/douzi.svg" alt="" />
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
            <img class="coin-icon" src="@/assets/img/bos/douzi.svg" alt="" />
            <span class="price-value">{{ formatPrice(priceRange[1]) }}</span>
          </div>

          <!-- Sort Dropdown -->
          <div class="sort-dropdown">
            <el-select
              v-model="sortBy"
              placeholder="排序方式: 价格降序"
              class="sort-select"
              @change="handleSortChange"
            >
              <el-option label="价格降序" value="price_desc" />
              <el-option label="价格升序" value="price_asc" />
              <el-option label="名称A-Z" value="name_asc" />
              <el-option label="名称Z-A" value="name_desc" />
            </el-select>
          </div>

          <!-- Search -->
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索案例......"
              class="search-input"
              @keyup.enter="handleSearch"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </v-container>
    </section>

    <!-- 过滤后的商品展示区域 -->
    <section
      v-if="
        activeFilter !== 'official' ||
        searchKeyword ||
        priceRange[0] > 0 ||
        priceRange[1] < maxPrice
      "
      class="section filtered-products-section"
    >
      <v-container>
        <div class="product-grid">
          <div class="cases-grid">
            <case-item
              v-for="(item, index) in filteredProducts"
              :key="item.id || index"
              :item="item"
              @click="handleItemClick(item)"
            ></case-item>
          </div>
          <div v-if="filteredProducts.length === 0" class="no-products">
            <span class="text-gray">暂无商品</span>
          </div>
        </div>
      </v-container>
    </section>

    <!-- 默认分类展示（当没有过滤条件时显示） -->
    <template v-else>
      <section
        v-if="rechargeWelfareboxList.length"
        class="section section_top"
        data-myName="section_top"
      >
        <v-container>
          <div>
            <q-title title="每日充值福利箱" class="bg1"></q-title>
            <v-row class="mt-8 q-row--dense">
              <v-col
                v-for="(item, i) in rechargeWelfareboxList"
                :key="item.id"
                cols="6"
                lg="3"
                md="3"
              >
                <box-item :item="item" type="welfare"></box-item>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </section>

      <section
        v-if="keyBoxList.length"
        class="section section_top"
        data-myName="section_top"
      >
        <v-container>
          <div>
            <q-title title="钥匙箱子" class="bg1"></q-title>
            <v-row class="mt-8 q-row--dense">
              <v-col
                v-for="(item, i) in keyBoxList"
                :key="item.id"
                cols="6"
                lg="3"
                md="3"
              >
                <box-item :item="item" type="key"></box-item>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </section>
      <section
        :ref="setRefAction"
        class="section"
        :class="`section_0${index + 1}`"
        :data-myName="`section_0${index + 1}`"
        v-for="(type, index) in types"
        :key="index"
      >
        <v-container>
          <div :id="'tab' + index">
            <q-title
              :title="type?.name"
              :class="index % 2 == 0 ? 'bg2' : 'bg1'"
            ></q-title>
            <v-row class="mt-8 q-row--dense" v-if="boxListData">
              <v-col
                v-for="(item, i) in boxListData[type?.id]"
                :key="item.id"
                cols="6"
                lg="3"
                md="3"
              >
                <box-item :item="item"></box-item>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </section>
    </template>
  </div>

  <Login ref="loginRef" />
</template>

<script lang="ts" setup>
import {
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
  nextTick,
  watch,
} from "vue";
import PublicService from "@/services/PublicService";
import QTitle from "@/components/QTitle.vue";
import BoxItem from "@/components/BoxItem.vue";
import CaseItem from "@/components/CaseItem.vue";
import BoxService from "@/services/BoxService";
import WelfareBoxService from "@/services/WelfareBoxService";
import { useStore } from "@/store";
import { openLink } from "@/utils";
import { processImageUrl } from "@/utils";
import Login from "@/components/Login.vue";
import _ from "lodash";
import { Search } from "@element-plus/icons-vue";
const store = useStore();
store.dispatch("getRechargeWelfareBoxTypeId");

const loginRef = ref(null);
const openLogin = () => {
  if (loginRef.value) {
    loginRef.value.open("login");
  }
};
const openRegister = () => {
  if (loginRef.value) {
    loginRef.value.open("register");
  }
};

const state = reactive({
  boxListData: {},
  keyBoxList: [],
  recharge_welfare_box_type_id: computed(
    () => store.getters.rechargeWelfareBoxTypeId
  ),
  rechargeWelfareboxList: [],
  types: [],
  refList: [] as Array<any>,
  // 过滤相关
  filters: [
    // { label: "全部", value: "official", badge: null },
    { label: "麒麟工会", value: "qilin", badge: null },
    { label: "猩红潮汐", value: "crimson", badge: "血压" },
    { label: "终焉之门", value: "final", badge: "一九" },
    { label: "追逐黎明", value: "dawn", badge: "三七" },
    { label: "命运之锁", value: "destiny", badge: "四六、保底" },
  ],
  activeFilter: "qilin",
  priceRange: [0, 10000],
  maxPrice: 10000,
  sortBy: "price_desc",
  searchKeyword: "",
});
const {
  boxListData,
  rechargeWelfareboxList,
  types,
  keyBoxList,
  filters,
  activeFilter,
  priceRange,
  maxPrice,
  sortBy,
  searchKeyword,
} = toRefs(state);
const tabs = ref([
  // '最新盲盒',
  // '尝鲜推荐',
  // '节日限定',
  // '高爆率盲盒',
  // '武器盲盒',
  // '家族盲盒',
  // '特殊盲盒',
  // '虎年特供',
  // '一周年限定',
]);
const userInfo = computed(() => {
  return store.getters.userInfo;
});
const handleAddGroup = () => {
  openLink(
    "https://qm.qq.com/cgi-bin/qm/qr?k=Ys_DQVDu6zNYVF_P2JOvSiAx7EEl2tPD&jump_from=webapi"
  );
};
const setRefAction = (el: any) => {
  state.refList.push(el);
};

const tabActiveId = ref(0);
const jumpFlag = ref(false);
const toJump = (id, index) => {
  nextTick(() => {
    tabActiveId.value = id;
    jumpFlag.value = true;
    state.refList[index].scrollIntoView(true);
  });
};
const offettopList = ref([]);
const initDom = () => {
  nextTick(() => {
    const el = document.body; // 父元素，其内部元素滚动
    const h = el.querySelectorAll(".section");
    for (const k of h) {
      // 将所有内容的标题以及距离顶部的距离存成一个数组
      offettopList.value.push({
        offsetTop: k.offsetTop,
        name: k.getAttribute("data-myName"),
      });
    }
    el.addEventListener("scroll", handleScroll);
  });
};

const isMobile = computed(() => window.innerWidth < 600);
const handleScroll = () => {
  // 点击跳转的时候 滚动事件也会执行（所以点击的时候return）
  // if (jumpFlag.value) {
  // 	jumpFlag.value = false;
  // 	return;
  // }
  const el = document.body; // 父元素，其内部元素滚动
  console.log("aaa", el);
  if (!el) return;
  offsetTopList.value.forEach((t, i) => {
    // +50 是为了让他提前50px的时候导航栏高亮
    if (el.scrollTop + 50 >= t.offsetTop) {
      console.log(t.name);
      // tabActiveId.value = t.name;
    }
  });
};

const getKeyBoxList = async () => {
  const res = await BoxService.list({
    type_id: 39,
    box_type: 4,
    page: 1,
    page_size: 24,
  });
  state.keyBoxList = res.data.data.list;

  state.keyBoxList?.forEach(async (f, i) => {
    const bres = await BoxService.boxKeyInfo({ id: f?.key_id });

    const keyInfo = bres.data.data.box_key;
    state.keyBoxList[i].key_icon = processImageUrl(keyInfo.icon);

    if (userInfo.value) {
      const cres = await BoxService.getKeyNumByBoxId({ box_id: f?.id });
      state.keyBoxList[i].key_count = cres.data.data.count;
    }
  });
};

const getBoxList = async () => {
  let types = await getBoxAllType();
  types = _.sortBy(types, (o) => o.sort).filter(
    (type) => type.id !== state.recharge_welfare_box_type_id
  );
  tabActiveId.value = types[0].id;
  tabs.value = types;
  state.types = types;
  for (let i = 0; i < types.length; i++) {
    const item = types[i];
    if (item.id == state.recharge_welfare_box_type_id) {
      continue;
    }
    const res = await BoxService.list({
      type_id: item.id,
      page: 1,
      page_size: 24,
    });
    state.boxListData[item.id] = res.data.data.list;
    // console.log(res.data.data.list)
  }
};

const getBoxAllType = async () => {
  const res = await BoxService.allType({ type: 0 });
  return res.data.data;
};
async function getRechargeWelfareBoxList() {
  const resp = await WelfareBoxService.rechargeWelfareBoxList({
    disabled: 0,
    sorts: "+amount",
  });
  const {
    data: { list },
  } = resp.data;
  state.rechargeWelfareboxList = list;
}

// 获取所有商品列表
const getAllProducts = computed(() => {
  const allProducts: any[] = [];

  // 添加充值福利箱
  if (state.rechargeWelfareboxList && state.rechargeWelfareboxList.length > 0) {
    state.rechargeWelfareboxList.forEach((item) => {
      allProducts.push({ ...item, category: "welfare" });
    });
  }

  // 添加钥匙箱子
  if (state.keyBoxList && state.keyBoxList.length > 0) {
    state.keyBoxList.forEach((item) => {
      allProducts.push({ ...item, category: "key" });
    });
  }

  // 添加所有分类的商品
  if (state.boxListData && state.types) {
    state.types.forEach((type) => {
      const list = state.boxListData[type.id] || [];
      list.forEach((item) => {
        allProducts.push({ ...item, category: type.name, typeId: type.id });
      });
    });
  }

  return allProducts;
});

// 根据过滤条件过滤商品
const filteredProducts = computed(() => {
  let products = [...getAllProducts.value];

  // 根据过滤条件过滤
  if (state.activeFilter && state.activeFilter !== "qilin") {
    // 根据过滤条件匹配商品
    const filterMap: Record<string, string[]> = {
      qilin: ["麒麟工会", "qilin", "麒麟"],
      crimson: ["猩红潮汐", "crimson", "血压", "猩红"],
      final: ["终焉之门", "final", "一九", "终焉"],
      dawn: ["追逐黎明", "dawn", "三七", "追逐", "黎明"],
      destiny: ["命运之锁", "destiny", "四六、保底", "四六", "保底", "命运"],
      low_risk: ["低风险", "low_risk", "低"],
      medium_risk: ["中等风险", "medium_risk", "中等", "中"],
      high_risk: ["高风险", "high_risk", "高"],
      community: ["社区", "community"],
      favorites: ["收藏夹", "favorites", "收藏"],
    };

    const filterKeywords = filterMap[state.activeFilter] || [];
    if (filterKeywords.length > 0) {
      products = products.filter((item) => {
        const name = (
          item.name ||
          item.box_name ||
          item.item_name ||
          ""
        ).toLowerCase();
        const category = (item.category || "").toLowerCase();
        const typeName = (item.typeName || item.type_name || "").toLowerCase();
        const desc = (item.descr || item.description || "").toLowerCase();

        return filterKeywords.some((keyword) => {
          const lowerKeyword = keyword.toLowerCase();
          return (
            name.includes(lowerKeyword) ||
            category.includes(lowerKeyword) ||
            typeName.includes(lowerKeyword) ||
            desc.includes(lowerKeyword)
          );
        });
      });
    }
  }

  // 根据搜索关键词过滤
  if (state.searchKeyword) {
    const keyword = state.searchKeyword.toLowerCase();
    products = products.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.box_name && item.box_name.toLowerCase().includes(keyword)) ||
        (item.item_name && item.item_name.toLowerCase().includes(keyword))
    );
  }

  // 根据价格范围过滤
  products = products.filter((item) => {
    const price = item.price || 0;
    return price >= state.priceRange[0] && price <= state.priceRange[1];
  });

  // 根据排序方式排序
  if (state.sortBy === "price_desc") {
    products.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (state.sortBy === "price_asc") {
    products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (state.sortBy === "name_asc") {
    products.sort((a, b) => {
      const nameA = (a.name || a.box_name || a.item_name || "").toLowerCase();
      const nameB = (b.name || b.box_name || b.item_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (state.sortBy === "name_desc") {
    products.sort((a, b) => {
      const nameA = (a.name || a.box_name || a.item_name || "").toLowerCase();
      const nameB = (b.name || b.box_name || b.item_name || "").toLowerCase();
      return nameB.localeCompare(nameA);
    });
  }

  return products;
});

// 过滤相关方法
const setActiveFilter = (value: string) => {
  state.activeFilter = value;
};

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US");
};

const handlePriceChange = () => {
  // 价格范围变化时的处理
};

const handleSortChange = () => {
  // 排序变化时的处理
};

const handleSearch = () => {
  // 搜索处理
};

const handleItemClick = (item: any) => {
  // 处理商品点击
  console.log("Item clicked:", item);
};

onMounted(async () => {
  await getKeyBoxList();
  await getRechargeWelfareBoxList();
  await getBoxList();

  // initDom();
});

function scrollTopAnimate(id) {
  console.log(id);
  nextTick(() => {
    window.scrollTo({
      top: document.getElementById(id).offsetTop + 30,
      behavior: "smooth",
    });
  });
}
</script>

<style scoped lang="scss">
.bigbg {
  // width: 100%;
  overflow: hidden;
  background-color: #17171f;
}

.section {
  padding-top: 60px;
  padding-bottom: 80px;
  background-size: 100% 100%;
}

// 欢迎区域
.welcome-section {
  padding: 100px 0 80px;
  background: linear-gradient(
    135deg,
    rgba(243, 164, 93, 0.15) 0%,
    rgba(23, 23, 31, 0.95) 50%,
    rgba(27, 26, 35, 0.9) 100%
  );
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 0%,
      rgba(243, 164, 93, 0.1) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
}

.welcome-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f3a45d 0%, #ffcd7f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 18px;
  color: #99a5b7;
  margin-bottom: 40px;
  line-height: 1.6;
}

.welcome-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.login-btn,
.register-btn {
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  font-weight: 500;
  text-transform: none;
  border: none;
  box-shadow: none;
}

.login-btn {
  background-color: #3d3d3d !important;
  color: #cccccc !important;
}

.register-btn {
  background-color: #f3a45d !important;
  color: #222222 !important;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.register-btn:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.register-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 22px 22px 0 0;
  pointer-events: none;
}

.login-btn:hover {
  background-color: #444444 !important;
}

.section_top {
  // background-image: url('@/assets/img/bos/bg7.png');
}

.section_01 {
  // background-image: url('@/assets/img/bos/bg5.png');
}

.section_02 {
  // background-image: url('@/assets/img/bos/bg6.png');
}

.section_03 {
  // background-image: url('@/assets/img/bos/bg2.png');
}

.section_04 {
  // background-image: url('@/assets/img/bos/bg4.png');
}

.section_05 {
  // background-image: url('@/assets/img/bos/bg1.png');
}

.section_06 {
  // background-image: url('@/assets/img/bos/bg3.png');
}

.left-menu {
  position: fixed;
  left: 0;
  top: 300px;
  z-index: 999;

  & > div {
    width: 150px;
    height: 37px;
    line-height: 37px;
    background-image: url("@/assets/img/bos/bt_h.png");
    margin-bottom: 8px;
    background-size: 100% 100%;
    font-size: 14px;
    color: #ffffff;
    padding-left: 20px;
    cursor: pointer;

    &.active {
      background-image: url("@/assets/img/bos/bt.png");
      width: 170px;
    }
  }
}

.qtabs {
  position: relative;

  &::after {
    position: absolute;
    content: "";
    border-bottom: 1px solid #eee;
    left: 0;
    right: 0;
    bottom: 0px;
    z-index: 0;
  }
}

.card-box {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.card-item {
  flex-shrink: 0;
  width: 176px;
  height: 147px;
  background-color: #ccc;
  border: 1px solid #fff;
}

@media (min-width: 1280px) {
  .v-col-lg-3 {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

// 过滤栏样式
.filter-section {
  padding: 30px 0;
  background: rgba(23, 23, 31, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

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

.controls-row {
  display: flex;
  align-items: center;
  gap: 20px;
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
    flex-shrink: 0;
  }

  .price-value {
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    min-width: 60px;
    text-align: right;
  }

  .price-slider {
    flex: 1;
    margin: 0 10px;
  }
}

.sort-dropdown {
  min-width: 180px;

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    background: rgba(23, 23, 31, 0.8);
    border: 1px solid rgba(243, 164, 93, 0.2);
    border-radius: 8px;
    box-shadow: none;

    &:hover {
      border-color: rgba(243, 164, 93, 0.4);
    }

    .el-input__inner {
      color: #ffffff;
      font-size: 14px;
    }
  }

  :deep(.el-select__caret) {
    color: #ffffff;
  }
}

.search-box {
  min-width: 200px;
  flex: 0 0 250px;

  :deep(.el-input__wrapper) {
    background: rgba(23, 23, 31, 0.8);
    border: 1px solid rgba(243, 164, 93, 0.2);
    border-radius: 8px;
    box-shadow: none;

    &:hover {
      border-color: rgba(243, 164, 93, 0.4);
    }

    .el-input__inner {
      color: #ffffff;
      font-size: 14px;

      &::placeholder {
        color: rgba(153, 165, 183, 0.6);
      }
    }
  }

  :deep(.el-icon) {
    color: rgba(153, 165, 183, 0.8);
  }
}

@media screen and (max-width: 768px) {
  .filter-section {
    padding: 20px 0;
  }

  .filter-buttons {
    gap: 8px;
    margin-bottom: 16px;
  }

  .filter-btn {
    padding: 8px 14px;
    font-size: 12px;
  }

  .controls-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .price-range {
    min-width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;

    .price-value {
      text-align: left;
      min-width: auto;
    }

    .price-slider {
      margin: 0;
    }
  }

  .sort-dropdown,
  .search-box {
    min-width: 100%;
    flex: 1;
  }
}

// 商品展示区域
.filtered-products-section {
  padding: 40px 0;
}

.product-grid {
  width: 100%;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.no-products {
  padding: 80px 20px;
  text-align: center;
  color: #99a5b7;
  font-size: 14px;
}

.text-gray {
  color: #99a5b7;
}

@media screen and (max-width: 1200px) {
  .cases-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .cases-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media screen and (max-width: 600px) {
  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .welcome-section {
    padding: 40px 0;
  }

  .welcome-title {
    font-size: 32px;
  }

  .welcome-subtitle {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .welcome-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .login-btn,
  .register-btn {
    width: 200px;
  }

  .section {
    padding-top: 20px;
    padding-bottom: 20px;
    background-size: 100% 100%;

    .v-row.mt-1 {
      margin-top: 0 !important;
    }
    .v-container {
      padding-left: 0px;
      padding-right: 0px;
    }
    .mt-8 {
      margin-top: 10px !important;
    }
  }

  .left-menu {
    display: none;
  }

  .section_top {
    padding-top: 0;
  }
}
</style>
