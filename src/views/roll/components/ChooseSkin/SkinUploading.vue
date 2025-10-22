<template>
  <v-overlay persistent>
    <div class="uploading d-flex flex-column justify-center align-center">
      <div class="loading-text mb-2">{{ loadingText }}</div>
      <el-progress
        style="width: 90%"
        :text-inside="true"
        :stroke-width="20"
        :percentage="percentage"
      ></el-progress>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    loadingText: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped lang="scss">
.uploading {
  width: 300px;
  height: 6vh;
  min-height: 60px;
  color: #FFF;
  background: #3d536b;
  padding: 6px 3px;
  border-radius: 10px;
  box-sizing: content-box;
}

.loading-text {
  font-size: 16px;
}
</style>
