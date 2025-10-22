<template>
  <div>
	  <div class="circle-box">
	  	<img  class="ani02" style="width: 320px;" src="@/assets/img/bos/circle_all.png" alt="">
	  	<img style="width: 165px;" class="ani01" src="@/assets/img/bos/circle_4.png" alt="">
	  	<img style="width: 225px;" src="@/assets/img/bos/circle_7.png" alt="">
		<compass-progress :percent="rate"></compass-progress>
		<img
		  src="@/assets/img/bos/pointer2.png"
		  class="img-pointer"
		  ref="pointer"
		  :class="{ animation: isOpenAnimation && animationFlag }"
		  :style="{
		    transform: 'translate(0, 0) rotate(' + rotate + 'deg)',
		  }"
		/>
	  </div>

	  <div class="rotate">
		<div style="font-size: 20px;">{{ rate }}%</div>
		<div>成功率</div>
	  </div>
    
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import CompassProgress from "./CompassProgress.vue";
import { upgradeAnimationDuraction } from "../index.vue";


    const isOpenAnimation = ref(true);
    const deg = ref(0);
    const rotate = ref(0);
    const pointer = ref<HTMLDivElement | null>(null);

    const computedDegAndRotate = (point: number) => {
      const n = (point / 10000) * 360;
      deg.value = n;
      rotate.value = 360 * 10 + n;
    };

    watch(
      () => props.point,
      () => {
        const point = props.point;
        const element = pointer.value;
        if (!element) return;

        if (!point) {
          isOpenAnimation.value = false;
          getComputedStyle(element).transition;
          deg.value = 0;
          rotate.value = 0;
          return;
        }

        if (!props.animationFlag) {
          computedDegAndRotate(point);
          rotate.value = deg.value;
          return;
        }

        const resetRotate = () => {
          setTimeout(() => {
            isOpenAnimation.value = false;
            getComputedStyle(element).transition;
            rotate.value = deg.value;
          }, upgradeAnimationDuraction);
        };

        if (!isOpenAnimation.value) {
          isOpenAnimation.value = true;
          getComputedStyle(element).transition;
        }

        computedDegAndRotate(point);
        resetRotate();
      }
    );
	
	const numbers = [10000, 1250, 2500, 3750, 6250, 7500, 8750]
    

  const props = defineProps({
	  rate: {
	    type: Number,
	    default: 0,
	  },
	  spend: {
	    type: Number,
	    default: 0,
	  },
	  point: {
	    type: Number,
	    default: 0,
	  },
	  animationFlag: {
	    type: Boolean,
	    default: true,
	  },
  })

</script>

<style scoped lang="scss">

.rotate{
	position: absolute;
	color: #ffffff;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	font-size: 16px;
	font-weight: bold;
	text-align: center;
}
.img-pointer {
  transform-origin: center center;
  will-change: transform;
  z-index: 2;
  width: 292px;
  &.animation {
    transition: transform cubic-bezier(0, 0, 0.05, 1) 6s;
  }
}

@keyframes compassAnimation {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) rotate(0deg);
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.circle-box{
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 320px;
		height: 320px;
		img{
			position: absolute;
			
		}
	}
	.myprogress{
		transform: rotate(130deg);
	}
	.myprogress path:first-child {
	    stroke: rgba(255, 255, 255, 0) !important;
		
	  }
	  
	  .ani01 {
	  	animation: compassAnimation 38s linear infinite;
	  	-webkit-animation: compassAnimation 38s linear infinite;
	  
	  }
	  
	  .ani02 {
	  	animation: compassAnimation2 38s linear infinite;
	  	-webkit-animation: compassAnimation2 38s linear infinite;
	  }
	  
	  .ani03 {
	  	animation: compassAnimation2 18s linear infinite;
	  	-webkit-animation: compassAnimation2 18s linear infinite;
	  }
	  
	  @-webkit-keyframes compassAnimation {
	  	0% {
	  		opacity: 0.5;
	  		transform: rotate(0deg);
	  	}
	  
	  	50% {
	  		opacity: 1;
	  	}
	  
	  	to {
	  		opacity: 0.5;
	  		transform: rotate(360deg);
	  	}
	  }
	  
	  @keyframes compassAnimation {
	  	0% {
	  		opacity: 0.5;
	  		transform: rotate(0deg);
	  	}
	  
	  	50% {
	  		opacity: 1;
	  	}
	  
	  	to {
	  		opacity: 0.5;
	  		transform: rotate(360deg);
	  	}
	  }
	  
	  @-webkit-keyframes compassAnimation2 {
	  	0% {
	  		opacity: 0.5;
	  		transform: rotate(360deg);
	  	}
	  
	  	50% {
	  		opacity: 1;
	  	}
	  
	  	to {
	  		
	  		opacity: 0.5;
	  		transform: rotate(0deg);
	  	}
	  }
	  
	  @keyframes compassAnimation2 {
	  	0% {
	  		
	  		opacity: 0.5;
	  		transform: rotate(360deg);
	  	}
	  
	  	50% {
	  		opacity: 1;
	  	}
	  
	  	to {
	  		opacity: 0.5;
	  		transform: rotate(0deg);
	  	}
	  }
</style>
