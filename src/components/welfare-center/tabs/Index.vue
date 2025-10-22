<template>
  <div class="welfate-center-tabs">
    <div class="tab-head">
      <div class="tab-title" :class="{ active: modelValue == item?.props?.name }" v-for="(item, index) in tabs"
        :key="index" @click="onChangeTab($event, item, index)">
        {{ item?.props?.label }}
      </div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";

export default defineComponent({
  name: "Tabs",
  components: {},
  props: {
    modelValue: [Number, String],
  },
  setup(props, { slots, emit }) {
    // @ts-ignore
    const tabs = slots.default();
    const activeKey = ref(props.modelValue);
    provide("activeKey", activeKey);

    function onChangeTab(event, tab, index) {
      activeKey.value = tab.props.name;
      emit("update:modelValue", tab.props.name);
    }

    return {
      tabs,
      onChangeTab,
    };
  },
});
</script>

<style lang="scss" scoped>
.welfate-center-tabs {
  position: relative;
  // height: 399px;
  display: flex;
  width: 100%;

  .tab-head {
    display: flex;
    flex-direction: column;
    z-index: 1;
    width: 220px;
    top: 165px;
    position: relative;
    align-items: flex-start;
    height: 380px;
    padding-left: 30px;
  }

  .tab-content {
    flex: 1;
    height: 540px;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 0 20px;
  }

  .tab-title {
    width: 146px;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    margin-top: 5px;
    color: #ffffff;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;
    &.active {
      color: #fff;
      background-image: url(@/assets/img/bos/bg_tab.png);
      background-size: 100%;
      font-size: 16px;
    }
  }

  .active {
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  .welfate-center-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: none;

    .tab-head {
      position: relative;
      left: unset;
      top: unset;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #99A5B7;
      height: 4rem;
      // margin-bottom: -1px;
   
    }

    .tab-content {
      flex: 1;
      padding: 0;
    }

    .tab-title {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 4rem;
      font-size: 16px;
      border-radius: 5px;
      padding: 0;
      margin: 0;
      color: #707070;

      &.active {
        color: #4782F5;
        border-bottom: 1px solid #4782F5;
        border-radius: unset;
        background: none;
        opacity: 1;
      }
    }
  }
}
</style>