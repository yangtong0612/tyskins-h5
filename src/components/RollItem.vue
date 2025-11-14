<template>
  <div class="roll-card">
    <!-- 顶部区域：头像 + 官方抽奖标签 -->
    <div class="card-header">
      <div class="avatar-box">
        <div class="avatar" style="background-color: #ff6b9b">
          <!-- 模拟卡通头像，实际替换为真实图片路径 -->
          <div class="avatar-content">
            <span class="avatar-text">蜡笔小新</span>
          </div>
        </div>
        <div class="official-tag">官方抽奖</div>
      </div>
      <h2 class="card-title">Weekly roll</h2>
    </div>

    <!-- 数据统计区域 -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">奖金池</span>
        <span class="stat-value">$11115.15</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">饰品</span>
        <span class="stat-value">123</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">玩家</span>
        <span class="stat-value">210</span>
      </div>
    </div>

    <!-- 饰品展示区域 -->
    <div class="skins-row">
      <div class="skin-item" style="background-color: #4a4a5e">
        <span class="skin-price">$1059.72</span>
      </div>
      <div class="skin-item" style="background-color: #3a3a4e">
        <span class="skin-price">$1059.72</span>
      </div>
      <div class="skin-item" style="background-color: #2a2a3e">
        <span class="skin-price">$1059.72</span>
      </div>
    </div>

    <!-- 按钮区域 -->
    <button class="view-btn"  @click="goDetail(rollItemData.id)"><span class="btn-icon">👁️</span> 查看抽奖</button>

    <!-- 结束时间区域 -->
    <div class="end-time">结束: 05/19/2024 22:55</div>
  </div>
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

</script>

<style scoped>
.roll-card {
  background-color: rgba(44, 44, 61, 0.5);
  border-radius: 10px;
  padding: 16px;
  width: 300px; /* 可根据需求调整宽度 */
  margin: 0 auto;
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
}

.avatar-content {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
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
}

.card-title {
  font-size: 20px;
  color: #fff;
  margin: 0;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
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
}

.skins-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skin-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}

.skin-price {
  color: #f5a623;
  font-size: 12px;
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
}

.btn-icon {
  font-size: 18px;
}

.end-time {
  text-align: center;
  font-size: 12px;
  color: #99a5b7;
  margin-top: 8px;
}
</style>
