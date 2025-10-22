<template>
  <q-popup :showFooter="false" title="对战规则" :width="isMobile ? '90%' : '600px'" ref="popupRef">
    <div class="fs14 py-6 px-4">
      <p class="mb-2" style="color: #333333; font-size: 13px;" v-for="text in texts">{{ text }}</p>
    </div>
  </q-popup>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import QPopup from '@/components/QPopup.vue'
const texts = ref([
  "1、创建活动时，可以选择活动人数【双人模式】【三人模式】进行对战，一场战斗最多可以选择6个饰品箱。※房间一旦创建，不可取消。",
  "2、活动参与費用即本场活动开启的饰品箱价格总和，支付费用后即视为加入房间。※中途退出房间，并不会退还饰品箱或参与费。",
  "3、当一场活动有多名赢家均分奖励时，非本人所得饰品将被兑换为硬币发放到赢家帐户馀额。",
  "4、每场活动的结果受到【创建时间】【用户ID】【用户位置】【开始时间】等，多方面因素影响，此为完全随机产生的结果。任意饰品箱奖励均可以验证公平性。",
]);
const popupRef = ref(null);
const isMobile = computed(() => window.innerWidth < 600)
function open() {
  popupRef.value.open()
}
function close() {
  popupRef.value.close()
}

// 向父组件暴露以下方法
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.battle-rule {
  width: 80vw;
  min-width: 600px;
  max-width: 1200px;
  color: #fff;
  background: #1c192a;

  .battle-rule-title {
    font-size: 24px;
    line-height: 64px;
    background: #28253b;
    text-indent: 32px;
    color: rgba(255, 255, 255, 0.56);
    position: relative;

    img {
      width: 19px;
      height: 19px;
      position: absolute;
      top: 50%;
      right: 32px;
      transform: translateY(-50%);
    }
  }

  .battle-rule-content {
    padding: 20px;
    font-size: 15px;
    line-height: 20px;
    color: #333;

    p {
      margin-top: 10px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 600px) {
  .battle-rule {
    width: 100vw;
    min-width: 100vw;
  }
}
</style>
