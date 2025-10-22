<template>
	<div class="boxbox">
		<div class="imgbox">
			<!-- <img style="display: block;width: 100%;" src="../assets/img/skinbg.png" alt=""> -->
			<div class="skin_price">
				<img src="@/assets/img/bos/suipian.svg" alt="">
				<span>{{ item?.price }}</span>
			</div>
			<img class="img" :src="item?.image_url" alt="">
		</div>
		<slot name="text">
			<div class="px-4 py-4">
				<div class="line1">{{item?.item_name}}</div>
			</div>
		</slot>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		item: {
			type: Object,
		}
	})
</script>

<style lang="scss" scoped>
	.boxbox {
		background-color: #fff;
	}

	.imgbox {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 0;
		padding-bottom: 80%;
		background: linear-gradient(0deg, #878B8C 0%, #454142 100%);
		border-radius: 2px;
		.img{
			position: absolute;
			width: 70%;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

	}
	.skin_price{
		position: absolute;
		right: 10px;
		top: 10px;
		color: #ffffff;
		display: flex;
		align-items: center;
		img{
			width: 12px;
			margin-right: 4px;
		}
	}
</style>
