<template>
	<el-dialog :lock-scroll="true" :fullscreen="true" custom-class="res-dialog2" v-model="dialog" :retain-focus="true" ref="popupRef">
		<!-- {{listData}} -->
		
		<div class="d-flex aj-center pt-3 flex-wrap">
			<div class="result-title2">开箱结果
				<el-icon size="20px" @click="dialog = false">
					<Close />
				</el-icon>
			</div>
			<div :class="listData.length == 1 ? 'd-flex j-center' : ''" v-for="(item, index) in listData" :key="index"
				:style="{ width: itemWidth }">
				<div class="px-1 py-1">
					<div class="skin-item">
						<div class="skin-img-box" :class="'bgimg_' + (item.color ? item.color.slice(1) : 'bdc2c2')">
							<img :src="item?.image_url" alt="">
						</div>
						<div class="skin-name line1">{{ item.item_name }}</div>
						<div class="d-flex align-center">
							<img style="width: 14px;" class="mr-1" src="@/assets/img/bos/suipian.svg" alt="">
							<span style="font-weight: bold; color: #FF8000;" class="fs16">{{ item.price }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-5">
			<!-- <div v-if="openType != 'tryUnpack'" class="text-red fs14 mb-4 tc">关闭弹窗饰品自动存入背包</div> -->
			<!-- <div v-if="openType == 'tryUnpack'" class="">
				<v-btn width="144" height="40" color="#FFAA00" flat @click="close">
					<span class="text-white">继续试玩</span>
				</v-btn>
			</div> -->
			<div class="">
				<v-btn class="fs14" width="154" height="40" color="#FFB300" elevation="0" @click="sellAll">
					<div class="d-flex" style="align-items: center;">
						<span class="text-white">兑换</span> 
					    <img class="mx-1" style="width: 12px;" src="@/assets/img/bos/douzi.svg" alt="">
					    <span class="text-white">{{ totalPrice }}</span>
					</div>
				</v-btn>
				<v-btn class="ml-4 fs14" width="144" height="40" color="#FF8000" flat @click="sellAll2">
					<div class="d-flex" style="align-items: center;">
						<span class="text-white">分解</span> 
						<img class="mx-1" style="width: 12px;" src="@/assets/img/bos/suipian.svg" alt="">
						<span class="text-white">{{ totalPrice }}</span>
					</div>
				</v-btn>

				<v-btn v-if="!isMobile" class="ml-4 fs14" width="144" height="40" color="#FF8000" flat @click="dialog = false">
					<div class="d-flex" style="align-items: center;">
						<span class="text-white">继续开箱</span> 
					</div>
				</v-btn>
			</div>
			<div class="mt-4" v-if="isMobile">
				<v-btn class="fs14" block size="x-large" width="144" height="40" color="#FF8000" flat @click="dialog = false">
					<div class="d-flex" style="align-items: center;">
						<span class="text-white">继续开箱</span> 
					</div>
				</v-btn>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import {
	OpenBoxResult
} from "@/types";
import {
	colorRgb
} from "@/utils";
import QPopup from '@/components/QPopup.vue'
import {
	ref,
	reactive,
	computed
} from "vue";
// import ShopItem from '@/components/ShopItem.vue'
const props = defineProps({
	listData: {
		type: Array,
		default: () => [],
	},
	openType: {
		type: String,
		default: 'open'
	}
});
const isMobile = computed(() => window.innerWidth < 600)
const dialog = ref(false);
const itemWidth = computed(() => {
	let len = props.listData.length;
	let width = '33.3333%';
	if (!isMobile.value) {
		width = 100 / len + '%';
	}
	return width;
})
const width = computed(() => {
	let len = props.listData?.length;
	let width = 400;
	if (len > 1) {
		width = len * 210;
	}
	return width + 'px'
})

const totalPrice = computed(() => {
	let price = 0
	props.listData.forEach(item => {
		price += item.price
	})
	return price.toFixed(2)
})
const popupRef = ref(null);

const emit = defineEmits(['close', 'sell', 'sell-all'])


const close = () => {
	// popupRef.value.close();
	dialog.value = false;
};
const open = () => {
	// popupRef.value.open();
	dialog.value = true;
};

const sell = (data: OpenBoxResult) => {
	emit("sell", data);
};

const sellAll = () => {
	close()
	emit("sell-all");
};

const sellAll2 = () => {
	close()
	emit("sell-all-coin");
};

const getBackgroundColor = (data: OpenBoxResult) => {
	return colorRgb(data.rarity_color, 0.9);
};
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>

<style lang="scss">
.res-dialog2 {
	background-color: rgba(78, 78, 78, 0.6);
	backdrop-filter: saturate(150%) contrast(50%) blur(30px);
	-webkit-backdrop-filter: saturate(150%) contrast(50%) blur(30px);
	display: flex;
	flex-direction: column;
	.el-dialog__header {
		display: none;
	}
	.el-dialog__body {
		flex-direction: column;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>

<style scoped lang="scss">


.imgwhite{
	filter: grayscale(100%) brightness(200%)
}
.open-result-dialog {
	width: 100vw;
	max-width: 90rem;
	height: 30rem;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	text-align: center;
	background: rgba(0, 0, 0, 0.4);

	.more-line {
		margin-bottom: 2rem;
	}
}

.card-list-wrapper {
	width: 100%;
	text-align: center;
	overflow-x: auto;
	margin: 0 auto;
}

.card-list {
	display: inline-flex;
	width: max-content;
}

.card-item {
	background: rgba(152, 160, 235, 0.9);
	padding: 1rem 1rem;
	border-radius: 0.3rem;
	display: flex;
	flex-direction: column;
	width: 15rem;
	margin: 0 0.5rem;
	max-width: 160px;
	max-height: 260px;
	flex: none;

	&:last-child {
		margin-right: 0;
	}

	.card-image {
		width: 100%;
		// height: 8rem;
		margin: 1rem auto 0.8rem auto;
		display: block;
	}

	.card-name {
		font-size: 1rem;
		margin: 1rem 0;
		word-break: normal;
		word-wrap: break-word;
		white-space: normal;
	}
}

.text-overflow-2 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.open-result-action {
	display: flex;
	justify-content: center;
	margin-top: 1.6rem;
	width: 100%;
	color: #333;

	>* {
		margin: 0 2rem;
	}
}

.close-icon {
	font-size: 30px;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	font-weight: bold;
}

.card-list-box {
	width: 90%;

	.card-list-wrapper {
		// height: 23rem;
		overflow-x: auto;
		// white-space: nowrap;
		padding-bottom: 6px;
	}
}

@media screen and (max-width: 900px) {
	.card-list-box {
		width: 80%;

		.card-list {
			height: 16rem;

			.card-item {
				width: 36vw;
				padding: 0.5rem;

				.card-name {
					margin: 0.3rem 0;
				}

				.card-image {
					width: 80%;
					height: auto;
				}
			}
		}
	}

	.close-icon {
		top: 0.5rem;
		right: 0.5rem;
	}
}

.skin-item {

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-right: 30px;
	&:last-child{
		margin-right: 0px;
	}

	.skin-name {
		font-size: 16px;
		color: #fff;
		margin-top: 30px;
	}

	.skin-img-box {
		// background-image: url('@/assets/img/bos/bgimg_white.png');
		background-size: 80%;
		background-position: center top;
		background-repeat: no-repeat;
		width: 260px;
		position: relative;
		height: 200px;

		img {
			width: 80%;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
}

.result-title2 {
	width: 100%;
	position: relative;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 20px;
	margin-bottom: 40px;

	.el-icon {
		position: absolute;
		right: 0;
		cursor: pointer;
	}
}




// 自定义背景色
.bgimg_E4AE39 {
	background: radial-gradient(circle at center, #ffd700 0%, rgba(0,0,0,0) 50%);
}

.bgimg_EB4B4B {
	background: radial-gradient(circle at center, #EB4B4B 0%, rgba(0,0,0,0) 50%);
}

.bgimg_D32CE6 {
	background: radial-gradient(circle at center, #D32CE6 0%, rgba(0,0,0,0) 50%);

	
}

.bgimg_8847FF {
	background: radial-gradient(circle at center, #8847FF 0%, rgba(0,0,0,0) 50%);
}

.bgimg_4B69FF {
	background: radial-gradient(circle at center, #4B69FF 0%, rgba(0,0,0,0) 50%);
}


.bgimg_5E98D9 {
	background: radial-gradient(circle at center, #5E98D9 0%, rgba(0,0,0,0) 50%);
}

.bgimg_B0C3D9 {
	background: radial-gradient(circle at center, #B0C3D9 0%, rgba(0,0,0,0) 50%);
}

</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.skin-item{
		.skin-img-box{
			width: 100px;
			height: 80px;
		}
		.skin-name{
			margin-top: 10px;
			font-size: 12px;
			
		}
		.fs16{
			font-size: 12px !important;
		}
	}
	
}
</style>