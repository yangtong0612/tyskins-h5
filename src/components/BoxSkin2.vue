<template>
	<div>
		<div class="bslist">
			<div class="left">
				<div class="boxbox">
					<div class="imgbox">
						<img style="display: block;width: 100%;" src="../assets/img/bos/boxbg.png" alt="">
						<img v-if="box&&box.box_cover" class="boximg2" :src="box?.box_cover" alt="">
						<img class="boximg1" :src="box?.box_img" alt="">
					</div>
					<div class="px-4 d-flex flex-column j-center h112">
						<div class="fs22 line1 text-white">{{box?.box_name || '月光宝盒'}}</div>
						<!-- v-if="!box.type" -->
						<div class="d-flex align-center" v-if="type !== 'welfare'">
							<img style="width: 16px;" class="mr-1" src="../assets/img/bos/douzi.svg" alt="">
							<span class="fs22" style="color: #FF9900;">{{ box?.box_price || '0.00' }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div v-for="(item,index) in skinListTop" :key="index" class="sitem">
					<div class="right-inner">
						<div class="tritem">
							<ShopItem :item="item">
								<template #btns>
									<div class="d-flex a-center" style="height: 26px; justify-content: space-between; width: 100%;">
										<!-- <div v-if="showProbability" class="text-yellow line1 fs14">
											概率：{{ times(item.show_probability, 100) }}%
										</div> -->
										<div class="d-flex a-center">
											<img style="width: 10px;" src="@/assets/img/bos/suipian.svg" alt="">
											<span style="color: #FF8000;" class="ml-1 fs14">{{ item.price }}</span>
										</div>
									</div>
								</template>
							</ShopItem>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="slist">
			<div v-for="(item,index) in skinListBottom" :key="index" class="sitem">
				<div class="sitem-inner">
					<div class="tritem">
						<ShopItem :item="item">
							<template #btns>
								<div class="d-flex a-center" style="height: 26px; justify-content: space-between; width: 100%;">
										<!-- <div v-if="showProbability" class="text-yellow line1 fs14">
											概率：{{ times(item.show_probability, 100) }}%
										</div> -->
										<div class="d-flex a-center">
											<img style="width: 10px;" src="@/assets/img/bos/suipian.svg" alt="">
											<span style="color: #FF8000;" class="ml-1 fs14">{{ item.price }}</span>
										</div>
									</div>
							</template>
						</ShopItem>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, toRefs, computed} from 'vue'
	import SkinItem from '@/components/SkinItem.vue';
	import ShopItem from '@/components/ShopItem.vue';
	import BoxService from "@/services/BoxService";
	import { times } from '@/utils'
	let boxId = -1;
	const isMobile = computed(()=>window.innerWidth < 600)
	defineProps({
		box: {
			type: Object
		},
		type: {
			type: String
		},
		showProbability: {
			type: Boolean,
			default: true
		}
	})
	const state = reactive({
	  skinList: [],
	  skinListTop: [],
	  skinListBottom: [],
	  loading: false,
	  visible: false,
	});
	
	
	const getSkinList = (id,roomId) => {
	  boxId = id;
	  state.loading = true;
	  
	  // return BoxService.battleBoxSkin({
	  // 		room_id: 25777,
	  //   box_id: boxId,
	  //   page_size: 999,
	  // })
	
	 return BoxService.battleBoxSkin({
	   room_id: roomId,
	   box_id: boxId,
	   sort: 'price',
	   order: 'desc',
	   page_size: 999,
	 })
	    .then((response) => {	
	      state.skinList = response.data.data.list.sort((a, b) => b.skin_price - a.skin_price);
		  state.skinList = state.skinList.map(v=>{
			  v.show_probability = v.real_probability;
			  v.item_name = v.skin_name;
			  v.price = v.skin_price;
			  v.color = v.skin_color;
			  return v
		  })
				if(isMobile.value) {
					state.skinListTop = [];
					state.skinListBottom = state.skinList;
				} else {
					state.skinListTop = state.skinList.filter((item,index) => index<8);
					state.skinListBottom = state.skinList.filter((item,index) => index>=8);
				}
	    })
	    .finally(() => {
	      state.loading = false;
	    });
	};
	
	const { skinList, skinListTop, skinListBottom } = toRefs(state);
	defineExpose({
		getSkinList
	})
</script>

<style scoped lang="scss">
	.h112{
		height: 112px;
	}
    .bgF5F5F5{
		background-color: #F5F5F5;
	}
	.slist{
		display: flex;
		flex-wrap: wrap;
		margin: 0 -7px;
		.sitem{
			width: 16.666%;
			height: 214px;
			margin-bottom: 10px;
			&>div{
				padding: 0 7px;
			}
		}
	}
	.bslist{
		display: flex;
		margin-bottom: 14px;
		height: 400px;
		overflow: hidden;
		.left {
			width: 380px;
			height: 422px;
			margin-right: 14px;
			.bitem{
				width: 368px;
				height: 442px;
				background-color: #4782F5;
				margin-bottom: 14px;
			}
		}
		.right{
			display: flex;
			flex-wrap: wrap;
			flex: 1;
			margin: 0 -7px;
			.sitem{
				width: 25%;
				margin-bottom: 14px;
				.right-inner{
					padding: 0 7px;
				}
			}
		}
		
	}
	.tritem{

	}
	
	.boxbox {
		background-color: #3e3e4a;
		cursor: pointer;
		border-radius: 12px;
		overflow: hidden;
	}
	
	.boxbox:hover .boximg1 {
		transform: translate(-50%, -65%) rotate(-3deg)
	}
	
	.imgbox {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	
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
	
	@media screen and (max-width: 600px) {
		.bgF5F5F5{
			background-color: rgba(0,0,0,0);
		}
	     .slist{
			 .sitem{
				 width: 50%;
				 height: auto;
				 &>div{
				 	padding: 0 4px;
				 }
			 }
		 }  
		 .h112{
		 	height: 80px;
		 }
		 .bslist{
		 	height: auto !important;
		 	overflow: hidden;
		 	.left {
		 		width: 100%;
		 		height: auto !important;
		 		margin-right: 0px;
		 		.bitem{
		 			// width: 368px;
		 			height: auto !important;
		 			background-color: #4782F5;
		 			margin-bottom: 14px;
		 		}
				.imgbox img:first-child{
					// height: 113px;
				}
		 	}
		 	.right{
		 		display: none;
		 		flex-wrap: wrap;
		 		flex: 1;
		 		margin: 0 -7px;
		 		.sitem{
		 			width: 100%;
		 			margin-bottom: 14px;
		 			.right-inner{
		 				padding: 0 4px;
		 			}
		 		}
		 	}
		 	
		 }
	}
</style>