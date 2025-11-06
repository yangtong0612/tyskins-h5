<template>
  <div class="case-item-card" @click="handleClick">
    <div class="case-image-wrapper">
      <img 
        class="case-image" 
        :src="item?.image_url || item?.box_img || item?.box_cover" 
        alt=""
        referrerpolicy="no-referrer"
      />
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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['buy', 'click']);

const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  }
}

.case-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 70%;
  background: rgba(23, 23, 31, 0.6);
  overflow: hidden;
}

.case-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

