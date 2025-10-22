<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="update-seed-dialog"
    :lock-scroll="false"
    @closed="onClosed"
  >
    <template #title></template>

    <div class="update-dialog-main">
      <div class="dialog-main-title">输入新的用户种子(任选)</div>
      <el-input
        placeholder="请输入新用户种子"
        style="margin: 30px 0"
        v-model="seed"
        :disabled="loading"
      ></el-input>

      <div class="dialog-action">
        <el-button
          size="medium"
          class="dialog-submit"
          v-model="loading"
          @click="handleUpdate"
          >保存</el-button
        >
      </div>

      <span class="close" @click="close" v-show="!loading"></span>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { UserService } from "@/services/UserService";

export default defineComponent({
  setup() {
    return {
      visible: ref(false),
      seed: ref(""),
      loading: ref(false),
    };
  },

  methods: {
    open() {
      this.visible = true;
    },

    close() {
      this.visible = false;
    },

    handleUpdate() {
      if (!this.seed.trim()) {
        this.$notify.warning("请输入新用户种子");
        return;
      }
      this.update();
    },

    update() {
      this.loading = true;

      UserService.changeSeed(this.seed)
        .then(() => {
          this.$notify.success("用户种子更新成功");
          this.$emit("refresh");
          this.close();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onClosed() {
      this.seed = "";
    },
  },
});
</script>

<style lang="scss">
.update-seed-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>

<style scoped lang="scss">
.update-dialog-main {
  width: 100%;
  height: 20wh;
  background: #36363c;
  padding: 33px 29px;
  position: relative;

  .dialog-main-title {
    color: #fff;
    margin: 0 0 20px 0;
    line-height: 1 !important;
    letter-spacing: 0.02em !important;
    font-size: 20px;
  }

  .dialog-action {
    text-align: center;

    .dialog-submit {
      background: #7668cb;
      border: none;
      color: #fff;
    }
  }

  .close {
    position: absolute;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMAESIzVWa7zO4e8VkKAAAA6UlEQVQ4y83UOxKCMBAG4CBjb2Vaj0DpFexoKT0CJXUqehnd2wqJYR/J/DNWSvcP+/FINuvcr67jqLPvRRieJ3mvmRYBiRT1REwHIkmbiWgRUFG/5Z6hpBvcaYSC+pQTvaWQaYJED1mZqY65NFGdTK15jiq2UFVbKMtLKOpLKGgFMq1ApjVoqOkLRS1UdCx6jGkJBR0r7XnINy/uOwnfib4W/idaIbi2aFfgfqJOgD2Eug/2Lep4eFbgKbvWz2eIqZ1rJ/vVOaZ2JoRPitRMkwwjtXMo7GmlZoIxXKmdfUGk9q73/ty5v7zebKlOSQmb1DEAAAAASUVORK5CYII=);
    background-size: 100% 100%;
    width: 2.125rem;
    height: 2.125rem;
    top: 1.2rem;
    right: 1rem;
    cursor: pointer;
  }
}
</style>
