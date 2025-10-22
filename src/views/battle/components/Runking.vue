<template>
  <div>
	  <div v-if="runking.length>0" class="fs14 py-2 text-white">实时排名</div>
	  <div class="" v-if="runking.length>0">
	  	<v-list class="my-vlist">
	  		<template v-for="(item,index) in runking.slice(0, 10)" :key="index">
	  			<v-list-item>
	  				<v-avatar class="mr-2">
	  					<img class="block" :src="item.avatar" alt="">
	  				</v-avatar>
	  				<div class="flex-1 fs14 line1" style="color: #84848d;">{{item.nickname}}</div>
	  				<div class="flex-1 fs14 line1">
						<span class="text-yellow">{{processScore(item.integral)}}</span>
					</div>
					<div class="fs14">
						<span style="color: #84848d;">奖励</span>
						<img class="douzi" src="@/assets/img/bos/douzi.svg" alt="">
						<span class="text-yellow">{{ texts[index].number }}</span>
					</div>
	  			</v-list-item>
	  			<v-divider class="mx-4"></v-divider>
	  		</template>
	  	</v-list>
	  </div>
  </div>
</template>
<script setup lang="ts">
import {ref, reactive, PropType, computed } from "vue";
import { processScore } from "../util";
import { useBattleTop } from "../services";

// import top1 from '@/assets/img/1.png'
// import top2 from '@/assets/img/2.png'
// import top3 from '@/assets/img/3.png'
// import top4 from '@/assets/img/4.png'
// import top5 from '@/assets/img/5.png'
// import top6 from '@/assets/img/6.png'
// import top7 from '@/assets/img/7.png'
// import top8 from '@/assets/img/8.png'
// import top9 from '@/assets/img/9.png'
// import top10 from '@/assets/img/10.png'
	
// const numpng = ref([top1,top2,top3,top4,top5,top6,top7,top8,top9, top10])


const texts = ref([
    { text: '榜一', number: '888' },
    { text: '榜二', number: '288' },
    { text: '榜三', number: '128' },
    { text: '榜四', number: '66' },
    { text: '榜五', number: '56' },
    { text: '榜六', number: '36' },
    { text: '榜七', number: '26' },
    { text: '榜八', number: '16' },
    { text: '榜九', number: '10' },
    { text: '榜十', number: '8' },
]);
const { topThreeScoresYesterday, runking}  = useBattleTop();

const props = defineProps({
	topData: {
	      type: Array,
	      default: () => ([]),
	},
})

</script>

<style scoped lang="scss">
.my-vlist{
	padding: 0;
	background-color: rgba(255,255,255,0);
	.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
		padding-inline-start: 0px;
        padding-inline-end: 0px;
	}
	.mx-4{
		margin-left: 0 !important;
		margin-right: 0 !important;
	}
	.douzi{
		width: 11px;
		margin: 0 3px;
	}
	.v-divider{
		border-color: #eee;
	}
}
.score-box{
		position: absolute;
		display: flex;
		bottom: 180px;
		width: 100%;
		justify-content: space-between;
		.score{
			width: 92px;
			height: 20px;
			background-image: url('@/assets/img/scorebg.png');
			background-size: 100% 100%;
			font-size: 14px;
			color: #ffffff;
			text-align: center;
		}
		.score1{
			margin-left: 3px;
		}
		.score2{
			position: relative;
			top: 43px;
			left: 35px;
		}
		.score3{
			position: relative;
			top: 65px;
			right: 30px;
		}
	}
	
	.avatar-box{
		position: absolute;
		display: flex;
		bottom: 205px;
		width: 100%;
		justify-content: center;
		height: 110px;
		.tx {
			position: relative;
			width: 110px;
			height: 110px;
		}
		.tx1{
			margin: 0 10px;
		}
		.tx2{
			transform: translateY(45px);
		}
		.tx3{
			transform: translateY(65px);
		}
	}
	
	.top1-3{
		width: 392px;
		position: relative;
		height: 370px;
		.ljtbg{
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
.top-num {
	height: 23px;
}
</style>


