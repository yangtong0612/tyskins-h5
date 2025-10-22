<template>
  <v-dialog  persistent v-model="visible">
    <div class="choose-skin-dialog">
      <backpack-skin-container
        ref="container"
        @close="close"
        :room-id="roomId"
      ></backpack-skin-container>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BackpackSkinContainer from "./BackpackSkinContainer.vue";

export default defineComponent({
  setup() {
    return {
      visible: ref(false),
    };
  },

  methods: {
    show() {
      this.visible = true;
      this.fetch();
    },

    close() {
      this.visible = false;
      this.$emit('close');
    },

    fetch() {
      const ref = this.$refs.container as any;
      if (!ref) {
        console.log("!ref!");
        // this.$nextTick(() => this.fetch());
        setTimeout(() => this.fetch(), 300);
        return;
      }
      ref.fetch();
    },
  },

  components: {
    BackpackSkinContainer,
  },

  props: {
    roomId: {
      type: Number,
    }
  }
});
</script>

<style scoped lang="scss">
.choose-skin-dialog {
  width: 65vw;
  margin: 0 auto;
  color: #fff;
  background-color: #2d2d33;
  max-width: 1200px;
}

@media screen and (max-width: 630px) {
  .choose-skin-dialog {
    width: 95vw;
  }
}
</style>
