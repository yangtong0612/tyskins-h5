<template>
  <v-dialog persistent v-model="dialog" class="confirm-box">
    <div class="confirm-box-main">
      <div class="confirm-box-content">
        {{ content }}
      </div>

      <v-row v-if="isShowInput">
        <v-col cols="12" class="d-flex justify-center">
          <el-input v-model="inputValue" style="width: 90%" clearable :maxlength="maxLength"></el-input>
        </v-col>
      </v-row>

      <div class="confirm-actions d-flex">
        <v-spacer></v-spacer>

        <v-btn
          @click="handleConfirm"
          class="text-white"
          color="#8e7eed"
          :size="size"
          plain
          :disabled="isShowInput && !inputValue"
        >
          确认
        </v-btn>
        <v-btn
          variant="outlined"
          class="ml-2"
          color="#FFF"
          plain
          @click="handleCancel"
          :size="size"
        >
          取消
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const maxLength = ref<string | number>(-1);

    return {
      dialog: ref(false),
      resolve: (value?: any) => value,
      reject: () => {},
      content: "",
      size: window.screen.width <= 600 ? "small" : "default",
      isShowInput: ref(false),
      inputValue: ref(""),
      maxLength,
    };
  },

  methods: {
    show(content: string) {
      return new Promise((resolve, reject) => {
        this.dialog = true;
        this.content = content;
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    showInput(title: string, defaultValue = "", maxLength?: number) {
      if (defaultValue) {
        this.inputValue = defaultValue;
      }
      this.isShowInput = true;
      if (maxLength) {
        this.maxLength = maxLength;
      } else {
        this.maxLength = -1;
      }
      return this.show(title);
    },

    handleConfirm() {
      this.resolve(this.isShowInput ? this.inputValue : void 0);
      this.hide();
    },

    handleCancel() {
      this.reject();
      this.hide();
    },

    hide() {
      this.dialog = false;
      this.isShowInput = false;
      this.inputValue = "";
    },
  },
});
</script>

<style lang="scss">
.confirm-box {
  .v-overlay__content {
    width: 100%;
  }
}
</style>

<style scoped lang="scss">
.confirm-box-main {
  width: 90%;
  background: #36363c;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  margin: 0 auto;
}

.confirm-box-content {
  font-size: 15px;
  margin: 10px 0;
  text-indent: 20px;
}

.confirm-actions {
  margin-top: 3rem;
}

@media screen and (max-width: 768px) {
  .confirm-box-content {
    text-indent: 10;
  }

  .confirm-actions {
    margin-top: 1rem;
  }
}
</style>
