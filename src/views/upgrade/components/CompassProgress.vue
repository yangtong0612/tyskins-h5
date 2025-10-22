<template>
  <canvas class="compass-progress" :width="size" :height="size" id="canvas" ref="canvasRef"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue";

export default defineComponent({
  setup(props) {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    const size = 140;
    const canvasSize = size / 2;
    const lineWidth = 8;
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const setCanvas = () => {
      if (!canvasRef.value) return;
      canvas = canvasRef.value;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      ctx = canvas.getContext("2d")!;

      if (window.devicePixelRatio) {
        canvas.height = size * window.devicePixelRatio;
        canvas.width = size * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }

      ctx.strokeStyle = '#f3a55e';
      ctx.lineWidth = lineWidth;
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(canvasSize, canvasSize, canvasSize - lineWidth / 2, Math.PI * 1.5, Math.PI * (1.5 + 2 * props.percent / 100), false);
      ctx.stroke();
    }

    watch(() => props.percent, draw)

    onMounted(() => {
      setCanvas();
      draw();
    })

    return {
      size,
      canvasRef,
    }
  },

  props: {
    percent: {
      type: Number,
      default: 0,
    }
  }
})
</script>

<style lang="scss" scoped>
.compass-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
