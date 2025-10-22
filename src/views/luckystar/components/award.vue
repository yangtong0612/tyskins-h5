<template>
    <!-- :class="[`award_${item.color?item.color?.slice(1):'b0c3d9'}`]" -->
   <div class="award" :class="[`award_${item.color?item.color?.slice(1):'bdc2c2'}`]">
       <!-- <div class="probability" v-if="showProbability && item.show_probability">{{ (item.show_probability * 100).toFixed(3) }}%</div>
       <div v-if="!hideInfo" class="item-info"><span class="desc">磨损</span><span class="desc">价格</span><span class="dur">{{
           item?.exterior_name }}</span><span class="price">{{ item?.price }}</span>
       </div> -->
       <div class="itemimg">
           <img :src="item?.image_url">
       </div>
       <p class="weapon-name">
           {{ item?.item_name || '' }}
       </p>
       <div class="itemprice">
           <img src="@/assets/img/roll/daibi.png" alt="">
           <span>{{ item?.price }}</span>
       </div>
       <!-- <img class="exterior_name" src="@/assets/img/roll/zhanxinchuchang-da.png" alt=""> -->
   </div>
</template>

<script lang="ts" setup>

defineProps({
   hideInfo: {
       type: Boolean,
       default: false
   },
   showProbability: {
       type: Boolean,
       default: false
   },
   item: {
       type: Object,
       default: {
           name: '',
           image_url: '',
           price: '',
           exterior_name: '',
           color: ''
       }
   }
})

</script>

<style lang="scss" scoped>


.award {
   position: relative;
   display: flex;
   flex-direction: column;
   box-sizing: border-box;
   overflow: hidden;
   height: 205px;
   background-image: url('@/assets/img/roll/daojukuang.png');
   background-size: 100% 100%;
   margin-right: -8px;
}


.award .exterior_name{
   position: absolute;
   right: 10px;
   top: 10px;

}

.award .itemimg {
   height: 0;
   overflow: hidden;
   padding-bottom: 75%;
   width: 100%;
   position: relative;

}
.award .itemimg img {
   width: 60%;
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
}





.award  .weapon-name {
   font-size: 12px;
   font-weight: 700;
   color: #060606;
   line-height: 18px;
   padding-left: 28px;
   padding-right: 18px;
}





.award .itemprice {
   position: absolute;
   bottom: 20px;
   display: flex;
   align-items: center;
   color: #060606;
   left: 24px;
   font-size: 12px;
   img{
       margin-right: 4px;
   }
}



/* 金 */
.award_d6b45b{
   background-image: url('@/assets/img/bg_yellow.png');
}
/* 红 */
.award_ff8789{
   background-image: url('@/assets/img/bg_red.png');
}

/* 紫 粉 */
.award_e448e2{
   background-image: url('@/assets/img/bg_pink.png');
}
/* 蓝 */
.award_4d82da{
   background-image: url('@/assets/img/bg_blue.png');
}
/* 白 */
.award_bdc2c2{
   background-image: url('@/assets/img/bg_gray.png');
}

</style>


<style scoped lang="scss">
@media screen and (max-width: 768px){
   .award .item-name-con .item-name .weapon-name  {
       font-size: 12px;
   }
}
</style>