<template>
  <div class="upload-list d-flex flex-column">
    <template v-if="progress === 100">
      <div
        v-if="errorPushList.length"
        class="pa-3 pa-md-10 d-flex flex-column"
        style="overflow: hidden"
      >
        <div style="flex: none" class="pb-2">以下饰品存入失败：</div>

        <div class="mb-3 fail-list" style="flex: 1">
          <div
            v-for="skin in errorPushList"
            :key="skin.id"
            class="d-flex align-center mt-3"
          >
            <img style="width: 50px" :src="skin.image_url" class="mr-3" />
            <div class="text-overflow-2">
              {{ skin.item_name }} ({{ skin.exterior_name }})
            </div>

            <div class="text-red ml-3">{{ skin.errorMessage }}</div>

            <v-spacer />

            <div v-show="!retrying">
              <v-btn
                size="small"
                class="ml-1"
                variant="outlined"
                @click="retry(skin)"
                >重试</v-btn
              >
              <v-btn
                size="small"
                class="ml-1"
                variant="outlined"
                @click="handleRemove(skin.id)"
                >忽略</v-btn
              >
            </div>

            <span v-show="retryId === skin.id">重试中</span>
          </div>
        </div>

        <div style="flex: none" class="d-flex justify-center">
          <v-btn variant="outlined" @click="handleBack">返回</v-btn>
          <v-btn class="ml-3" color="primary" @click="retryAll">全部重试</v-btn>
        </div>
      </div>

      <div class="upload-success d-flex justify-center align-center" v-else>
        <el-result icon="success" title="存入背包成功">
          <template #extra>
            <v-btn @click="handleBack" variant="outlined">继续存入</v-btn>
            <v-btn
              class="ml-3"
              v-if="!isRoom"
              variant="outlined"
              @click="handleGoRoom"
              >前往房间</v-btn
            >
          </template>
        </el-result>
      </div>
    </template>
  </div>

  <skin-uploading
    v-model="isShowUploading"
    :percentage="progress"
    loading-text="正在存入饰品"
  ></skin-uploading>
</template>

<script lang="ts">
import { RollService } from "@/services/RollService";
import { BackpackSkinItem } from "@/types";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SkinUploading from "./SkinUploading.vue";

const concurrent = 1;

interface CustomSkinItem extends BackpackSkinItem {
  errorMessage: string;
}

export default defineComponent({
  props: {
    uploadList: {
      type: Array,
      default: () => [],
    },
    roomId: {
      type: Number,
      default: -1,
    },
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    return {
      progress: ref(0),
      errorPushList: ref<CustomSkinItem[]>([]),
      isShowUploading: ref(true),
      errors: ref<string[]>([]),
      retryId: ref(-1),
      retrying: ref(false),
      router,
      isRoom: route.name === "rollRoom",
    };
  },

  created() {
    this.isShowUploading = true;
    this.handlePushSkin();
  },

  methods: {
    handlePushSkin() {
      this.pushSkin()
        .then(() => {
          this.progress = 100;
          if (this.errorPushList.length) {
            // 有错误
            console.log("Error!");
          } else {
            console.log("Success!");
            this.$emit("success");
          }
        })
        .finally(() => {
          this.isShowUploading = false;
        });
    },

    pushSkin() {
      const that = this;
      const selectedList = (this.uploadList as BackpackSkinItem[]).map(
        (item) => ({
          ...item,
          errorMessage: "",
        })
      );

      this.progress = 0;
      let currentIndex = 0;

      return push();

      function push() {
        const tasks: Promise<any>[] = [];

        for (let i = 0; i < concurrent; i++) {
          const skin = selectedList[currentIndex++];
          if (skin) {
            tasks.push(
              that.upload(skin.id).catch(() => {
                that.errorPushList.push(skin);
              })
            );
          } else {
            break;
          }
        }

        return Promise.all(tasks).then(() => {
          if (tasks.length < concurrent) {
            return that.sleep(500);
          } else {
            that.progress += Math.floor(
              (100 / selectedList.length / (100 / tasks.length)) * 100
            );
            that.progress = Math.min(that.progress, 99);
            return push();
          }
        });
      }
    },

    sleep(n): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, n);
      });
    },

    retry(skin: CustomSkinItem) {
      this.retrying = true;
      const { id } = skin;
      this.retryId = id;
      skin.errorMessage = "";

      return this.upload(id)
        .then(() => {
          this.handleRemove(id);
        })
        .catch((err) => {
          skin.errorMessage = err.message || err.msg || "未知错误";
        })
        .finally(() => {
          this.retrying = false;
          this.retryId = -1;
        });
    },

    retryAll() {
      let index = 0;
      let that = this;

      this.errorPushList.forEach((skin) => (skin.errorMessage = ""));

      handle();

      function handle() {
        const skin = that.errorPushList[index++];
        if (skin) {
          that.retry(skin).finally(() => {
            handle();
          });
        }
      }
    },

    upload(id: number) {
      return RollService.addSkin({
        free_room_id: this.roomId,
        backpack_id: id,
      });
    },

    handleRemove(id: number) {
      this.errorPushList = this.errorPushList.filter((item) => item.id !== id);
    },

    handleBack() {
      this.$emit("back");
    },

    handleGoRoom() {
      console.log(this.router);
      this.router.push("/roll/" + this.roomId);
    },
  },

  components: {
    SkinUploading,
  },
});
</script>

<style>
.upload-success .el-result__title p {
  color: #fff;
}
</style>

<style scoped lang="scss">
.upload-list {
  flex: 1;
  font-size: 13px;
  overflow: hidden;

  > * {
    flex: 1;
  }

  .loading-text {
    font-size: 16px;
  }

  .fail-list {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
