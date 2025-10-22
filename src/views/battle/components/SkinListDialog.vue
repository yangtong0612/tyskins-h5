<template>
  <v-overlay v-model="visible">
    <div class="skin-list-dialog" v-loading="loading">
      <div class="skin-list-dialog-title">
        {{ title }}
        <img
          src="@/assets/img/battle/icon-close.png"
          class="cursor-pointer"
          @click="visible = false"
          alt=""
        />
      </div>

      <div class="box-skin-list">
        <div>
          <div class="box-skin-item" v-for="skin in skinList" :key="skin.id">
            <div class="box-skin-item-price">
              <img src="@/assets/img/battle/diamond.png" />
              {{ skin.price.toFixed(2) }}
            </div>

            <img class="box-skin-item-image" :src="skin.image_url" alt="" />

            <div class="box-skin-item-name text-overflow">{{ skin.item_name }}</div>

            <div class="box-skin-item-prob">
              概率：{{ Number((skin.show_probability * 100).toFixed(3)) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import BoxService from "@/services/BoxService";
import { SkinItem } from "@/types";
import { defineComponent, nextTick, onBeforeMount, ref, watch } from "vue";

export default defineComponent({
  setup() {
    const skinList = ref<SkinItem[]>([]);
    const loading = ref(false);
    const visible = ref(false);
    const title = ref("");

    let boxId = -1;

    watch(visible, () => {
      if (visible.value) {
        skinList.value = [];

        nextTick(() => {
          getSkinList();
        });
      }
    });

    const getSkinList = () => {
      loading.value = true;

      BoxService.boxSkin({
        box_id: boxId,
        page_size: 999,
      })
        .then((response) => {
          skinList.value = response.data.data.list.sort((a, b) => b.price - a.price);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      skinList,
      loading,
      visible,
      title,
      open: (id: number, name: string) => {
        boxId = id;
        title.value = name;
        visible.value = true;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.skin-list-dialog {
  width: 1200px;

  .skin-list-dialog-title {
    font-size: 20px;
    line-height: 52px;
    background: #28253b;
    text-indent: 32px;
    color: rgba(255, 255, 255, 0.56);
    position: relative;

    img {
      width: 19px;
      height: 19px;
      position: absolute;
      top: 50%;
      right: 32px;
      transform: translateY(-50%);
    }
  }

  .box-skin-list {
    padding: 38px;
    background: #1c192a;

    > div {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      max-height: 65vh;
      min-height: 200px;
    }
  }

  .box-skin-item {
    width: 175px;
    background: #28253b;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
    margin-right: 13px;
    margin-bottom: 12px;

    &:nth-child(6n) {
      margin-right: 0;
    }

    .box-skin-item-price {
      font-size: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      img {
        width: 16px;
        margin-right: 7px;
      }
    }

    .box-skin-item-image {
      width: 100%;
    }

    .box-skin-item-name {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 21px;
      width: 100%;
    }

    .box-skin-item-prob {
      font-size: 12px;
      color: #ffb300;
      margin-top: 6px;
    }
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .skin-list-dialog {
    width: 100vw;

    .skin-list-dialog-title {
      text-indent: 16px;
      font-size: 16px;
      line-height: 40px;

      img {
        width: 16px;
        height: 16px;
        right: 15px;
      }
    }

    .box-skin-list {
      padding: 8px;

      > div {
        justify-content: space-between;

        > div {
          width: calc(50% - 3px);
          margin-right: 0;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
