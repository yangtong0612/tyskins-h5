<template>
  <div class="battle-box-item">
    <img class="box-item-image" :src="box.img" />

    <div class="box-item-price">
      <img src="@/assets/img/icon/coin.png" />
      <span>{{ box.price.toFixed(2) }}</span>
    </div>

    <span class="box-item-name text-overflow">{{ box.name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Box } from "./CreateRoom/CreateRoom.vue";

export default defineComponent({
  props: {
    box: {
      type: Object as PropType<Box>,
      default: () => ({}),
    },
  },
});
</script>

<style scope lang="scss">
.battle-box-item {
  width: 144px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.box-item-image {
  width: 103px;
  height: 70px;
}

.box-item-price {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;

  img {
    width: 16px;
  }

  span {
    font-size: 14px;
    color: #fff;
    margin-left: 3px;
    line-height: 18px;
    height: 16px;
  }
}

.box-item-name {
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  text-align: center;
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .battle-box-item {
    width: 67px;
  }

  .box-item-image {
    width: 67px;
    height: 45px;
  }

  .box-item-price {
    margin-top: 10px;
  }
}
</style>
