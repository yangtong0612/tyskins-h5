<template>
  <v-card elevation="0" style="background-color: rgba(44, 44, 61, 0.5); border-radius: 10px;" :loading="loading" class="mx-auto pt-4">
    <!-- <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template> -->
    <!-- {{rollItemData}} -->
    <div class="rollitem-topbox">
      <div class="px-4 mt-3" style="height: 74px;">
      <div class="main_skins" style="flex-wrap: nowrap;overflow-x: auto;">
        <div v-for="(item, index) in rollItemData.main_skins" :key="index">
          <img style="height: 50px;" :src="item.image_url" alt="" />
        </div>
      </div>
    </div>
    <div class="d-flex  mb-4">
        <div class="fs13" style="color: #f3a45d;">
          参与人数：{{ rollItemData.join_num }}人
        </div>
        <div class="fs13 ml-2" style="color: #f3a45d;">道具数：{{ rollItemData.prize_num }}个</div>
      </div>
      <div class="fs14" style="height: 40px; color: rgb(186, 193, 211);">
        参与资格：<span v-if="rollItemData.user_grade>0">等级≥{{rollItemData.user_grade}}；</span> {{ rollItemData.room_desc }}
      </div>
    </div>
    <v-card-text>
      
      <div class="d-flex align-center px-4 py-4">
        <div class="mr-3">
          <v-avatar width="56" height="56">
            <img style="width: 100%" :src="rollItemData.avatar" alt="" />
          </v-avatar>
        </div>
        <div class="flex-1">
          <div class="fs14 line1  text-fff80">{{ rollItemData.room_name || "" }}</div>
          <div class="fs18" style="color: #f3a45d">{{rollItemData.prize_pool}}</div>
          <!-- <div class="fs12 text-muted line3">
            开奖时间：
            {{
            $dayjs.unix(rollItemData.lottery_time).format("YYYY-MM-DD HH:mm:ss")
          }}
          </div> -->
        </div>
        <v-btn style="border-radius: 10px;" @click="goDetail(rollItemData.id)" width="80" height="30" color="#e69d5c" elevation="0"><span class="text-white">查看详情</span></v-btn>
      </div>

    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import avatar from "@/assets/img/battle/robot-avatar.jpg";
import { useRouter } from "vue-router";
import { RoomItem } from "@/types/roll";
import type { PropType } from "vue";
import { processImageUrl } from "@/utils";
const props = defineProps({
  rollItemData: {
    type: Object,
  },
});
const router = useRouter();
const loading = ref(false);
const selection = ref(1);
// const emit = defineEmits(["click"])

function goDetail(id) {
  router.push(`/roll/${id}`);
}
// export default {
//     data: () => ({
//       loading: false,
//       selection: 1,
//     }),
//     methods: {
//       reserve () {
//         this.loading = true

//         setTimeout(() => (this.loading = false), 2000)
//       },
//     },
//   }
</script>

<style>
.rollitem-topbox{
  margin: 0 15px;
  padding: 15px;
}
.main_skins{
  display: flex;
  justify-content: space-between;
}
</style>
