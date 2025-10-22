<template>
  <div class="create-room-tabs">
    <div
      v-for="(option, index) in options"
      :key="option.name"
      :class="{ active: modelValue === index }"
      @click="handleClick(index)"
    >
      {{ option.name }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  setup(props, { emit }) {
    return {
      handleClick(index: number) {
        if (props.modelValue === index) return;
        emit("update:modelValue", index);
        emit("change", props.options[index]);
      },
    };
  },
});
</script>

<style scope lang="scss">
.create-room-tabs {
  display: flex;
  flex-wrap: wrap;

  > div {
    padding: 0 24px;
    height: 32px;
    line-height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-right: 8px;
    cursor: pointer;
    margin-bottom: 8px;;

    &::last-child {
      margin-right: 0;
    }

    &.active {
      background: #8e7eed;
      border-color: transparent;
      color: #FFF;
    }
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .create-room-tabs {
    > div {
      padding: 0 19px;
    }
  }
}
</style>
