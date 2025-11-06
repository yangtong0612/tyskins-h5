<template>
  <div class="case-item-card" @click="handleClick">
    <div class="case-image-wrapper">
      <!-- 箱子背景 -->
      <img 
        class="case-cover" 
        :src="coverUrl" 
        alt=""
        referrerpolicy="no-referrer"
      />
      
      <!-- 烟雾特效 -->
      <div class="smoke-effect">
        <div class="smoke smoke-1"></div>
        <div class="smoke smoke-2"></div>
        <div class="smoke smoke-3"></div>
      </div>
      
      <!-- 箱子内的商品 -->
      <img 
        class="case-item" 
        :src="itemImageUrl" 
        alt=""
        referrerpolicy="no-referrer"
        @error="handleItemImageError"
        @load="handleItemImageLoad"
      />
      
      <!-- 发光效果 -->
      <div class="glow-effect"></div>
      
      <div v-if="imageLoading" class="image-loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div class="chart-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 12h12v2H2v-2zm2-4h8v2H4V8zm2-4h4v2H6V4z" fill="currentColor"/>
        </svg>
      </div>
      <span v-if="item.isNew" class="new-badge">NEW</span>
    </div>
    <div class="case-info">
      <div class="case-name">{{ item?.item_name || item?.name || item?.box_name || 'Case' }}</div>
      <div class="case-price">
        <img class="coin-icon" src="@/assets/img/bos/douzi.svg" alt="">
        <span class="price-value">{{ formatPrice(item?.price || 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import { processImageUrl } from '@/utils';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['buy', 'click']);

const imageLoading = ref(true);
const imageError = ref(false);
const itemImageLoading = ref(true);

// 获取箱子背景URL
const coverUrl = computed(() => {
  const item = props.item;
  const cover = item?.cover || item?.box_cover;
  if (!cover) return '';
  return processImageUrl(cover);
});

// 获取箱子内商品图片URL
const itemImageUrl = computed(() => {
  const item = props.item;
  // 优先使用box_img（箱子内的商品图片）
  const itemImg = item?.img || item?.box_img || item?.image_url;
  
  if (!itemImg) {
    return '';
  }
  
  return processImageUrl(itemImg);
});

const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleImageError = (e: Event) => {
  imageLoading.value = false;
  imageError.value = true;
};

const handleImageLoad = () => {
  imageLoading.value = false;
  imageError.value = false;
};

const handleItemImageError = () => {
  itemImageLoading.value = false;
};

const handleItemImageLoad = () => {
  itemImageLoading.value = false;
};

const handleClick = () => {
  emit('click', props.item);
  if (props.item.id) {
    emit('buy', props.item);
  }
};
</script>

<style lang="scss" scoped>
.case-item-card {
  background: rgba(26, 26, 32, 0.8);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(243, 164, 93, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    .case-item {
      transform: translate(-50%, -55%) scale(1.1);
      filter: drop-shadow(0 0 15px rgba(243, 164, 93, 0.8));
    }
    
    .smoke {
      animation-duration: 2s;
    }
    
    .glow-effect {
      opacity: 1;
    }
    
    .chart-icon {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }
  }
}

.case-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 70%;
  background: rgba(23, 23, 31, 0.6);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 箱子背景
.case-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

// 箱子内的商品
.case-item {
  position: absolute;
  width: 70%;
  height: auto;
  max-height: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  transition: transform 0.5s ease, opacity 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(243, 164, 93, 0.5));
  animation: float 3s ease-in-out infinite;
  
  &[src=""],
  &:not([src]) {
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-5px);
  }
}

// 烟雾特效
.smoke-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.smoke {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 120%;
  height: 100%;
  background: radial-gradient(ellipse at center, 
    rgba(138, 43, 226, 0.4) 0%,
    rgba(75, 0, 130, 0.3) 30%,
    rgba(255, 192, 203, 0.2) 60%,
    transparent 100%);
  border-radius: 50%;
  transform: translateX(-50%);
  animation: smokeRise 4s ease-in-out infinite;
  filter: blur(20px);
}

.smoke-1 {
  animation-delay: 0s;
  opacity: 0.6;
}

.smoke-2 {
  animation-delay: 1s;
  opacity: 0.4;
  width: 100%;
  height: 80%;
}

.smoke-3 {
  animation-delay: 2s;
  opacity: 0.3;
  width: 80%;
  height: 60%;
}

@keyframes smokeRise {
  0% {
    transform: translateX(-50%) translateY(20px) scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateX(-50%) translateY(-30px) scale(1.2);
    opacity: 0;
  }
}

// 发光效果
.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center,
    rgba(138, 43, 226, 0.2) 0%,
    rgba(75, 0, 130, 0.1) 40%,
    transparent 70%);
  z-index: 2;
  pointer-events: none;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(23, 23, 31, 0.8);
  z-index: 1;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(243, 164, 93, 0.3);
  border-top-color: #f3a45d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chart-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  z-index: 2;
  transition: all 0.2s ease;
  cursor: pointer;
}

.new-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #f3a45d;
  color: #503d2e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  z-index: 2;
}

.case-info {
  padding: 10px 12px;
  background: rgba(26, 26, 32, 0.9);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.case-name {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 6px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-price {
  display: flex;
  align-items: center;
  gap: 4px;
}

.coin-icon {
  width: 12px;
  height: 12px;
}

.price-value {
  font-size: 13px;
  font-weight: 600;
  color: #f3a45d;
}
</style>

