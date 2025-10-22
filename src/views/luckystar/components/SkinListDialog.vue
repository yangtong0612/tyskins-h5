<template>
    <el-dialog :append-to-body="true" class="overlay-dialog" v-model="visible">
      <div class="skin-list-dialog" v-loading="loading">
        <div class="skin-list-dialog-title">
          <div class="title">
            <div class="boximg">
              <img :src="boxcover" alt="">
              <img class="img" :src="boximg" alt="">
            </div>
            <div>
              <span class="boxname">{{ title }}</span>
            <div class="boxprice">{{ boxprice }}</div>
            </div>
          </div>
          <span class="closebtn" @click="visible = false" ></span>
        </div>
  
        <div class="box-skin-list scrollbar">
          <div>
            <div class="box-skin-item" v-for="skin in skinList" :key="skin.id">
              <Award :item="skin" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </template>
    
  <script lang="ts">
  import BoxService from "@/services/BoxService";
  import { SkinItem } from "@/types";
  import { defineComponent, nextTick, onBeforeMount, ref, watch } from "vue";
  import Award from './award.vue'
  import {
      processImageUrl
  } from "@/utils";
  
  export default defineComponent({
    components: {
      Award
    },
  
    setup() {
      const skinList = ref<SkinItem[]>([]);
      const loading = ref(false);
      const visible = ref(false);
      const title = ref("");
      const boxprice = ref("");
      const boxcover = ref("");
      const boximg = ref("");
  
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
        boxprice,
        boxcover,
        boximg,
        open: (box: object) => {
          boxId = box.id;
          title.value = box.name;
          boxprice.value = box.price;
          boxcover.value = processImageUrl(box.cover);
          boximg.value = box.img;
          visible.value = true;
        },
      };
    },
  });
  </script>
    
  <style lang="scss" scoped>
  .skin-list-dialog {
    width: 1142px;
    height: 722px;
    background-image: url('@/assets/img/battle/detail/di.png');
  
    .skin-list-dialog-title {
  
  
      position: relative;
      .closebtn{
        display: inline-block;
        width: 60px;
        height: 60px;
        position: absolute;
        right: 0;
        top: 58px;
        cursor: pointer;
      }
  
      .title {
        position: absolute;
        left: 30px;
        top: -30px;
        width: 277px;
        height: 145px;
        font-size: 20px;
        line-height: 52px;
        color: rgba(255, 255, 255, 0.56);
        display: flex;
        align-items: center;
        line-height: 1em;
        
        background-image: url('@/assets/img/battle/detail/bt.png');
        .boximg{
          position: relative;
          width: 100px;
          height: 100px;
          margin-right: 10px;
          margin-left: 14px;
          img{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
          }
          
        }
        .boxname{
          padding: 0;
          color: #28253b;
          font-size: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          font-weight: bold;
        }
        .boxprice{
          width: 104px;
          height: 27px;
          line-height: 25px;
          color: #FFE13A;
          background-image: url(/src/assets/img/upgrade/zongjiazhi.png);
          background-size: 100% 100%;
          font-size: 14px;
          padding-left: 28px;
          margin-top: 5px;
        }
  
      }
  
  
      
    }
  
    .box-skin-list {
      width: 1020px;
      margin-left: 48px;
      margin-top: 100px;
      height: 560px;
      overflow: auto;
      padding-right: 20px;
      >div {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-gap: 0px;
      }
    }
  }
  
  .scrollbar::-webkit-scrollbar {
      width: 10px;
  }
  
  .scrollbar::-webkit-scrollbar-track {
      background-color: #8D8D8D;
      border: 1.5px solid #8D8D8D;
      border-radius: 8px;
  }
  
  .scrollbar::-webkit-scrollbar-thumb {
      background-color: #FFB205;
      border-radius: 8px;
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
  
        >div {
          justify-content: space-between;
  
          >div {
            width: calc(50% - 3px);
            margin-right: 0;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  </style>
    