<template>
  <div>
    <v-container>
      <div class="task-tabs">
        <div
          class="tab-item"
          @click="onChangeTask(index)"
          v-for="(title, index) in titles"
          :key="index"
          :class="{ active: index == titleIndex }"
        >
          {{ title.label }}
        </div>
        <div v-if="!isMobile" class="right">
          <span>
            我的积分：
            <span
              v-if="store.getters.userInfo"
              class="text-yellow fs14 fw600"
              >{{ store.state.user?.integral }}</span
            ></span
          >
          <div @click="goLottery" class="btn">去抽奖</div>
        </div>
      </div>

      <div
        v-loading="!loaded"
        class="task-list-content"
        style="min-height: 400px"
      >
        <div v-if="isMobile" class="text-white d-flex mb-4">
          <span>
            我的积分：
            <span
              v-if="store.getters.userInfo"
              class="text-yellow fs14 fw600"
              >{{ store.state.user?.integral }}</span
            ></span
          >
          <div @click="goLottery" class="qbtn">去抽奖</div>
        </div>
        <div v-if="taskList.length > 0" class="task-list">
          <div class="task-item" v-for="item in taskList" :key="item.id">
            <div class="d-flex a-center">
              <div class="flex-1">
                <div class="name">{{ item.name }}</div>
                <div class="desc">
                  <span v-if="item.cycle == 'month'" class="mr-8"
                    >时间： {{ dateTimes["month"].start_time }} -
                    {{ dateTimes["month"].end_time }}</span
                  >
                  <span v-if="item.cycle == 'week'" class="mr-8"
                    >时间： {{ dateTimes["week"].start_time }} -
                    {{ dateTimes["week"].end_time }}</span
                  >
                  <span v-if="item.reward.type == 'diamond'"
                    >赠送：<img
                      style="width: 12px; margin-right: 5px"
                      src="@/assets/img/bos/suipian.svg"
                      alt=""
                    />
                    {{ item.reward.value }}
                  </span>

                  <span v-else-if="item.reward.type == 'coin'"
                    >赠送：
                    <img
                      style="width: 12px; margin-right: 5px"
                      src="@/assets/img/bos/douzi.svg"
                      alt=""
                    />
                    {{ item.reward.value }}</span
                  >

                  <span v-else-if="item.reward.type == 'integral'"
                    >赠送：
                    <img
                      style="width: 14px; margin-right: 5px"
                      src="@/assets/img/bos/icon_integral.png"
                      alt=""
                    />
                    {{ item.reward.value }}</span
                  >

                  <span v-else-if="item.reward.type == 'key'"
                    >赠送：钥匙x1</span
                  >
                </div>
              </div>
              <div
                v-if="item.received"
                class="btn"
                style="background-color: #ccc"
              >
                已领取
              </div>
              <div
                v-else-if="item.completed"
                @click="receiveTask(item.id)"
                class="btn"
              >
                领取奖励
              </div>
              <div v-else style="opacity: 0.6; cursor: default" class="btn">
                未完成
              </div>
            </div>
            <div class="progress-wrap">
              <div
                :style="{ width: percentage(item) + '%' }"
                class="progress-inner"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-if="loaded"
          class="roll-loading d-flex justify-center align-center"
        >
          <el-result icon="info">
            <template #title>
              <span class="text-white">暂无数据</span>
            </template>
          </el-result>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import TaskService from "@/services/TaskService";
