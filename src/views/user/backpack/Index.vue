<template>
  <div class="px-5 backpack" v-loading="loading.handle">
    <div v-if="list.length" class="py-6" style="border-bottom: 1px solid #4c4c53">
      <v-row>
        <v-col class="d-flex header-font align-center" cols="12">
          <v-row class="align-center">
            <div class="all-sell mr-1" @click="batchSell">
              <!-- <img
              class="mr-1"
              src="@/assets/img/icon/menu2.png"
              style="height: 22px"
            /> -->
              <p>当前页出售</p>
            </div>

            <!-- <div
            class="d-flex cursor-pointer mr-4"
            @click="currentChange(currentPage)"
          >
            <img
              class="mr-1"
              src="@/assets/img/icon/refresh.png"
              style="height: 22px"
            />
            <p>刷新</p>
          </div> -->

            <div class="all-sell" @click="sellAll">
              <p>出售全部饰品</p>
            </div>

            <template v-if="list.length">
              <v-spacer></v-spacer>

              <span class="text-red text-right">饰品请及时取回</span>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <div class="py-6 pack">
      <div v-if="list.length > 0">
        <v-row no-gutters class="mb-3">
          <v-col v-for="item in list" cols="6" sm="3" md="3" lg="2" xl="2" class="my-1">
            <div class="img pa-2 ma-1 d-flex flex-column pack-item">
              <div class="bac-icon">
                <div class="bac" :style="{
                  'box-shadow': item.rarity_color + ' 0px 0px 60px 60px',
                }"></div>
              </div>

              <div class="d-flex">
                <v-spacer />
                <div class="text-grey font-weight-bold text-body-2">
                  {{ item.exterior_name || "" }}
                </div>
              </div>
              <img :src="item.image_url" />
              <!--            <img-->
              <!--                src="https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbM8Ij8nVn680E_ZDvwdo-Re1RtYA3W_gLrk-rngMC8upTJmHFmsiErs3jfnxe11wYMMLJe6xiBeg/"/>-->
              <!--            -->
              <div class="text-center font-weight-bold">
                <div class="text-overflow-2" style="
                    font-size: 1rem;
                    line-height: 1.5rem;
                    letter-spacing: 0.0125rem;
                  ">
                  {{ item.item_name }}
                </div>
              </div>

              <v-spacer></v-spacer>
              <div class="font-weight-bold text-center">
                {{ item.price }} T币
              </div>

              <div class="d-flex justify-space-around my-3">
                <div class="all-sell" style="width: 100%" @click="retrieve(item.id)">
                  <p>提货</p>
                </div>
                <div class="all-sell ml-2" style="width: 100%" @click="sell(item.id)">
                  <p>出售</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mb-5">
          <el-pagination :page-size="12" :total="total" background hide-on-single-page layout="prev, pager, next"
            @current-change="currentChange">
          </el-pagination>
        </div>
      </div>

      <div v-else-if="!loading.list">
        <empty />
      </div>
    </div>
  </div>

  <confirm-box ref="confirmBox"></confirm-box>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from "vue";
import { BackpackService } from "@/services/BackpackService";
import { ElMessageBox, ElNotification } from "element-plus";
import Empty from "@/components/empty/Index.vue";
import { useStore } from "@/store";
import ConfirmBox from "./components/ConfirmBox.vue";

