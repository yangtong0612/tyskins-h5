<template>
  <v-row class="skin-list pa-3">
    <v-col cols="6" md="3" lg="2" v-for="skin in skinList" :key="skin.id">
      <div
        class="skin-item pa-2"
        @click="$emit('click', skin.id)"
        :class="{ active: skin.is_selected }"
      >
        <p
          class="skin-exterior-name d-flex pr-1 align-center"
          :class="skin.is_selected ? 'justify-space-between' : 'justify-end'"
        >
          <i class="el-icon-check" v-if="skin.is_selected"></i>
          {{ skin.exterior_name }}
        </p>
        <img :src="skin.image_url" alt="" />
        <p class="skin-name text-overflow-2">{{ skin.item_name }}</p>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    skinList: {
      type: Array,
      default: () => [],
    }
  }
});
</script>

<style scoped lang="scss">
.skin-item {
  height: 100%;
  background: #2c2c32;
  cursor: pointer;

  &:hover {
    background: #33333a;
  }

  &.active {
    background: #33333a;

    .skin-name {
      color: #bbafff;
    }
  }

  > * {
    width: 100%;
  }

  .skin-exterior-name {
    .el-icon-check {
      font-size: 15px;
      font-weight: bold;
    }
  }

  .skin-name {
    text-align: center;
  }
}
</style>