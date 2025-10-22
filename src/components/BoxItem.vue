<template>
	<div class="boxbox" @click="goDetail(item)">
		<div class="imgbox">
			<i class="icon-details" v-if="showDetailsIncon" @click="getBoxInnerDetail(item.id)"></i>
			<img style="display: block;width: 100%; opacity: 0; border-radius: 2px;" src="../assets/img/bos/boxbg.png" alt="">
			<img v-if="item&&item.cover" class="boximg2" :src="processImageUrl(item.cover)" alt="">
			<img v-else-if="item&&item.box_cover" class="boximg2" :src="processImageUrl(item.box_cover)" alt="">
			<img v-if="item&&item.img" class="boximg1" :src="processImageUrl(item.img)" alt="">
			<img v-else-if="item&&item.box_img" class="boximg1" :src="processImageUrl(item.box_img)" alt="">
		</div>
		<slot name="text">
			<div class="px-3 py-3">
				<div class="boxtitle line1">
					<div>{{item?.name || item?.box_name || '月光宝盒'}}</div>
					<div class="d-flex" style="align-items: center; font-size: 12px;" v-if="type=='key'">
						<img class="keyimg" :src="item.key_icon" alt="">
						<span v-if="userInfo">x{{ item.key_count }}</span>
					</div>
				</div>
				<div v-if="type !='key'" class="d-flex align-center justify-center">
					<img style="width: 12px;" v-if="item?.price !== (null || undefined)" class="mr-1" src="../assets/img/bos/douzi.svg" alt="">
					<span style="color: #FFB300; font-size: 14px; font-weight: bold;" v-if="item?.price !== (null || undefined)">￥{{ item?.price || '0.00' }}</span>
				</div>
			</div>
		</slot>
	</div>
</template>

<script setup lang="ts">
    import {  computed } from "vue";
	import { useRouter } from "vue-router"
	import { processImageUrl } from "@/utils"
	const emit = defineEmits(['scanBoxInner'])
	import { useStore } from "@/store";
	const store = useStore()
	const userInfo = computed(() => {
		return store.getters.userInfo;
	})
	const router = useRouter()
	const props = defineProps({
		item: {
			type: Object,
		},
		type: {
			type: String
		},
		noClick: {
			type: Boolean,
			default: false,
		},
		showDetailsIncon: {
			type: Boolean,
			default: false
		}
	})
	
	function goDetail(item) {
		if(props.noClick) return;
		const { box_id, id } = item
		const type = props.type
		const routePath = type === 'welfare' ? `/welfarebox/${id}/${box_id}` : `/openbox/${id}`
	  router.push(routePath)
	}

	const getBoxInnerDetail = (id) => {
		emit('scanBoxInner', id)
	}
</script>

<style lang="scss" scoped>
.keyimg{
	width: 20px;
}
	.boxbox {
		cursor: pointer;
		border-radius: 2px;
		overflow: hidden;
		color: #ffffff;
	}

	.boxbox:hover .boximg1 {
		transform: translate(-50%, -65%) rotate(-3deg)
	}

	.imgbox {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		// border: 1px solid red;

		.icon-details {
			position: absolute;
			right: 10px;
			top: 10px;
			width: 16px;
			height: 16px;
			background: url(../assets/img/battle/icon_detail.png) no-repeat 100% center;
			background-size: 100%;
			z-index: 1;
		}
	}

	.boximg1 {
		position: absolute;
		width: 70%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: transform .5s;
	}

	.boximg2 {
		position: absolute;
		width: 80%;

	}
	.boxtitle{
		display: flex;
		justify-content: center;
		font-size: 14px;
		margin-bottom: 4px;
		text-align: center;
		align-items: center;
	}
	@media screen and (max-width: 600px) { 
		.boxtitle{
			font-size: 14px;
		}
	}
</style>
