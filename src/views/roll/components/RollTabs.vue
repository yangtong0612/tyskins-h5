<template>
  <v-row class="roll-tabs" no-gutters>
    <v-col
      cols="6"
      v-for="(tab, index) in tabs"
      :key="index"
      class="roll-item"
      :class="{ active: tabIndex === index }"
      @click="handleClick(index)"
    >
      {{ tab.name }}
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    return {
      tabs: ["官方roll房", "主播roll房"].map((name, type) => ({
        name,
        type,
      })),
      tabIndex: ref(1),
    };
  },

  methods: {
    handleClick(index) {
      if (this.tabIndex === index) return;
      this.tabIndex = index;
      this.$emit("change");
    },
    getData() {
      return this.tabs[this.tabIndex].type;
    }
  },
});
</script>

<style scoped lang="scss">
.roll-tabs {
  height: 6rem;
  max-height: 60px;

  .roll-item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #989898;
    font-size: 18px;
    font-weight: bold;
    background: #28282e;
    box-sizing: border-box;
    border-bottom: 2px solid transparent;

    &.active {
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        color-stop(30%, rgba(19, 21, 29, 0.5)),
        to(rgba(115, 101, 202, 0.5))
      );
      color: rgb(115, 101, 202);
      border-bottom-color:  rgba(119, 106, 201, 0.8);
    }
  }
}
</style>