export default defineComponent({
  name: "Backpack",
  components: { Empty, ConfirmBox },
  setup() {
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

    return {
      ...toRefs(state),
      windowWidth: window.screen.width,
      store,
      userInfo: store.state.user?.trade_url,
      trade_url: computed(() => store.getters.userInfo?.trade_url),
    };
  },

  methods: {
    confirm(message = "出售") {
      const box = this.$refs.confirmBox as any;
      return box
        .show("确认" + message + "？")
        .then(() => true)
        .catch(() => false);
    },

    refresh() {
      this.getList();
      this.getUserInfo();
    },

    getUserInfo() {
      this.store.dispatch("getUserInfo");
    },

    async getList() {
      this.loading.list = true;

      const res = await BackpackService.list({
        page: this.currentPage,
        page_size: this.page_size,
      }).finally(() => {
        this.loading.list = false;
      });
      this.list = res.data.data.list;
      this.total = res.data.data.total;
      this.paperCount = Math.ceil(this.total / this.page_size);
    },

    currentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    async retrieve(id) {
      if (!this.trade_url) {
        this.$notify.warning("请先绑定交易链接");
        return;
      }

      const confirm = await this.confirm("提货");
      if (!confirm) return;
      this.loading.handle = true;
      await BackpackService.retrieveSkin({
        id,
      })
        .then(() => {
          if (this.list.length === 1) {
            if (this.currentPage > 1) {
              this.currentPage--;
            }
          }
          this.refresh();
          this.$notify.success("提货成功，请耐心等待发货");
        })
        .finally(() => {
          this.loading.handle = false;
        });
    },

    async sell(id) {
      const confirm = await this.confirm();
      if (!confirm) return;
      this.loading.handle = true;
      BackpackService.sell({
        id,
      })
        .then(() => {
          if (this.list.length === 1) {
            if (this.currentPage > 1) {
              this.currentPage--;
            }
          }
          this.refresh();
        })
        .finally(() => {
          this.loading.handle = false;
        });
    },

    async batchSell() {
      const ids = this.list.map((item) => {
        return item.id;
      });

      if (!ids.length) {
        ElNotification({
          message: "当前背包没有可出售的饰品",
          type: "warning",
        });
        return;
      }

      const confirm = await this.confirm();
      if (!confirm) return;
      this.loading.handle = true;
      BackpackService.batchSell({
        ids,
      })
        .then(() => {
          // 如果总页数大于当前页，不作任何动作
          if (this.paperCount <= this.currentPage) {
            // 如果总页数小于等于当前页，则页数-1
            if (this.currentPage > 1) {
              this.currentPage--;
            }
          }
          this.refresh();
        })
        .finally(() => {
          this.loading.handle = false;
        });
    },

    async sellAll() {
      if (!this.list.length) {
        ElNotification({
          message: "当前背包没有可出售的饰品",
          type: "warning",
        });
        return;
      }
      const confirm = await this.confirm();
      if (!confirm) return;
      this.loading.handle = true;
      BackpackService.batchSell({
        all_sell: true,
      })
        .then(async () => {
          this.currentPage = 1;
          this.refresh();
        })
        .finally(() => {
          this.loading.handle = false;
        });
    },
  },

  mounted() {
    this.getList();
  },
});
</script>

<style lang="scss" scoped>
.backpack {
  .pack {
    .img {
      background-color: #2c2c32;
    }

    img {
      width: 100%;
    }
  }

  .unlock {
    font-weight: 800;
    font-size: 16px;
    color: #c0c0c2;
  }

  .all-sell {
    height: 34px;
    border: 1px solid #7668cb;
    border-radius: 4px;
    text-align: center;
    line-height: 34px;
    padding: 0 10px;
    cursor: pointer;
  }

  .header-font {
    font-size: 14px;
  }

  .no-item {
    width: 100%;

    img {
      display: block;
      margin: 100px auto 0px;
      width: 300px;
    }

    p {
      color: rgb(152, 152, 152);
      text-align: center;
    }
  }
}

.pack-item {
  height: 100%;
  display: flex;
  position: relative;

  img,
  div,
  p {
    z-index: 1;
  }
}

.bac-icon {
  width: 45%;
  height: 45%;
  position: absolute;
  z-index: 0;
  top: 2.4rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;

  .bac {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    z-index: 0;
  }

  img {
    z-index: 1;
    position: relative;
    width: 100%;
    transform: scale(2);
    opacity: 0.8;
  }
}
</style>
