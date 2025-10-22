<template>
	<div>
		<v-card elevation="0" style="background-color: #3e3e4a;">
			<div class="relative">
				<div class="shop-imgbox" :class="rarity ? ('bg_' + (item.color ? item?.color?.slice(1) : 'bdc2c2')) : 'dfbg'">
					<img style=" display: block;height: 100px;" :src="item?.image_url" alt="">
					<slot name="check"></slot>
				</div>
				<div v-if="showTag && item.exterior_name" :style="`background-color: ${exterior[item.exterior_name]};`"
					class="abs absrt lttag">{{ item?.exterior_name }}</div>
					<span v-if="item?.show_probability" class="probability">{{ times(item?.show_probability, 100) }}%</span>
				
			</div>
			<div class="px-3 py-3">
				<div style="color: #cecfd6;" class="line1 mb-2 fs14">{{ item?.item_name || '秋叶原之选' }}</div>
				<div class="d-flex a-center space-between">
					<slot name="btns">
						<div class="d-flex a-center">
							<img style="width: 12px;" class="mr-1" src="../assets/img/bos/suipian.svg" alt="">
							<div class="text-yellow fs14 fw600">{{ item?.price }}</div>
						</div>
						<v-btn v-if="showButton" style="min-width: auto; border-radius: 8px;" @click="buy" width="45px" height="24" elevation="0" color="#f3a45d">兑换
						</v-btn>
					</slot>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { times } from '@/utils'
defineProps({
	item: {
		type: Object,
		default: {
			name: '',
			image_url: '',
			price: '',
			exterior_name: '崭新出厂',
			rarity_color: '#745F2D'
		}
	},
	rarity: {
		type: Boolean,
		default: true
	},
	showTag: {
		type: Boolean,
		default: true
	},
	showButton: {
		type: Boolean,
		default: true
	}
	
})

const exterior = reactive({
	'崭新出厂': '#397439',
	'略有磨损': '#488B48',
	'久经沙场': '#F1AD4D',
	'破损不堪': '#B7625F',
	'战痕累累': '#993A38',
	'无涂装': '#33353B',
})
const emit = defineEmits(['buy']);
const buy = () => {
	console.log('asdfsa')
	emit('buy');
}
</script>

<style lang="scss" scoped>
.shop-imgbox{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 0;
	position: relative;
	padding-bottom: 70%;
	border-radius: 2px;
	background: linear-gradient(0deg, #878B8C 0%, #454142 100%);
	img{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

	}
}
.lttag {
	width: 64px;
	height: 20px;
	line-height: 20px;
	background-color: #E7AF5E;
	color: #ffffff;
	text-align: center;
	border-radius: 2px;
	font-size: 12px;
	border-bottom-left-radius: 20px;
}

.bg_d32ce6 {
	background-image: linear-gradient(0deg,  #86189F, #3E054A);
}

.bg_5e98d9 {
	background-image: linear-gradient(0deg,  #133367, #0d203c);
}

.bg_eb4b4b {
	background-image: linear-gradient(0deg, #451009, #8d2b24, #451009);
}

.bg_b0c3d9 {
	background-image: linear-gradient(0deg,  #667486, #4a5360);
}

.bg_4b69ff {
	background-image: linear-gradient(0deg,  #2c3788, #121b5c);
}

.bg_8847ff {
	background-image: linear-gradient(0deg, #582eac, #2b1558);
}

.bg_e4ae39 {
	background-image: linear-gradient(0deg, #413109, #9B7519, #413109);
}

.dfbg {
	background: linear-gradient(0deg, #878B8C 0%, #454142 100%);
}

.bg_745F2D {
	background-color: #745F2D;
}

// 自定义背景色

.bg_ff8789 {
  background: radial-gradient(101.95% 157% at 50% -23%,rgba(238,58,101,.4) 0,rgba(207,38,89,.316) 31.63%,rgba(81,17,29,0) 100%),#21222b;
}

.bg_bdc2c2 {
  background: radial-gradient(101.95% 157% at 50% -23%,hsla(198,8%,77%,.4) 0,hsla(189,4%,68%,.316) 31.63%,rgba(67,75,77,0) 100%),#21222b;
}

.bg_4d82da {
  background: radial-gradient(101.95% 157% at 50% -23%,rgba(98,195,236,.4) 0,rgba(58,172,197,.316) 31.63%,rgba(22,67,77,0) 100%),#21222b;
}

.bg_e448e2 {
  background: radial-gradient(101.95% 157% at 50% -23%,rgba(130,78,242,.4) 0,rgba(109,39,197,.316) 31.63%,rgba(45,17,81,0) 100%),#21222b;
}

.bg_d6b45b {
  background: radial-gradient(101.95% 157% at 50% -23%,rgba(238,177,58,.6) 0,rgba(198,114,15,.474) 31.63%,rgba(81,55,17,0) 100%),#21222b;
}

.probability{
	position: absolute;
	left: 5px;
	top: 4px;
	color: #fff;
}

</style>