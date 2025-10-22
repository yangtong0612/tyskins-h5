<template>
  <div class="recommend-task">
    <div class="task-title">推荐任务</div>
    <div class="task-list">
      <div class="task-item"></div>
      <div class="task-item"></div>
      <div class="task-item"></div>
      <!--
      <div class="task-item">
        <div class="title">每日活动充值</div>
        <div class="desc">每日活动充值50</div>
        <div>
          <div class="award">
            <span>奖励：</span>
            <span class="coin">5:00</span>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Task",
  props: {
    list: Array,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.recommend-task {
  height: 334px;
  overflow: hidden;
  padding-top: 20px;
  padding-left: 10px;
  & .task-title {
    font-size: 14px;
    font-weight: 600;
    color: #3f75ff;
    margin-bottom: 8px;
  }

  & .task-list {
    .task-item {
      width: 258px;
      height: 95px;
      // background-image: url(@/assets/img/welfare/bg_recommend_task_item.png);
      background-size: 100%;
      color: #D0CDE8;
      font-size: 12px;
      font-weight: 500;
      line-height: 24px;
    padding: 10px 15px;

      .award {
        .coin {
          color: #FFEA00;
        }
        .coin::before {
          content: '';
          background-image: url(@/assets/img/welfare/icon_coin.png);
          width: 14px;
          height: 14px;
          background-size: 100%;
          display: inline-block;
          margin: 0 5px;
          vertical-align: sub;
        }
      }
    }
  }
}
</style>