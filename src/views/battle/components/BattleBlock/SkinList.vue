<template>
  <div
    class="battle-block-skin-list"
    ref="skinListRef"
    :style="{ top: styleTop + 'px' }"
    :class="{ animation }"
  >
    <div
      v-for="(skin, i) in skinList"
      class="skin-item"
      :class="{ 'is-show': i === skinList.length - offset && !opening }"
    >


      <div class="img-box" :class="skin.color ? ('abg_' + (skin.color ? skin.color?.slice(1) : 'bdc2c2')) : 'abg_bdc2c2'">
        <img :src="skinTemplate" />
        <img :src="skin.image_url" />
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { SkinItem } from "@/types";
import { defineComponent, nextTick, PropType, reactive, toRefs } from "vue";
import skinTemplate from "@/assets/img/battle/skin-template.png";

export default defineComponent({
  setup() {
    const state = reactive({
      skinListRef: void 0 as any,
      styleTop: 0,
      animation: true,
      opening: true,
      offset: 2,
    });

    const getAnimationDuration = () => {
      const transition = getComputedStyle(state.skinListRef).transition || "";
      const [name, time] = transition.split(" ");
      const duration = parseFloat(time || "") * 1000;
      return duration || 5000;
    };

    return {
      skinTemplate,
      ...toRefs(state),
      boxShadowBlur: window.screen.width <= 600 ? "25px 26px" : "28px 36px",
      scroll: (parentHeight: number, offset: number): Promise<void> => {
        return new Promise((resolve, reject) => {
          state.styleTop = 0;
          state.offset = offset;
          state.opening = true;

          nextTick(() => {
            state.animation = true;
            const elements = state.skinListRef.querySelectorAll(".skin-item");
            const element = elements[elements.length - offset];

            state.styleTop = -(
              element.offsetTop -
              parentHeight / 2 +
              element.clientHeight / 2
            );

            const animationDuration = getAnimationDuration();

            const callback = () => {
              if (!state.animation) return;

              state.animation = false;
              state.opening = false;
              resolve();
            };

            state.skinListRef.ontransitionend = (e: any) => {
              if (e.propertyName !== "top") return;
              callback();
            };

            setTimeout(callback, animationDuration);
          });
        });
      },
    };
  },

  props: {
    skinList: {
      type: Array as PropType<SkinItem[]>,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
.battle-block-skin-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  text-align: center;

  &.animation {
    transition: top 5s cubic-bezier(0, 0, 0.01, 1);
    // transition: top 5.1s cubic-bezier(0.4, 0.1, 0.25, 1);
  }

  > div {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px 0;

    &.skin-item {
      &.is-show {
        transition: all 0.4s;
        transform: scale(1.6);
        .skin-name {
          opacity: 1;
        }
      }
      
    }

    .img-box {
      width: 30%;
      position: relative;
      max-width: 100px;
      &::before{
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0px;
        height: 0px;
        border-radius: 50%;
      }

      img:first-child {
        width: 100%;
        opacity: 0;
      }

      img:last-child {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .skin-name {
      width: 96%;
      opacity: 0;
      transition: opacity 0.3s linear;
      text-align: center;
    }
  }
}

// 自定义背景色
.abg_d6b45b {
	// background: linear-gradient(360deg, #957C1E 0%, #4D4831 100%);
  &::before{
    box-shadow: #957C1E 0px 0px 30px 20px;
  }
  
}

.abg_ff8789 {
	// background: linear-gradient(360deg, #8A353C 0%, #46373B 100%);
  &::before{
    box-shadow: #8A353C 0px 0px 30px 20px;
  }
}

.abg_e448e2 {
	// background: linear-gradient(360deg, #C488C7 0%, #602E63 100%);
  &::before{
    box-shadow: #C488C7 0px 0px 30px 20px;
  }
}

.abg_4d82da {
	// background: linear-gradient(360deg, #354369 0%, #343945 100%);
  &::before{
    box-shadow: #354369 0px 0px 30px 20px;
  }
}

.abg_bdc2c2 {
	// background: linear-gradient(360deg, #99A5B7 0%, #384657 100%);
  
  &::before{
    box-shadow: #99A5B7 0px 0px 30px 20px;
  }
}
</style>
