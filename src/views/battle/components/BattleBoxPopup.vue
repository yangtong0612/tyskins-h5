<template>
	<q-popup :showFooter="false" :width="isMobile ? '100%' : '1000px'" ref="popupRef" title="对战盲盒">
		<div class="py-6 px-4 m-px4 battle-box-popup">
			<!-- <div class="bor-1px-b mb-4">
				<v-tabs color="blue darken-3">
					<v-tab v-for="(item,index) in tabs" :key="index">{{item}}</v-tab>
				</v-tabs>
			</div>
			 -->
			<v-tabs v-model="curTab" style="background-color: rgba(255,255,255,0.5);" color="blue darken-3" class="qtabs">
				<v-tab @click="changeTab(tab)" v-for="(tab, index) in tabs" :key="index">
					{{ tab.name }}
				</v-tab>
			</v-tabs>
			<div class="d-flex m-box-flex">
				<div class="flex-1 d-flex left-box">
					<div class="left-box-item" v-for="(item, index) in boxs" :key="index" cols="4">
						<div :class="index == activeIndex ? 'active' : ''" @click="clickIitem(index, item.id)" class="boxitem">
							<box-item :item="item"></box-item>
						</div>
					</div>
				</div>
				<div class="right-box">
					<div class="fs14 text-gray mb-2">包含饰品</div>
					<div class="d-flex right-box-body">
						<div class="r-shopitem-box" v-for="(item, index) in skinList" :key="index" cols="4" style="width: 45%">
							<shop-item :showTag="false" :item="item">
								<template #btns>
									<div class="text-yellow fs14">
										概率：{{ times(item.show_probability, 100) }}%
									</div>
								</template>
							</shop-item>
						</div>
					</div>
				</div>
			</div>
		</div>
	</q-popup>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, computed } from 'vue';
import QPopup from '@/components/QPopup.vue';
import BoxItem from '@/components/BoxItem.vue';
import ShopItem from '@/components/ShopItem.vue';
import BoxService from "@/services/BoxService";
import { processImageUrl, times } from "@/utils";
import { SkinItem } from "@/types";
const tabs = ref([])
const curTab = ref(null)
const popupRef = ref(null)
const isMobile = computed(() => window.innerWidth < 600)
const boxs = ref([]);
const activeIndex = ref(0);
const getBoxTypes = () => {
	return BoxService.allType({
		type: 1,
	}).then((response) => {
		const { data } = response;
		tabs.value = data.data
		return data.data;
	});
};

const clickIitem = (index, id) => {
	activeIndex.value = index;
	getSkinList(id)
}

const skinList = ref<SkinItem[]>([]);
const getSkinList = (id) => {

	BoxService.boxSkin({
		box_id: id,
		page_size: 999,
	})
		.then((response) => {
			skinList.value = response.data.data.list.sort((a, b) => b.price - a.price);
		})
		.finally(() => {

		});
};


const getBoxs = (id: number) => {
	return BoxService.list({
		type_id: id,
		page: 1,
		page_size: 999,
		box_type: 1,
	}).then((response) => {
		const { list, total } = response.data.data;
		return list.map((item) => ({
			...item,
			img: processImageUrl(item.img),
		}));
	});
};

const getBoxList = (tab?) => {
	return getBoxTypes().then((response) => {
		tab = tab || response[0]
		getBoxs(tab?.id).then(res => {
			boxs.value = res
			getSkinList(boxs.value[0].id)
		})
	})
}

const changeTab = (tab) => {
	getBoxList(tab)
}

onBeforeMount(() => {
	getBoxList()
});


function open() {
	popupRef.value.open();
}
function close() {
	popupRef.value.close();
}
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>

<style lang="scss" scoped>
.right-box-body {
	flex-wrap: wrap;
	height: 462px;
	overflow: auto;
}

.r-shopitem-box {
	width: 176px;
	margin-right: 12px;
	margin-bottom: 12px;
}

.left-box-item {
	width: 30.3%;
	margin-right: 12px;
	margin-bottom: 12px;
}

.boxitem {
	position: relative;

	&:hover {
		box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
	}

	&::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9;
	}
}

.active {
	box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4000);

	&::after {
		content: "";
		position: absolute;
		bottom: 0;
		height: 8px;
		width: 100%;
		background-color: #FFAA00;
	}
}

.right-box {
	width: 380px;
	position: relative;
	left: 16px;
}

.left-box {
	flex-wrap: wrap;
	height: 490px;
	overflow: auto;
}

.battle-box-popup {
	::-webkit-scrollbar {
		width: 3px;
		background: #DFE5E8;
		opacity: 1;
		border-radius: 0px;
	}

	::-webkit-scrollbar-thumb {
		width: 3px;
		background: #4782F5;
		opacity: 1;
		border-radius: 242px;
	}
}

@media screen and (max-width: 600px) {
	.m-px4 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.qtabs {
		margin-bottom: 1rem !important;
	}

	.m-box-flex {
		flex-direction: column;
	}

	.left-box {
		flex-wrap: nowrap;

		.left-box-item {
			width: auto;
			margin-right: 1rem;
			margin-bottom: 1rem;
		}

		.boxitem {
			width: 17.6rem;
		}
	}

	.right-box {
		flex: 1;
		left: 0;
		width: 100%;

		>div {
			margin-top: .5rem;
			margin-bottom: .5rem !important;
		}

		.right-box-body {
			height: 200px;
		}

		.r-shopitem-box {
			width: 50% !important;
			margin-right: 0;
			padding: 5px;
			margin-bottom: 0;
		}
	}

	.battle-box-popup {
		padding-top: 1rem !important;
	}

	.battle-box-popup .left-box {
		&::-webkit-scrollbar {
			height: 3px;
		}
	}
}

.qtabs {
	margin-bottom: 16px;
}
</style>