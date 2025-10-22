<template>
  <el-dialog v-bind="$attrs" :model-value="modelValue" top="15vh" width="1100px" :append-to-body="true"
    :show-close="false" custom-class="welfare-dialog" :lock-scroll="false">
    <div class="welfare-center">
      <div class="title">福利中心</div>
      <div @click="closeDialog" class="close-dialog">
        <el-icon size="16px">
            <Close />
        </el-icon>
      </div>
      <Sidebar />
      <Tabs v-model="activeTabKey">
        <Pane label="活动公告" name="notice">
          <Notice></Notice>
        </Pane>
        <Pane label="福利领取" name="welfare">
          <Welfare></Welfare>
        </Pane>
        <Pane label="福利ROLL房" name="roll">
          <Roll></Roll>
        </Pane>
        <Pane label="口令红包" name="redenvelope">
          <Redenvelope></Redenvelope>
        </Pane>
        <Pane label="任务中心" name="task">
          <Task></Task>
        </Pane>
      </Tabs>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, toRefs } from "vue";
import Tabs from "./tabs/Index.vue";
import Pane from "./tabs/Pane.vue";
import Sidebar from "./sidebar/Index.vue";
import Notice from './tabs/Notice.vue'
import Redenvelope from "./tabs/Redenvelope.vue";
import Welfare from "./tabs/Welfare.vue";
import Roll from "./tabs/Roll.vue";
import Task from "./tabs/Task.vue";
export default defineComponent({
  name: "WelfareCenter",
  props: {
    modelValue: Boolean,
  },
  components: {
    Tabs,
    Pane,
    Sidebar,
    Notice,
    Redenvelope,
    Welfare,
    Roll,
    Task,
  },
  setup(props, { emit }) {
    const state = reactive({
      activeTabKey: "notice",
    });

    provide("closeDialog", closeDialog)

    function closeDialog() {
      emit("update:modelValue", false);
    }

    return {
      ...toRefs(state),
      closeDialog,
    };
  },
});
</script>

<style lang="scss">

.el-dialog {
  box-shadow: unset;
}
.welfare-dialog-mobile {
  display: none;
}

.welfare-dialog {
  background: transparent !important;

  .el-dialog__header {
    padding: 0 !important;
    display: none !important;
    opacity: 0 !important;
  }

  .el-dialog__body {
    padding: 0 !important;
    background: transparent !important;
    height: auto;
  }
}

@media screen and (max-width: 768px) {
  .el-dialog {
    width: 100vw;
    margin: 0 !important;
  }

  .welfare-dialog {
    .el-dialog__body {
      display: flex;
      align-items: center;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss" scoped>
.welfare-center {
  position: relative;
  width: 100%;
  height: 656px !important;
  background-color: #2A2B30;
  display: flex;
  justify-content: space-between;
  padding: 98px 0 0 0px;
  position: relative;
  border-radius: 2px 2px 2px 2px;
  .title{
    width: 1100px;
    height: 68px;
    background: #34363A;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    font-size: 20px;
    color: #F9F9F9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .close-dialog {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: #2A2B30;
    border-radius: 2px 2px 2px 2px;
    position: absolute;
    top: 0px;
    right: -44px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (max-width: 768px) {
  .welfare-center {
    display: block;
    width: 100vw;
    height: 52.8rem !important;
    box-sizing: border-box;
    padding: 4.9rem 3rem 4rem 2.3rem;
    // min-height: 100vh !important;
    background-image: url(@/assets/img/welfare/bg_mobile_welfare_center.png) !important;
    background-size: 100%;
    // margin-top: 9rem;

    & .close-dialog {
      cursor: pointer;
      width: 2.2rem;
      height: 2.2rem;
      background-image: url(@/assets/img/welfare/icon_close.png);
      background-size: 100%;
      position: absolute;
      top: 1.3rem;
      right: 2rem;
    }
  }
}
</style>