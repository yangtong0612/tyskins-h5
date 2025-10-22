<template>
  <div class="task-list-box">
    <div class="task-list-title-group">
      <div v-for="(title, index) in titles" :key="index" class="task-list-title" :class="{ active: index == titleIndex }"
        @click="onChangeTask(index)">
        {{ title.label }}
      </div>
    </div>
    <div class="task-list-content">

      <div v-if="taskList.length>0"  class="task-list">
        <div class="task-item" v-for="item in taskList" :key="item.id">
          <div class="d-flex a-center">
            <div class="flex-1">
              <div class="name">{{ item.name }}</div>
              <div class="desc">
                <span v-if="item.cycle == 'month'" class="mr-8">时间： {{ dateTimes['month'].start_time }} - {{ dateTimes['month'].end_time }}</span>
                <span v-if="item.cycle == 'week'" class="mr-8">时间： {{ dateTimes['week'].start_time }} - {{ dateTimes['week'].end_time }}</span>
                <span v-if="item.reward.type == 'diamond'">赠送：{{ item.reward.value }} <img
                    style="width: 12px" src="@/assets/img/bos/suipian.svg" alt=""></span>
                <span v-else-if="item.reward.type == 'coin'">赠送：{{ item.reward.value }} <img
                    style="width: 12px" src="@/assets/img/bos/douzi.svg" alt=""></span>
	                <span v-else-if="item.reward.type == 'key'">赠送：钥匙x1</span>
              </div>
            </div>
            <div v-if="item.received"  class="btn" style="background-color: #ccc;">已领取</div>
            <div v-else-if="item.completed" @click="receiveTask(item.id)" class="btn">领取奖励</div>
            <div v-else style="opacity: 0.6; cursor: default;" class="btn">未完成</div>
          </div>
          <div class="progress-wrap">
            <div :style="{'width': percentage(item)+'%'}" class="progress-inner"></div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无数据" />
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs' 
import TaskService from "@/services/TaskService";
import { UserService } from "@/services/UserService";
import { defineComponent, toRefs, reactive, onMounted, watch, inject } from "vue";
import { processImageUrl } from "@/utils";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
export default defineComponent({
  name: "Welfare",
  setup() {
    const store = useStore()
    const router = useRouter()
    const closeDialog: any = inject("closeDialog")
    const state = reactive({
      titles: [
        { value: 'all', label: '全部任务' },
        { value: 'new_user', label: '新人任务' },
        { value: 'recharge', label: '充值任务' },
        // { value: 'unbox_number', label: '开箱次数' },
        // { value: 'upgrade_number', label: '升级次数' },
        // { value: 'battle_expend', label: '对战消耗' },
        // { value: 'sweep_mine_expend', label: '扫雷消耗' },
      ],
      titleIndex: 0,
      taskList: [],
      allTaskList: [],
      todayRecharge: 0,
    });

    watch(() => store.getters.userInfo, (userInfo) => {
      if (userInfo != null) getTodayRecharge()
    })



    let week = 0;
    const timestamp = Math.round(new Date())
      const date = new Date(timestamp)
      const weekday = date.getDay()
      const we = weekday === 0? week - 1 : week
      const dateObj = {
        week: {
          start_time: dayjs().add(we, 'week').startOf('week').add(1, 'day').format('YYYY/MM/DD HH:mm'),
          end_time: dayjs().add(we, 'week').endOf('week').add(1, 'day').format('YYYY/MM/DD HH:mm'),
        },
        month: {
          start_time: dayjs().startOf('month').format('YYYY/MM/DD') ,
          end_time: dayjs().endOf('month').format('YYYY/MM/DD'),
        }
      }
      const dateTimes = dateObj;
   
    onMounted(async () => {
      await getDailyTaskList()
    })

    async function getTodayRecharge() {
      const resp = await UserService.getTodayRecharge()
      const { data: { today_recharge } } = resp.data
      state.todayRecharge = today_recharge
    }

    async function getDailyTaskList() {
      let resp = null;
      // console.log(store.getters.userInfo)
      if (store.getters.userInfo) {
        resp = await TaskService.dailyTaskMyList({ page: 1, page_size: 100 })
      } else {
        resp = await TaskService.dailyTaskList({ page: 1, page_size: 100 })
      }

      const { data: { list } } = resp.data
      state.allTaskList = list.map(v => {
         if(typeof v.reward == 'string') {
            v.reward = JSON.parse(v.reward);
         }
       
        return v;
      })
      state.taskList = state.allTaskList;
    }
    // 领取任务
    async function receiveTask(id) {
      const resp = await TaskService.receiveDailyTask({ task_id: id });
      console.log(resp)
      if(resp.data.code == 0) {
        ElMessage.success("领取成功")
        getDailyTaskList();
      }
      // const { data: { list, total } } = resp.data
    }

    function onChangeTask(index) {
      // if (index > 0) {
      //   ElMessage.info("暂未开放")
      //   return
      // }
      state.titleIndex = index;
      const type = state.titles[state.titleIndex].value;
      if (type == 'all') {
        state.taskList = state.allTaskList;
        return;
      }
      state.taskList = state.allTaskList.filter(item => {
        return type == item.type;
      })
    }

    function toUnpack(item) {
      router.push(`/welfatebox/${item.id}/${item.box_id}`)
      closeDialog()
    }


    
    const percentage = (item) => {
      return 0;
      console.log(item)
      let extend  = JSON.parse(item.extend);
  
      let targetAmount = 0;
      if(item.extend) {
        targetAmount = extend.targetAmount;
      }
      return;
      let ywc = 0;
      if(item.cycle == 'week') {
        if(item.attach['本周累计充值']) {
          ywc = item.attach['本周累计充值'];
        }
      } else if(item.cycle == 'month') {
        if(item.attach['本月累计充值']) {
          ywc = item.attach['本月累计充值'];
        }
      }
       return ywc/targetAmount*100;
    }

    return {
      ...toRefs(state),
      onChangeTask,
      processImageUrl,
      receiveTask,
      percentage,
      dateTimes,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-list-box {
  display: flex;
  flex-direction: column;
  .task-list-title-group {

    margin-top: 0px;
    height: 46px;
    display: flex;
    border-bottom: 2px solid #4782F5;

    .task-list-title {
      width: 90px;
      height: 46px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #d0cde8;
      font-weight: 600;
      margin-bottom: 5px;
      cursor: pointer;
      position: relative;
      margin-right: 20px;
    }

    .active {
      color: #4782F5;

      &::after {
        position: absolute;
        content: "";
        height: 0px;
        width: 0px;
        border-width: 6px;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        border-style: solid;
        border-color: transparent transparent #4782F5 transparent;
      }

    }
  }

  .task-list-content {
    margin: 16px 0;
    // flex: 1;
    overflow: auto;
    height: 460px;
  }

  .task-list {
    overflow: auto;
    padding: 0 0px;
  }

  .task-item {
    margin-bottom: 25px;
    background: #2E3135;
    border-radius: 2px 2px 2px 2px;
    padding: 20px;

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
      color: #A0B1C4;
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
      border-radius:2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFB300;
      cursor: pointer;
    }

    .progress-wrap {
      margin-top: 10px;
      overflow: hidden;
      height: 8px;
      background: #34363A;
      border-radius: 69px 69px 69px 69px;
      width: 86%;

      .progress-inner {
        height: 6px;
        background: #FFB300;
        border-radius: 69px 69px 69px 69px;
      }

    }
  }

}

@media screen and (max-width: 768px) {
  .task-list-box {
    .task-list-title-group {
      flex-wrap: nowrap;
      overflow-x: auto;

      .task-list-title {
        flex-shrink: 0;
        width: 80px;
        margin-right: 0;
      }

    }

  }
  .task-list-box .task-item .btn{
    width: 60px;
    height: 30px;
}



}
</style>