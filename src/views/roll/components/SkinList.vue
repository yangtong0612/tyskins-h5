<template>
  <div class="skin-list">
    <v-row>
      <v-col cols="4" sm="2" lg="2" v-for="(skin, index) in skinList" :key="index">
        <!-- {{skin}} -->
        <div class="
            d-flex
            flex-column
            justify-space-between
            align-center
            skin-item
          " :class="{ 'is-plain': isPlain }">

          <CircleItem :item="{ image_url: skin?.image_url, nickname: skin?.nickname, avatar: skin?.avatar }">
          </CircleItem>
          <!-- <img style="width: 90%" :src="skin.image_url" alt="" /> -->

          <!-- <template v-if="isPlain || !skin.winner">
           <span style="width: 90%; font-size: 0.75rem" class="text-center text-overflow-2">{{
              skin.item_name
            }}</span>
          </template>
          <template v-else>
            <img class="skin-winner-avatar" :src="skin.winner.avatar" />
            <span>{{ skin.winner.nickname }}</span>
          </template> -->

          <!-- <span class="skin-price">{{ skin.price }}</span> -->

          <!-- 回收提示 -->
          <!-- <div class="tip d-flex align-center justify-center" v-if="!isPlain && !skin.winner">
            房主回收
          </div> -->
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CircleItem from '@/components/CircleItem.vue'

export default defineComponent({
  props: {
    skinList: {
      type: Array,
      default: () => [],
    },
    isPlain: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CircleItem
  }
});
</script>

<style scoped lang="scss">
.skin-list {}

.skin-item {
  position: relative;
  font-size: 12px;
  height: 100%;
  text-align: center;
  font-size: 13px;

  &.is-plain {
    &:hover {
      .skin-price {
        display: block;
      }
    }

    .skin-price {
      display: none;
    }
  }

  .skin-price {
    color: #fff;
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    padding: 0 6px;
    border-radius: 8px;
    z-index: 2;
  }

  .skin-winner-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-top: -18px;
    margin-bottom: 10px;
  }

  .tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10;
  }
}
</style>
