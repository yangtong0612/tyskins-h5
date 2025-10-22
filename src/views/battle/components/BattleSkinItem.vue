<template>
  <div class="battle-skin-item">
    <div class="skin-item-image" :class="award.skin_color ? ('bg_' + (award.skin_color ? award?.skin_color?.slice(1) : 'bdc2c2')) : 'bg_bdc2c2'">
      <!-- {{ award.skin_color }} -->
      <img :src="skinTemplate" />
      <img :src="award.skin_img" />
    </div>

    <div class="skin-item-title text-overflow line1">{{ award.skin_name }}</div>
    <div class="skin-item-price">
      <img style="width: 11px;" src="@/assets/img/bos/douzi.svg" />
      {{ award.skin_price }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, PropType } from "vue";
import type { BattleAward } from "../services";
import skinTemplate from "@/assets/img/battle/skin-template.png";
import ShopItem from '@/components/ShopItem.vue'

const props = defineProps({
  award: {
    type: Object as PropType<BattleAward>,
    default: () => ({}),
  },
})

</script>

<style scope lang="scss">
.battle-skin-item {
  padding-bottom: 12px;
  text-align: center;
  background: #182033;

  .skin-item-image {
    position: relative;
    display: flex;
    background: linear-gradient(360deg, #354369 0%, #343945 100%);
    img:first-child {
      width: 100%;
      opacity: 0;
    }

    img:last-child {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
    }
  }

  .skin-item-title {
    margin-top: 20px;
    padding: 0 5px;
    font-size: 14px;
    color: #ffffff;
  }

  .skin-item-price {
    color: #FF9900;
    margin-top: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      margin-right: 6px;
    }
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .battle-skin-item {
    padding-bottom: 5px;
  }
  .skin-item-title {
    margin-top: 6px ;
    font-size: 12px;
    border-radius: 2px;
    overflow: hidden;
  }
  .skin-item-price {
    margin-top: 5px;
    font-size: 12px;

    img {
      margin-right: 6px;
    }
  }
}

// 自定义背景色
.bg_d6b45b {
	background: linear-gradient(360deg, #957C1E 0%, #4D4831 100%);
}

.bg_ff8789 {
	background: linear-gradient(360deg, #8A353C 0%, #46373B 100%);
}

.bg_e448e2 {
	background: linear-gradient(360deg, #C488C7 0%, #602E63 100%);
}

.bg_4d82da {
	background: linear-gradient(360deg, #354369 0%, #343945 100%);
}

.bg_bdc2c2 {
	background: linear-gradient(360deg, #99A5B7 0%, #384657 100%);
}
</style>
