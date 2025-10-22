<template>
	<div class="circle-item">
		<div class="circle-box"
			:class="item.skin_color ? ('border_' + (item.skin_color ? item?.skin_color?.slice(1) : 'bdc2c2')) : 'border_bdc2c2'">

			<img class="skinimg" :src="item.skin_image" alt="">
			<img class="avatar" :src="processImageUrl(item.avatar)" alt="">
		</div>
		<div class="text py-2">
			{{item.nickname}}
		</div>
	</div>
</template>

<script setup lang="ts">
import { processImageUrl } from "@/utils"
const props = defineProps({
	item: {
		type: Array
	}
})
</script>

<style scoped lang="scss">
.circle-box {
	width: 100px;
	height: 100px;
	// background-image: url("@/assets/img/kxjlbg.png");
	background: linear-gradient(360deg, #957C1E 0%, #4D4831 100%);
	background-size: 100% 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid #99a5b7;
	position: relative;
	overflow: hidden;

	img {
		height: 60px;
		position: absolute;
	}

	.avatar {
		transition: opacity 0.3s;
		border-radius: 50%;
		opacity: 0;
		width: 100px;
		height: 100px;
	}
}

.circle-box:hover .avatar {
	display: block;
}

.circle-item .text {
	text-align: center;
	opacity: 0;
	transition: opacity 0.3s;
	// color: rgba(0, 0, 0, .87);
}

.circle-item:hover .text {
	opacity: 1;
}

.circle-item:hover .avatar {
	opacity: 1;
}

.circle-item:hover .skinimg {
	opacity: 0;
}

// 自定义背景色
.border_d6b45b {
	border-color: #FEC900;
	background: linear-gradient(360deg, #957C1E 0%, #4D4831 100%);
}

.border_ff8789 {
	border-color: #EB323F;
	background: linear-gradient(360deg, #8A353C 0%, #46373B 100%);
}

.border_e448e2 {
	border-color: #F861FF;
	background: linear-gradient(360deg, #C488C7 0%, #602E63 100%);
}

.border_4d82da {
	border-color: #3C57B4;
	background: linear-gradient(360deg, #354369 0%, #343945 100%);
}

.border_bdc2c2 {
	border-color: #B1BED2;
	background: linear-gradient(360deg, #99A5B7 0%, #384657 100%);
}

@media screen and (max-width: 768px) {
	.circle-box {
		width: 22vw !important;
		height: 22vw !important;

		img {
			height: 18vw;
			position: absolute;
		}

		.avatar {
			transition: opacity 0.3s;
			border-radius: 50%;
			opacity: 0;
		}
	}
}
</style>