import { UserService } from "@/services/UserService";
import {
  defineComponent,
  toRefs,
  reactive,
  onMounted,
  watch,
  inject,
  computed,
} from "vue";
import { processImageUrl } from "@/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
const isMobile = computed(() => window.innerWidth < 600);
export default defineComponent({
  name: "Welfare",
  setup() {
    const store = useStore();
    const router = useRouter();
    const closeDialog: any = inject("closeDialog");
    const state = reactive({
      loaded: false,
      titles: [
        { value: "all", label: "全部任务" },
        { value: "day", label: "每日任务" },
        { value: "week", label: "周任务" },
      ],
      titleIndex: 0,
      taskList: [],
      allTaskList: [],
      todayRecharge: 0,
    });

    watch(
      () => store.getters.userInfo,
      (userInfo) => {
        if (userInfo != null) getTodayRecharge();
      }
    );

    let week = 0;
    const timestamp = Math.round(new Date());
    const date = new Date(timestamp);
    const weekday = date.getDay();
    const we = weekday === 0 ? week - 1 : week;
    const dateObj = {
      week: {
        start_time: dayjs()
          .add(we, "week")
          .startOf("week")
          .add(1, "day")
          .format("YYYY/MM/DD HH:mm"),
        end_time: dayjs()
          .add(we, "week")
          .endOf("week")
          .add(1, "day")
          .format("YYYY/MM/DD HH:mm"),
      },
      month: {
        start_time: dayjs().startOf("month").format("YYYY/MM/DD"),
        end_time: dayjs().endOf("month").format("YYYY/MM/DD"),
      },
    };
    const dateTimes = dateObj;

    onMounted(() => {
      setTimeout(() => {
        getDailyTaskList();
      }, 600);
    });

    async function getTodayRecharge() {
      const resp = await UserService.getTodayRecharge();
      const {
        data: { today_recharge },
      } = resp.data;
      state.todayRecharge = today_recharge;
    }

    const goLottery = () => {
      router.push("/lottery");
    };

    async function getDailyTaskList() {
      state.loaded = false;
      let resp = null;
      if (store.getters.userInfo) {
        console.log("我的任务列表");
        resp = await TaskService.dailyTaskMyList({ page: 1, page_size: 100 });
      } else {
        console.log("未登录的任务列表");
        resp = await TaskService.dailyTaskList({ page: 1, page_size: 100 });
      }
      state.loaded = true;
      const {
        data: { list },
      } = resp.data;
      state.allTaskList = list.map((v) => {
        if (typeof v.reward == "string") {
          v.reward = JSON.parse(v.reward);
        }

        return v;
      });
      state.taskList = state.allTaskList;
    }
    // 领取任务
    async function receiveTask(id) {
      const resp = await TaskService.receiveDailyTask({ task_id: id });
      console.log(resp);
      if (resp.data.code == 0) {
        ElMessage.success("领取成功");
        getDailyTaskList();
        store.dispatch("getUserInfo");
      }
      // const { data: { list, total } } = resp.data
    }

    function onChangeTask(index) {
      state.titleIndex = index;
      const type = state.titles[state.titleIndex].value;
      if (type == "all") {
        state.taskList = state.allTaskList;
        return;
      }
      state.taskList = state.allTaskList.filter((item) => {
        return type == item.cycle;
      });
    }

    function toUnpack(item) {
      router.push(`/welfatebox/${item.id}/${item.box_id}`);
      closeDialog();
    }

    const percentage = (item) => {
      let extend = JSON.parse(item.extend);

      let targetAmount = 0;
      if (item.extend) {
        targetAmount = extend.targetAmount;
      }

      let ywc = 0;
      for (let key in item.attach) {
        // 判断当前索引是否为第二个（从0开始计数）
        if (Object.keys(item.attach).indexOf(key) === 1) {
          console.log("第二个值为：", item.attach[key]);
          ywc = item.attach[key];
          break; // 如果只需要获取第二个值，则可以添加这行代码提前结束循环
        }
      }
      // if (item.cycle == 'week') {
      //     if (item.attach['本周累计充值']) {
      //         ywc = item.attach['本周累计充值'];
      //     }
      // }  else if (item.cycle == 'day') {
      //     if (item.attach['今日充值']) {
      //         ywc = item.attach['今日充值'];
      //     }
      // }
      return (ywc / targetAmount) * 100;
    };

    return {
      ...toRefs(state),
      onChangeTask,
      processImageUrl,
      receiveTask,
      percentage,
      goLottery,
      dateTimes,
      store,
      isMobile,
    };
  },
});
</script>

<style lang="scss" scoped>
.qbtn {
  margin-left: 20px;
  height: 22px;
  line-height: 22px;
  border-radius: 15px;
  background-color: #ffb300;
  padding: 0 10px;
  font-size: 12px;
  cursor: pointer;
  width: 60px;
  text-align: center;
}

.task-tabs {
  position: relative;
  display: flex;
  height: 58px;
  padding: 0 15px;
  background-color: #11151b;
  align-items: center;
  margin-top: 47px;

  .right {
    position: absolute;
    right: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    margin-right: 10px;

    .btn {
      margin-left: 20px;
      height: 22px;
      line-height: 22px;
      border-radius: 15px;
      background-color: #f3a55e;
      padding: 0 10px;
      font-size: 12px;
      cursor: pointer;
    }
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: #292931;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }

  .tab-item {
    position: relative;
    color: #99a5b7;
    padding: 0 30px;
    height: 58px;
    line-height: 55px;
    cursor: pointer;

    &.active {
      color: #e69d5d;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        z-index: 9;
        background-color: #e69d5d;
      }
    }
  }
}

.task-list-content {
  margin-top: 20px;
  padding: 20px;
  overflow: auto;
  background-color: #11151b;
}

.task-list {
  overflow: auto;
  padding: 0 0px;
}

.task-item {
  margin-bottom: 25px;
  background: #2e3135;
  border-radius: 2px 2px 2px 2px;
  padding: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  .flex-1 {
    flex: 1;
  }

  .name {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 5px;
  }

  .desc {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #a0b1c4;
    margin-bottom: 10px;
    height: 18px;

    span {
      display: flex;
      align-items: center;

      img {
        margin-left: 5px;
      }
    }
  }

  .btn {
    width: 80px;
    height: 30px;
    background: rgba(255, 179, 0, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffb300;
    cursor: pointer;
  }

  .progress-wrap {
    margin-top: 10px;
    overflow: hidden;
    height: 8px;
    background: #34363a;
    border-radius: 69px 69px 69px 69px;
    width: 86%;

    .progress-inner {
      height: 6px;
      background: #ffb300;
      border-radius: 69px 69px 69px 69px;
    }
  }
}

@media screen and (max-width: 768px) {
  .task-list-title-group {
    flex-wrap: nowrap;
    overflow-x: auto;

    .task-list-title {
      flex-shrink: 0;
      width: 80px;
      margin-right: 0;
    }
  }

  .task-item {
    margin-bottom: 10px;
  }

  .task-item .btn {
    width: 50px;
    height: 30px;
  }

  .task-list-content {
    padding: 15px;
  }

  .task-item .desc {
    flex-direction: column-reverse;

    height: auto;
    align-items: flex-start;

    & > span {
      display: block;
    }

    & > span:nth-child(2) {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    & > span:nth-child(1) {
      font-size: 10px;
    }
  }
}
</style>
