<template>
  <div>
    <div class="card-wrap">
      <div class="relative">
        <div
          class="shop-imgbox"
          :class="
            rarity
              ? 'bg_' + (item.color ? item?.color?.slice(1) : 'B0C3D9')
              : 'dfbg'
          "
        >
          <img
            style="display: block; height: 100px"
            :src="item?.image_url"
            alt=""
            referrerpolicy="no-referrer"
          />
          <slot name="check"></slot>
        </div>
        <div
          v-if="showTag && item.exterior_name"
          :style="`background-color: ${exterior[item.exterior_name]};`"
          class="abs absrt lttag"
        >
          {{ item?.exterior_name }}
        </div>
        <span v-if="item?.show_probability" class="probability"
          >{{ times(item?.show_probability, 100) }}%</span
        >
      </div>
      <div class="px-3 py-3 text-bg">
        <div style="color: #cecfd6" class="line1 fs14">
          {{ item?.item_name || "秋叶原之选" }}
        </div>
        <div class="d-flex a-center space-between">
          <slot name="btns">
            <div class="d-flex a-center">
              <img
                style="width: 12px"
                class="mr-1"
                src="../assets/img/bos/suipian.svg"
                alt=""
              />
              <div class="text-yellow fs14 fw600">{{ item?.price }}</div>
            </div>
            <v-btn
              v-if="showButton"
              style="min-width: auto; border-radius: 8px"
              @click="buy"
              width="45px"
              height="24"
              elevation="0"
              color="#f3a45d"
              >兑换
            </v-btn>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { times } from "@/utils";
defineProps({
  item: {
    type: Object,
    default: {
      name: "",
      image_url: "",
      price: "",
      exterior_name: "崭新出厂",
      rarity_color: "#745F2D",
    },
  },
  rarity: {
    type: Boolean,
    default: true,
  },
  showTag: {
    type: Boolean,
    default: true,
  },
  showButton: {
    type: Boolean,
    default: true,
  },
});

const exterior = reactive({
  崭新出厂: "#397439",
  略有磨损: "#488B48",
  久经沙场: "#F1AD4D",
  破损不堪: "#B7625F",
  战痕累累: "#993A38",
  无涂装: "#33353B",
});
const emit = defineEmits(["buy"]);
const buy = () => {
  console.log("asdfsa");
  emit("buy");
};
</script>

<style lang="scss" scoped>
.shop-imgbox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0;
  position: relative;
  padding-bottom: 70%;
  background-color: #b0c3d9;
  mask-image: url("@/assets/img/skinbasebg.png");
  mask-position: 50%;
  mask-size: cover;

  &::before {
    position: absolute;
    content: "";
    top: 50%;
    width: 70px;
    height: 70px;
    background-image: url("@/assets/img/o-white.png");
    background-repeat: no-repeat;
    background-position: center 0px;
    background-size: cover;
    z-index: 1;
    opacity: 0.2;
    transform: translateY(-50%);
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
  }
}

.lttag {
  width: 64px;
  height: 20px;
  line-height: 20px;
  background-color: #e7af5e;
  color: #ffffff;
  text-align: center;
  border-radius: 2px;
  font-size: 12px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 10px;
}

//               { label: '金色 - 违禁', value: '#E4AE39', style: { color: '#E4AE39' } },
//               { label: '红色 - 隐秘', value: '#EB4B4B', style: { color: '#EB4B4B' } },
//               { label: '粉紫色 - 保密', value: '#D32CE6', style: { color: '#D32CE6' } },
//               { label: '紫色 - 受限', value: '#8847FF', style: { color: '#8847FF' } },
//               { label: '深蓝色 - 军规级', value: '#4B69FF', style: { color: '#4B69FF' } },
//               { label: '浅蓝色 - 工业级', value: '#5E98D9', style: { color: '#5E98D9' } },
//               { label: '白色 -  消费级', value: '#B0C3D9', style: { color: '#B0C3D9' } }

// 自定义背景色

.bg_E4AE39 {
  background-color: #ffd700;
}

.bg_EB4B4B {
  background-color: #eb4b4b;
}

.bg_D32CE6 {
  background-color: #d32ce6;
}

.bg_8847FF {
  background-color: #8847ff;
}

.bg_4B69FF {
  background-color: #4b69ff;
}

.bg_5E98D9 {
  background-color: #5e98d9;
}

.bg_B0C3D9 {
  background-color: #b0c3d9;
}

.probability {
  position: absolute;
  left: 5px;
  top: 4px;
  color: #fff;
}
.card-wrap {
  border-radius: 10px;
  background-color: #222;
  overflow: hidden;
  .text-bg {
    background-color: #3e3e4a;
  }
}
</style>
