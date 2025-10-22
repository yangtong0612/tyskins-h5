<template>
  <div class="backpack-skin-container d-flex flex-column">
    <div
      class="d-flex pa-6 justify-space-between dialog-header"
      style="flex: none"
    >
      <span>存入饰品</span>
      <el-icon @click="close" :size="20"><Close /></el-icon>
    </div>

    <div
      class="d-flex justify-center align-center"
      style="flex: 1"
      v-if="!loading && !originList.length"
    >
      <el-result icon="info">
        <template #title>
          <span style="font-size: 16px">背包暂无饰品</span>
        </template>
        <template #extra>
          <v-btn @click="fetch">刷新</v-btn>
        </template>
      </el-result>
    </div>

    <upload-list
      v-if="isShowUploadList"
      :upload-list="selectedList"
      :room-id="roomId"
      @back="handleBack"
    ></upload-list>

    <template v-if="!isShowUploadList && (originList.length || loading)">
      <div style="flex: none">
        <!-- <div class="d-flex pa-6 align-center" v-if="!onlyShowSelected">
        <span class="filter-name">筛选</span>
        <el-input
          style="flex: 1"
          class="mx-3"
          placeholder="输入饰品id或者饰品名称"
        ></el-input>
        <v-btn @click="handleSearch">搜索</v-btn>
      </div> -->

        <div class="px-6 mb-3 d-flex align-center">
          <div
            @click.prevent="handleClickCheckAll"
            class="mr-3 d-flex align-center"
          >
            <el-checkbox :model-value="isCheckAll">
              <span class="text-white">全选本页</span>
            </el-checkbox>
          </div>

          <span>当前已选择：{{ selectedList.length }} / 100</span>
          <el-checkbox
            class="ml-5"
            v-model="onlyShowSelected"
            v-show="selectedList.length > 0"
            >只显示已选项</el-checkbox
          >

          <v-spacer />

          <v-btn
            size="small"
            class="text-white"
            :disabled="selectedList.length === 0"
            color="#7668cb"
            @click="handlePushSkin"
            >存入</v-btn
          >
        </div>
      </div>

      <div class="skin-list-box" :class="loading ? 'd-flex flex-column' : ''">
        <skin-list-loading v-if="loading"></skin-list-loading>

        <skin-list
          v-show="!loading && skinList.length"
          :skin-list="skinList"
          @click="handleClickSkin"
        ></skin-list>
      </div>

      <div class="text-center mt-6 pb-6" v-show="!onlyShowSelected">
        <el-pagination
          :total="total"
          :page-size="query.page_size"
          v-model:current-page="query.page"
          @current-change="fetch"
          hide-on-single-page
        ></el-pagination>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { BackpackService } from "@/services/BackpackService";
import { BackpackSkinItem } from "@/types";
import { defineComponent, ref, reactive, computed } from "vue";
import SkinList from "./SkinList.vue";
import SkinListLoading from "./SkinListLoading.vue";
import UploadList from "./UploadList.vue";

interface CustomBackpackSkinItem extends BackpackSkinItem {
  is_selected: boolean;
}

export default defineComponent({
  setup() {
    return {
      onlyShowSelected: ref(false),
      originList: ref<CustomBackpackSkinItem[]>([]),
      selectedList: ref<CustomBackpackSkinItem[]>([]),
      errorPushList: ref<CustomBackpackSkinItem[]>([]),

      query: reactive({
        page: 1,
        page_size: 12,
        keyword: "",
      }),

      total: ref(0),
      loading: ref(false),
      isShowUploadList: ref(false),
    };
  },

  computed: {
    skinList() {
      return this.onlyShowSelected ? this.selectedList : this.originList;
    },

    isCheckAll() {
      if (!this.originList.length) return false;
      for (let i = 0; i < this.originList.length; i++) {
        if (!this.originList[i].is_selected) {
          return false;
        }
      }
      return true;
    },
  },

  props: {
    roomId: {
      type: Number,
      default: -1,
    },
  },

  methods: {
    fetch() {
      this.loading = true;

      BackpackService.list(this.query)
        .then((response) => {
          const { list, total } = response.data.data;
          this.originList = this.processListData(list);
          this.total = total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    processListData(listData: BackpackSkinItem[]): CustomBackpackSkinItem[] {
      return listData.map((skin) => ({
        ...skin,
        is_selected:
          this.selectedList.findIndex(
            (selectedSkin) => selectedSkin.id === skin.id
          ) > -1,
      }));
    },

    handleClickSkin(skinId: number) {
      const skin = this.skinList.find((skin) => skin.id === skinId);
      if (skin) {
        skin.is_selected = !skin.is_selected;
        if (skin.is_selected) {
          this.selectedList.push(skin);
        } else {
          const originSkin = this.originList.find((item) => item.id === skinId);
          // 避免出现因分页造成的引用地址不同而导致的状态变更失效
          if (originSkin) {
            originSkin.is_selected = false;
          }
          this.selectedList = this.selectedList.filter(
            (skin) => skin.id !== skinId
          );
          if (!this.selectedList.length) {
            this.onlyShowSelected = false;
          }
        }
      }
    },

    handlePushSkin() {
      if (!this.selectedList.length) {
        this.$notify.warning("未选择饰品");
        return;
      }
      if (Number(this.roomId) > 0) {
        this.isShowUploadList = true;
      } else {
        this.$notify.warning("房间异常，请重新进入房间后重试");
      }
    },

    handleBack() {
      this.isShowUploadList = false;
      this.onlyShowSelected = false;
      this.selectedList = [];
      this.query.page = 1;
      this.fetch();
    },

    handleSearch() {},

    close() {
      this.$emit("close");
    },

    handleClickCheckAll() {
      const value = !this.isCheckAll;
      console.log("value", value);
      this.originList.forEach((skin) => (skin.is_selected = value));

      this.originList.forEach((skin) => {
        skin.is_selected = value;

        const index = this.selectedList.findIndex(
          (item) => item.id === skin.id
        );

        if (value) {
          if (index === -1) {
            this.selectedList.push(skin);
          }
        } else {
          if (index > -1) {
            this.selectedList.splice(index, 1);
          }
        }
      });
    },
  },

  components: {
    SkinList,
    SkinListLoading,
    UploadList,
  },
});
</script>

<style scoped lang="scss">
.backpack-skin-container {
  font-size: 12px;
  background-color: #2d2d33;
  min-height: 50vh;
  max-height: 90vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.dialog-header {
  span {
    font-size: 16px;
  }

  .el-icon-close {
    font-size: 22px;
    cursor: pointer;
    font-weight: bold;
  }
}

.filter-name {
  width: 30px;
  font-size: 15px;
}

.skin-list-box {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
