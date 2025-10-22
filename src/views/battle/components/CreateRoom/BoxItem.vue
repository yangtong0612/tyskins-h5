<template>
  <div style="border: 1px solid red;" class="select-box-item" @click="handleClick">
    <div class="select-box-image">
      <img :src="box.img" />
      <img
        src="@/assets/img/battle/plus-big.png"
        v-if="!toolbar"
        class="icon-action"
      />
      <img
        src="@/assets/img/battle/subtract-big.png"
        v-else
        class="icon-action"
      />
    </div>

    <div class="box-price">
      <img src="@/assets/img/battle/coin.png" />
      {{box.price}}
    </div>

    <div class="box-name text-overflow">{{box.name}}</div>

    <template v-if="toolbar">
      <span class="box-count">x{{box._count}}</span>
      <img src="@/assets/img/battle/subtract.png" class="icon-subtract" />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, Prop, PropType } from "vue";
import { Box } from "./CreateRoom.vue";

export default defineComponent({
  setup(props, { emit }) {
    return {
      handleClick: () => {
        // emit(props.toolbar ? "subtract" : "plus");
        // emit("click");
      },
    };
  },

  props: {
    toolbar: Boolean,
    box: {
      type: Object as PropType<Box>,
      default: () => {}
    },
  },
});
</script>

<style scope lang="scss">
.select-box-item {
  width: 144px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-bottom: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  flex: none;
  overflow: hidden;

  &:hover {
    border-color: #8e7eed;

    .icon-action {
      display: block;
    }
  }

  .select-box-image {
    width: 103px;
    height: 93px;
    padding-top: 10px;
    text-align: center;
    position: relative;

    img:first-child {
      width: 100%;
    }

    img {
      -webkit-user-drag: none;
    }
  }

  .box-price {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);

    img {
      width: 20px;
      margin-right: 2px;
    }
  }

  .box-name {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 5px;
    width: 100%;
    text-align: center;
  }

  .box-count {
    position: absolute;
    font-size: 16px;
    line-height: 18px;
    color: #8847ff;
    top: 10px;
    right: 10px;
  }

  .icon-subtract {
    position: absolute;
    width: 18px;
    height: 18px;
    top: 10px;
    left: 10px;
  }

  .icon-action {
    width: 76px;
    height: 76px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .select-box-item {
    width: 100px;

    // &:hover {
    //   border-color: transparent;

    //   .select-box-image {
    //     border-color: #8e7eed;
    //   }
    // }

    .select-box-image {
      width: 80px;
      height: 74px;
      // border: 1px solid transparent;
      // box-sizing: border-box;
      // border-radius: 8px;

      .icon-action {
        width: 50px;
        height: 50px;
      }
    }
  }

  .box-price {
    img {
      width: 16px;
    }
  }

  .box-name {
    font-size: 13px;
  }

  .box-count {
    top: 6px;
    right: 6px;
  }

  .icon-subtract {
    top: 6px;
    left: 6px;
  }
}
</style>
