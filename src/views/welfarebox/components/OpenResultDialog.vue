<template>
	<q-popup :width="isMobile ? '100%' : width" title="开箱结果" ref="popupRef">
		<!-- {{listData}} -->
		<div class="d-flex aj-center pt-3 flex-wrap">
			<div :class="listData.length == 1 ? 'd-flex j-center' : ''" v-for="(item, index) in listData" :key="index"
				:style="{ width: itemWidth }">
				<div class="px-1 py-1">
					<shop-item :style="{ width: listData.length == 1 ? '220px' : '' }" :item="item">
						<template #btns>
							<div class="d-flex align-center" style="margin-top: -10px;">
								<img class="mr-1" src="@/assets/img/jb_01.png" alt="">
								<span class="text-yellow fs16">{{ item.price }}</span>
							</div>
						</template>
					</shop-item>
				</div>
			</div>
		</div>
		<template #footer>
			<div>
				<div>
					<v-btn width="144" height="48" color="primary" elevation="0" @click="sellAll">
						兑换金币 <img class="ml-1" src="@/assets/img/jb_01.png" alt=""> {{ totalPrice }}
					</v-btn>
					<v-btn class="ml-4" width="144" height="48" color="#FFAA00" flat @click="sellAll2">
						<span class="text-white">兑换钻石</span> <img class="ml-1" src="@/assets/img/jb_02.png" alt="">
						<span class="text-white">{{ totalPrice }}</span>
					</v-btn>
				</div>
			</div>
		</template>
	</q-popup>
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
	import ShopItem from '@/components/ShopItem.vue'
	const props = defineProps({
		listData: {
			type: Array,
			default: () => [],
		},
	})
	const isMobile = computed(() => window.innerWidth < 600)

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
		popupRef.value.close();
	};
	const open = () => {
		popupRef.value.open();
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

<style scoped lang="scss">
	.open-result-dialog {
		width: 100vw;
		max-width: 90rem;
		height: 30rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		text-align: center;
		background: rgba(0, 0, 0, 0.2);

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

	::v-deep .v-btn__content {
		display: flex;
		align-items: center;
	}
</style>
