<template>
  <div class="battle-integral-ranking-item">
    <!-- 奖牌/排名数字 -->
    <div class="ranking-number">
      <img v-if="number === 0" src="@/assets/img/battle/gold-medal.png" alt="" />
      <img v-else-if="number === 1" src="@/assets/img/battle/icon-top2.png" alt="" />
      <img v-else-if="number === 2" src="@/assets/img/battle/icon-top3.png" alt="" />
      <span v-else>{{ number + 1 }}</span>
    </div>
    <!-- 头像 -->
    <img class="ranking-user-avatar" :src="runk.avatar" />
    <!-- 姓名 -->
    <span class="ranking-nickname text-overflow">{{ runk.nickname }}</span>
    <!-- 积分 -->
    <span class="ranking-score">积分：{{ score }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { ScoreRunkItem } from "../services";
import { processScore } from "../util";

export default defineComponent({
  setup(props) {
    return {
      score: computed(() => {
        const { integral } = props.runk;
        return processScore(integral);
      })
    }
  },

  props: {
    runk: {
      type: Object as PropType<ScoreRunkItem>,
      default: () => ({}),
    },

    number: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style scope lang="scss">
.battle-integral-ranking-item {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
  background: linear-gradient(90deg, #9596ae 0%, #494560 100%);

  &:nth-child(1) {
    background: linear-gradient(90deg, #fed4a0 0%, #fde4c6 100%);
    .ranking-score {
      color: #805115;
    }
  }

  &:nth-child(2) {
    background: linear-gradient(90deg, #e8e8e8 0%, #ababab 100%);
    .ranking-score {
      color: #28253b;
    }
  }

  &:nth-child(3) {
    background: linear-gradient(90deg, #ecc18c 0%, #845822 100%);
    .ranking-score {
      color: #4b1700;
    }
  }

  &:last-of-type {
    margin-bottom: 0!important;
  }
}

.ranking-number {
  width: 32px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
  }
}

.ranking-user-avatar {
  width: 40px;
  height: 40px;
  margin-left: 4px;
  border-radius: 50%;
}

.ranking-nickname {
  margin-left: 5px;
  font-size: 14px;
  color: #363539;
  width: 90px;
  margin-right: 6px;
}

.ranking-score {
  font-size: 14px;
  margin-left: auto;
  color: #dcb687;
  margin-left: auto;
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .battle-integral-ranking-item {
    padding: 3px 6px;
    height: 32px;
    box-sizing: border-box;
    background: linear-gradient(90deg, #9596ae 0%, #494560 100%) !important;
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }

    .ranking-number {
      width: 18px;
      font-size: 12px;
    }

    .ranking-user-avatar {
      width: 24px;
      height: 24px;
    }

    .ranking-nickname,
    .ranking-score {
      font-size: 12px;
    }

    .ranking-nickname {
      width: 5rem;
    }

    .ranking-score {
      color: #dcb687;
    }
  }
}
</style>
