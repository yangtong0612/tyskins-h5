<template>
  <span class="fs16">{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from "vue";

export default defineComponent({
  setup(props) {
    const { decimals, totalTime, refreshTime, unit } = props;
    const value = ref(0);

    let lastNumber = 0;

    const change = () => {
      const { number } = props;

      if (isNaN(number)) return;
      let n = (number - lastNumber) / (totalTime / refreshTime);

      let timer = -1;

      timer = setInterval(() => {
        let currentVal = value.value;
        currentVal += n;

        if (n < 0) {
          if (currentVal < number) {
            currentVal = number;
          }
        }

        if (n > 0) {
          if (currentVal > number) {
            currentVal = number;
          }
        }

        value.value = lastNumber = currentVal;

        if (currentVal === number) {
          clearInterval(timer);
        }
      }, refreshTime);
    };

    onMounted(() => {
      change();
    });

    watch(
      () => props.number,
      () => {
        change();
      }
    );

    return {
      value: computed(() => {
        return unit + value.value.toFixed(decimals || 0);
      }),
    };
  },

  props: {
    startVal: {
      type: Number,
      default: 0,
    },
    endVal: {
      type: Number,
      default: null,
    },
    totalTime: {
      // 总时长
      type: Number,
      default: 600,
    },
    refreshTime: {
      type: Number,
      default: 30,
    },
    decimals: {
      // 是否是小数
      type: Number,
      default: 2,
    },
    number: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: ""
    }
  },
});
</script>
