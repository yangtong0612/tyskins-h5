<template>
  <div class="upgrade-bg">
    <v-container class="container-box">
      <Catetory @getAllSkin="getAllSkin" @selectCate="selectCate"></Catetory>
      <Filter
        @sort="handleChangeSort"
        :order="state.query.desc"
        @search="handleSearch"
      ></Filter>
      <div class="px-6 py-6 mt-2 mallrowbox">
        <v-row class="q-row--dense">
          <v-col
            v-for="(item, index) in listData"
            :key="index"
            cols="6"
            lg="3"
            md="3"
          >
            <!-- <shop-item style="cursor: pointer;" :showButton="false" :rarity="false" @click="goDetail(item)" :item="item"></shop-item> -->
            <div class="skin-item" @click="goDetail(item)">
              <img class="skin_img" :src="item?.image_url" alt="" />
              <div class="text-group">
                <div class="skin_price">
                  <img
                    referrerpolicy="no-referrer"
                    style="width: 12px"
                    class="mr-1"
                    src="@/assets/img/bos/suipian.svg"
                    alt=""
                  />{{ item?.price }}
                </div>
                <div class="skin_name line1">
                  {{ item?.item_name || "秋叶原之选" }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex j-center pb-8 pt-4">
        <el-pagination
          :page-size="query.page_size"
          :total="total"
          background
          pager-count="4"
          hide-on-single-page
          layout="prev, pager, next"
          @current-change="currentChange"
        />
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
export const upgradeAnimationDuraction = 6000;
export interface SkinItem {
  id: number;
  exterior_name: string;
  image_url: string;
  short_name: string;
  price: number;
  rarity_color: string;
  price_info: {
    price: number;
    quantity: number;
    autoDeliverPrice: number;
    autoDeliverQuantity: number;
    manualDeliverPrice: number;
    manualQuantity: number;
  };
}
</script>
<script lang="ts" setup>
import { reactive, toRefs, watch, ref, computed, onMounted } from "vue";
import Catetory from "./components/catetory.vue";
import Filter from "./components/filter.vue";
import ShopItem from "@/components/ShopItem.vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
const store = useStore();
import TopService from "@/services/TopService";
// import Award from '@/components/award.vue'

const router = useRouter();

let state = reactive({
  query: {
    page_size: 45,
    page: 1,
    keyword: "",
    desc: "true",
    category_id: null,
  },
  listData: [] as SkinItem[],
  total: 0,
  loading: false,
  rangeIndex: 0,
  selectSkin: null as null | SkinItem,
});

const { listData, rangeIndex, query, total, loading, selectSkin } =
  toRefs(state);

const price_range = [0, [10, 50], [50, 300], [300, 1000], [1000]];

const fetch = () => {
  state.loading = true;

  let min_price = "";
  let max_price = "";
  const { rangeIndex } = state;

  if (rangeIndex) {
    min_price = price_range[rangeIndex][0];
    max_price = price_range[rangeIndex][1] || 999999;
  }

  TopService.getUpgradeSkinList({
    ...state.query,
    min_price,
    max_price,
  })
    .then((response) => {
      const { list, total } = response.data.data;
      state.total = total;
      state.listData = list;
    })
    .finally(() => (state.loading = false));
};

const handleClickPrice = (index: number) => {
  if (state.rangeIndex !== index) {
    state.rangeIndex = index;
  }
  state.query.page = 1;
  fetch();
};

const handleSearch = (e) => {
  state.query.keyword = e;
  state.query.page = 1;
  fetch();
};

const handleClickSkin = (skin: SkinItem) => {
  const { selectSkin } = state;
  if (selectSkin) {
    if (skin.id === selectSkin.id) {
      state.selectSkin = null;
      return;
    }
  }
  state.selectSkin = skin;
};

const handleChangeSort = () => {
  const desc = state.query.desc === "true" ? "false" : "true";
  state.query.desc = desc;
  fetch();
};

const selectCate = (ids) => {
  console.log("selectCate", ids);
  state.query.category_id = ids;

  fetch();
};

const getAllSkin = () => {
  console.log("getAllSkin");
  state.query.page = 1;
  state.query.keyword = "";
  state.query.max_price = null;
  state.query.min_price = null;
  state.query.exterior_name = "";
  state.query.category_id = null;
  fetch();
};

function goDetail(skin) {
  store.commit("setUpgradeSkin", skin);
  router.push("/upgradeDetail");
}

const currentChange = async (val) => {
  state.query.page = val;
  fetch();
};

onMounted(() => {
  fetch();
});
</script>

<style lang="scss" scoped>
.skin-item {
  position: relative;
  background: linear-gradient(
      180deg,
      rgba(73, 78, 84, 0) -7.98%,
      hsla(216, 9%, 55%, 0.237) 83.46%
    ),
    #21212c;
  border-radius: 10px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .skin_img {
    width: 70%;
  }

  .text-group {
    border-radius: 10px;
    transition: all 0.3s;
    border: 1px solid rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 10px;
    .skin_price {
      text-align: right;
      color: #f3a55e;
      padding: 10px;
      display: flex;
      align-items: center;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
    }
    .skin_name {
      text-align: right;
      color: #ffffff;
      padding: 10px;
      font-size: 12px;
      width: 100%;
      height: 24px;
    }
  }
  &:hover .text-group {
    border: 1px solid #e69d5d;
    box-shadow: inset 0 0 30px rgba(230, 157, 93, 0.35);
  }
}
.upgrade-bg {
  background-color: #17171f;
  // background-image: url("@/assets/img/bos/page-bottombg.png");
  background-size: 100%;
  background-position: center bottom;
  background-repeat: no-repeat;
  min-height: 1000px;

  .container-box {
    background: #17171f;
    box-shadow: 0px 1px 20px 1px rgba(0, 0, 0, 0.08);
  }
}

.upgrade-main {
  position: relative;
  padding: 20px 20px 0;
  overflow-x: hidden;
}

.upgrade-main .bg {
  position: absolute;
  top: -225px;
  width: 2717px;
  height: 768px;
  left: -262px;
  /* background-image: url('../../assets/img/storebg.png'); */
  background-size: contain;
  z-index: -1;
}

.mall-main-content {
  box-sizing: border-box;
  width: 1350px;
  margin: 0 auto;
  padding-top: 20px;
}

.price {
  background: #17181c;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  font-size: 20px;
  padding: 10px;
  position: relative;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.price > div {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.price > div svg {
  display: inline-block;
  fill: currentcolor;
  width: 20px;
  height: 20px;
}

.price > div svg path {
  fill: #ecc214;
}

.mall-wrap-list .item .inner .item-info.rarity_2 {
  background-image: url(../../assets/img/2.png);
  border-bottom-color: #5e98d9;
}

.mall-wrap-list .item .inner .item-info.rarity_4 {
  background-image: url(../../assets/img/4.png);
  border-bottom-color: #6238cb;
}

.mall-wrap-list .item .inner .item-info.rarity_1 {
  background-image: url(../../assets/img/1.png);
  border-bottom-color: #5c5c62;
}

.price::before {
  content: "";
  position: absolute;
  top: 0;
  height: 2px;
  width: 100%;
  background: #5c5c62;
}

/* 2.png */

.price_5e98d9::before {
  background: #4784b8;
}

/* 3.png */

.price_4b69ff::before {
  background: #2471e3;
}

/* 4.png */

.price_d32ce6::before {
  background: #8524ec;
}

/* 5.png */

.price_8847ff::before {
  background: #db1cec;
}

/* 6.png */

.price_eb4b4b::before {
  background: #ec351c;
}

/* 7.png */

.price_e4ae39::before {
  background: #fdff42;
}

/* 1.png */

.price_b0c3d9::before {
  background: #5c5c62;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .v-container {
    padding-left: 0px;
    padding-right: 0px;
  }
  .upgrade-bg {
    margin-top: 0;
    .container-box {
      margin-top: 0 !important;
      .mallrowbox {
        margin-top: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        overflow: hidden;
      }
    }
  }
  .upgrade-main {
    padding: 10px;
  }

  .mall-main-content {
    width: auto;
    padding-top: 0px;
  }
}

@media (min-width: 1280px) {
  .v-col-lg-3 {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
