<template>
  <div class="tab-pane" v-show="activeKey == name">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "Pane",
  props: {
    label: String,
    name: [Number, String],
  },
  setup() {
    const activeKey = inject("activeKey");
    return {
      activeKey,
    };
  },
});
</script>

<style lang="scss" scoped>
.tab-pane {
  width: 100%;
  height: 100%;
}
</style>