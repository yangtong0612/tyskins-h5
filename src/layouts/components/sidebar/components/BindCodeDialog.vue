<template>
  <q-popup :appendToBody="true" :width="isMobile?'100%':'488px'" title="输入邀请码" ref="popupRef">
    <div class="pt-10 px-8">
      <div class="">
        <el-input v-model="code" clearable size="large" placeholder="请输入邀请码"/>
      </div>
    </div>
    <template #footer>
     <div class="mt-5"> <v-btn style="border-radius: 10px;" @click="handleBindCode" width="152" height="40" color="#f3a45d" elevation="0">确 定</v-btn></div>
    </template>
  </q-popup>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "@/store";
import QPopup from "@/components/QPopup.vue";

export default defineComponent({
  components: {
    QPopup
  },
  setup() {
    const store = useStore()
    const isMobile = computed(() => window.innerWidth < 600)

    return {
      store,
      userInfo: computed(() => {
        return store.getters.userInfo || {};
      }),
      code: ref(""),
      isMobile
    }
  },

  methods: {
    handleBindCode() {
      if (this.code.trim() == "") {
        this.$notify.warning("推广码不能为空")
        return
      }
      this.$emit("submit", this.code);
    },

    handleClose() {
      this.$emit("close");
    },

		clear() {
			this.code = "";
		}
  },
});
</script>

<style scoped lang="scss">
.bind-code-dialog {
  color: #fff;
  background: #1a1d2d;
  border-radius: 6px;
  padding: 26px 30px;

  .bind-code-dialog-header {
    width: 30vw;
    max-width: 500px;
    font-size: 16px;

    i {
      font-size: 22px;
      color: #fff;
      cursor: pointer;
    }
  }
}

.login-dialog-btn {
  line-height: 3rem;
  width: 13rem;
  height: 3rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  margin: 0 auto;
  cursor: pointer;
  background: #8e7eed;
  border-radius: 4px;
}

@media screen and (max-width: 768px) {
  .bind-code-dialog {
    padding: 10px 16px 20px;

    .bind-code-dialog-header {
      width: 80vw;
    }
  }
}
</style>
