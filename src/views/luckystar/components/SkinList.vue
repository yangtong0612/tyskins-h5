<template>
    <div class="bottom-popup-inner">
      <div class="left">
        <div class="boxbox">
          <div class="name">{{ boxname }}</div>
          <div class="imgbox">
            <img class="cover" :src="boxcover" alt="">
            <img class="img" :src="boximg" alt="">
          </div>
          <div class="price">
            <span>{{ boxprice }}</span>
          </div>
        </div>
        <div class="text">Items:<span>{{ skinList.length }}</span></div>
      </div>
  
      <div class="right">
        <!-- <div style="color: #000000;">{{ skinList[0].color }}</div> -->
        <div class="item" v-for="(item, index) in skinList" :key="index"
          :class="[`award_${item.color ? item.color?.slice(1) : 'b0c3d9'}`]">
  
          <div v-if="item.show_probability" class="tag_gth">
            <span>Odds:{{ times(item.show_probability, 100) }}%</span>
          </div>
  
          <div class="imgbox">
            <img :src="item?.image_url">
            <span v-if="item.exterior_name == '战痕累累'" class="exterior_tag">BS</span>
            <span v-if="item.exterior_name == '破损不堪'" class="exterior_tag">WW</span>
            <span v-if="item.exterior_name == '久经沙场'" class="exterior_tag">FT</span>
            <span v-if="item.exterior_name == '略有磨损'" class="exterior_tag">MW</span>
            <span v-if="item.exterior_name == '崭新出厂'" class="exterior_tag">FN</span>
          </div>
          <!-- <img class="tag exterior_name" src="@/assets/img/luckystar/ly.png" alt=""> -->
          <div class="price">
            <img src="@/assets/img/index/daibi.png" alt="">
            <span>{{ item.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="right-bottom-text" style="display: none;">
        爆奖概率：
        <span :style="{ color: val.color }" v-for="(val, key, i) in groupedData" :key="i">
          {{ (val.show_probability * 100).toFixed(2) }}%
        </span>
  
      </div> -->
    </div>
  </template>
    
  <script setup lang="ts">
  import BoxService from "@/services/BoxService";
  import { SkinItem } from "@/types";
  import {  nextTick, onBeforeMount, ref, watch } from "vue";
  import { times } from '@/utils'
  import {
    processImageUrl
  } from "@/utils";
  
  
  const skinList = ref<SkinItem[]>([]);
  const loading = ref(false);
  const visible = ref(false);
  const title = ref("");
  const boxprice = ref("");
  const boxcover = ref("");
  const boximg = ref("");
  const boxname = ref("");
  const groupedData = ref([]);
  
  let boxId = -1;
  
  
  
  const getSkinList = () => {
    loading.value = true;
  
    BoxService.boxSkin({
      box_id: boxId,
      page_size: 999,
    })
      .then((response) => {
        skinList.value = response.data.data.list.sort((a, b) => b.price - a.price);
  
        console.log('asdfsdaf', skinList.value.length)
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  
  const open = (box: object) => {
    boxId = box.id;
    title.value = box.name;
    boxprice.value = box.price;
    boxname.value = box.name;
    boxcover.value = processImageUrl(box.cover);
    boximg.value = box.img;
    visible.value = true;
  
  
    skinList.value = [];
    getSkinList();
  }
  
  // 向父组件暴露以下方法
  defineExpose({
          open
      })
  </script>
    
  <style lang="scss" scoped>
  .bottom-popup-inner {
    position: relative;
  
    .left {
  
      position: absolute;
      left: 16px;
      top: 30px;
  
      .boxbox {
  
        width: 208px;
        height: 319px;
        background-image: url('@/assets/img/luckystar/xzd.png');
  
        .name {
          color: #060606;
          font-size: 16px;
          text-align: center;
          padding-top: 24px;
          font-weight: bold;
        }
  
        .imgbox {
          position: relative;
          width: 160px;
          height: 160px;
          margin-left: 22px;
          margin-top: 20px;
  
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
  
          }
        }
  
        .price {
          padding-left: 30px;
          width: 104px;
          height: 27px;
          line-height: 26px;
          background-image: url('@/assets/img/luckystar/zjz.png');
          color: #FFE13A;
          margin: 20px auto 0 auto;
        }
      }
  
      .text {
        text-align: center;
        color: #060606;
        margin-top: 32px;
  
        span {
          color: #FF4A9F;
        }
      }
    }
  
    .right {
      position: absolute;
      width: 500px;
      height: 340px;
      left: 226px;
      top: 30px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 0px;
      overflow: auto;
      padding-right: 10px;
  
      .item {
  
        position: relative;
        background-image: url('@/assets/img/luckystar/djd32.png');
        height: 129px;
        padding-top: 20px;
        background-size: 100% 100%;
  
        /* 金 */
        &.award_d6b45b {
          background-image: url('@/assets/img/bg_yellow.png');
        }
  
        /* 红 */
        &.award_ff8789 {
          background-image: url('@/assets/img/bg_red.png');
        }
  
        /* 紫 粉 */
        &.award_e448e2 {
          background-image: url('@/assets/img/bg_pink.png');
        }
  
        /* 蓝 */
        &.award_4d82da {
          background-image: url('@/assets/img/bg_blue.png');
        }
  
        /* 白 */
        &.award_bdc2c2 {
          background-image: url('@/assets/img/bg_gray.png');
        }
  
        .imgbox {
          position: relative;
          width: 85px;
          height: 70px;
          margin-left: 23px;
  
          img {
            position: absolute;
            width: 80%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
  
        .tag {
          position: absolute;
          left: 10px;
          top: 10px;
        }
  
        .exterior_tag {
          position: absolute;
          color: #ffffff;
          left: 0px;
          bottom: 20px;
          font-size: 10px;
        }
  
        .tag_gth {
          position: absolute;
          right: 18px;
          top: 22px;
          width: 14px;
          height: 14px;
          background-image: url('@/assets/img/gth.png');
          cursor: pointer;
          z-index: 9;
  
          span {
            display: block;
            width: 70px;
            height: 21px;
            background-image: url('@/assets/img/qp.png');
            background-size: 100% 100%;
            font-size: 10px;
            position: absolute;
            right: -5px;
            bottom: 16px;
            text-align: center;
            line-height: 16px;
            color: #ffffff;
            opacity: 0;
            transition: opacity 0.3s;
          }
  
          &:hover span {
            opacity: 1;
          }
        }
  
  
        .price {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #060606;
  
          img {
            width: 15px;
            margin-right: 2px;
          }
        }
      }
    }
  
    .right-bottom-text {
      position: absolute;
      width: 490px;
      left: 286px;
      top: 380px;
      color: #060606;
      display: flex;
      align-items: center;
  
      span {
        display: flex;
        align-items: center;
        margin-right: 10px;
  
        &::before {
          content: "";
          display: inline-block;
          width: 16px;
          height: 16px;
          background: currentColor;
          border: 2px solid #28292A;
          border-radius: 50%;
          margin-right: 3px;
        }
      }
  
      span:last-child {
        &::before {
          // background-color: #47E9C3;
        }
      }
    }
  }
  </style>
    