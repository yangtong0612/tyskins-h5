<template>
  <div class="roll-card" :class="{ loading: loading.value }">
    <div class="card-header">
      <div class="avatar-box">
        <div class="avatar">
          <v-avatar width="56" height="56">
            <img
              style="width: 100%; border-radius: 50%"
              :src="roomDetail?.avatar || defaultAvatar"
              alt="房间头像"
              @error="handleImgError"
            />
          </v-avatar>
        </div>

        <div class="official-tag">
          {{ roomDetail?.room_name }}
        </div>
      </div>

      <h2 class="card-title">{{ roomDetail?.room_name }}</h2>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">奖金池</span>
        <span class="stat-value">{{ roomDetail?.prize_pool || "0" }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">饰品</span>
        <span class="stat-value">{{ roomDetail?.prize_num || "0" }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">玩家</span>
        <span class="stat-value">{{ roomDetail?.join_num || "0" }}</span>
      </div>
    </div>

    <div class="skins-row">
      <template v-if="roomDetail?.main_skins && roomDetail.main_skins.length">
        <div
          v-for="(item, index) in roomDetail.main_skins"
          :key="index"
          class="skin-item"
        >
          <img
            style="height: 50px; object-fit: cover"
            :src="item.image_url"
            alt="饰品图片"
            @error="(e) => handleImgError(e, index)"
          />
        </div>
      </template>
      <template v-else>
        <div class="skin-item placeholder"></div>
        <div class="skin-item placeholder"></div>
        <div class="skin-item placeholder"></div>
      </template>
    </div>

    <button
      class="view-btn"
      @click="goDetail(roomDetail?.id)"
      :disabled="!roomDetail?.id"
    >
      <span class="btn-icon"></span> 查看抽奖
    </button>

    <div class="end-time">
      结束: {{ formatTime(roomDetail?.lottery_time) || "暂无开奖时间" }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { RoomItem, RoomDetail } from "@/types/roll"; // 确保导入 RoomDetail 类型
import type { PropType } from "vue";
import { RollService } from "@/services/RollService";
import { ElMessage } from "element-plus";
import defaultAvatar from "@/assets/img/battle/robot-avatar.jpg"; // 默认头像

// 1. 完善props定义：指定类型、必填校验、默认值
const props = defineProps({
  rollItemData: {
    type: Object as PropType<RoomItem>,
    required: true,
    default: () => ({}),
  },
});

const router = useRouter();
const loading = ref(false);
const roomDetail = ref<RoomDetail | null>(null);

const skinImgError = ref<boolean[]>([]);

function goDetail(id?: number | string) {
  if (!id) {
    ElMessage.warning("房间ID无效，无法进入详情");
    return;
  }
  router.push(`/roll/${id}`);
}

function handleImgError(e: Event, index?: number) {
  const img = e.target as HTMLImageElement;
  if (index !== undefined) {
    skinImgError.value[index] = true;
    img.style.display = "none";
  } else {
    img.src = defaultAvatar;
  }
}

function formatTime(timestamp?: number) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const getRoomDetail = async () => {
  const roomId = props.rollItemData?.id;
  if (!roomId) {
    ElMessage.warning("缺少房间ID，无法获取详情");
    return;
  }

  loading.value = true;
  try {
    debugger;
    const res = await RollService.getRoomDetail(roomId);
    // 校验接口返回数据有效性
    if (!res.data) {
      throw new Error("接口返回数据为空");
    }
    roomDetail.value = res.data.data;
    // 初始化饰品图片错误状态数组
    skinImgError.value = new Array(res.data.data.main_skins?.length || 0).fill(
      false
    );
  } catch (err: any) {
    console.error("获取房间详情失败：", err);
    ElMessage.error(err.message || "获取房间详情失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 组件挂载时调用接口
onMounted(() => {
  getRoomDetail();
});
</script>

<style scoped>
.roll-card {
  background-color: rgba(44, 44, 61, 0.5);
  border-radius: 10px;
  padding: 16px;
  width: 300px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

/* 加载状态遮罩 */
.roll-card.loading::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(44, 44, 61, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  z-index: 10;
}

/* 加载动画 */
.roll-card.loading::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid #ff7d00;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 20;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 16px;
}

.avatar-box {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  background-color: #3a3a4e; /* 头像背景兜底 */
}

.official-tag {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f5a623;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title {
  font-size: 20px;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 20px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  width: 33.33%;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #99a5b7;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skins-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    height: 0;
  }
}

.skin-item {
  flex: 1;
  min-width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: #3a3a4e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 饰品占位样式 */
.skin-item.placeholder {
  background-color: #3a3a4e;
  opacity: 0.5;
}

/* 饰品图片加载失败占位 */
.skin-item:has(.skin-img-error) {
  background-color: #4a4a5e;
  color: #99a5b7;
  font-size: 10px;
}

.view-btn {
  width: 100%;
  height: 40px;
  background-color: #ff7d00;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.view-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

.view-btn:not(:disabled):hover {
  background-color: #e67000;
}

.btn-icon {
  font-size: 18px;
}

.end-time {
  text-align: center;
  font-size: 12px;
  color: #99a5b7;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
