<template>
	<div class="circle-item">
		<!-- :style="{borderColor: item.rarity_color}"  -->
		<div class="circle-box"
			:class="item.color ? ('border_' + (item.color ? item?.color?.slice(1) : 'bdc2c2')) : 'border_bdc2c2'">

			<img class="skinimg" :src="item.image_url" alt="">
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
	background-image: url("@/assets/img/kxjlbg.png");
	background-color: #f5f5f5;
	background-size: 100% 100%;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 5px solid #99a5b7;

	img {
		height: 60px;
		position: absolute;
	}

	.avatar {
		transition: opacity 0.3s;
		border-radius: 50%;
		opacity: 0;
	}
}

.circle-box:hover .avatar {
	display: block;
}

.circle-item .text {
	text-align: center;
	opacity: 0;
	transition: opacity 0.3s;
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
	border-color: #9B7519;
}

.border_ff8789 {
	border-color: #922D24;
}

.border_e448e2 {
	border-color: #86189F;
}

.border_4d82da {
	border-color: #093680;
}

.border_bdc2c2 {
	border-color: #697A94;
}

@media screen and (max-width: 768px) {
	.circle-box {
		width: 24vw !important;
		height: 24vw !important;

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