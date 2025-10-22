<template>
	<q-popup :width="isMobile ? '100%' : '1000px'" title="请选择升级目标" ref="popupRef">
		<div class="px-6 py-4 mpx-6 mb-4">
			<div class="topbar">
				<div class="flex-1 price-range">
					<span v-for="(price, index) in price_range" :key="index" :class="{ active: index === rangeIndex }"
						@click="handleClickPrice(index)">{{ index === 0 ? '全部' : !price[1] ? price[0] + '+' : price[0] + '-'
							+ price[1] }}</span>
				</div>
				<div class="d-flex a-center msearch">
					<div @click="handleChangeSort" class="d-flex a-center mr-2 cursor">
						<img style="width: 6px;" class="mr-2" :src="query.desc === 'true' ? sort1 : sort2" alt="">
						<span style="white-space: nowrap;" class="fs14">{{ query.desc === "true" ? '降序' : '升序' }}</span>
					</div>
					<div class="search-box">
						<el-input v-model="query.keyword" @keydown.enter="handleSearch" placeholder="输入物品" />
						<div class="search-btn" @click="handleSearch">搜索</div>
					</div>
				</div>
			</div>
			<div class="d-flex py-4 skin-list" style="flex-wrap: wrap; margin-left: -8px; margin-right: -8px;">
				<div :style="isMobile ? 'width: 50%;' : 'width: 20%;'" v-for="(item, index) in listData" :key="index">
					<div class="px-2 py-2">
						<div class="relative cursor" @click="handleClickSkin(item)">
							<shop-item :item="item">
								<template #btns>
									<div class="d-flex align-center">
										<img class="mr-1" src="@/assets/img/bos/suipian.svg" alt="">
										<span style="color: #FF8000;" class="fs14">{{ item.price }}</span>
									</div>
								</template>
							</shop-item>
							<div v-if="selectSkin && selectSkin.id === item.id" class="abs bg-black-50"
								style="width: 100%;height: 100%; left: 0; top:0;">
								<img style="margin-top: -30px;" class="abs abscc" src="@/assets/img/checked.png" alt="">
							</div>
						</div>
					</div>
				</div>
				<span class="no-data" v-if="!listData.length && !loading">暂无数据</span>
			</div>
		</div>
		<div class="d-flex aj-center" style="margin-top: -20px;">
			<el-pagination :page-size="query.page_size" :total="total" v-model:current-page="query.page"
				@current-change="fetch" hide-on-single-page style="max-width: 96%" layout="prev,pager,next"
				:small="isMobile"></el-pagination>
		</div>
		<!-- <template #footer>
			<div class="d-flex aj-center">
				<v-btn :disabled="!selectSkin" @click="submit" elevation="0" color="primary">确定</v-btn>
			</div>
		</template> -->
	</q-popup>
</template>

<script setup lang="ts">
import ShopItem from '@/components/ShopItem.vue'
import QPopup from '@/components/QPopup.vue';
import {
	reactive,
	toRefs,
	watch,
	ref,
	computed
} from "vue";
import TopService from "@/services/TopService";
import type {
	SkinItem
} from "../index.vue";
import sort1 from '@/assets/img/bos/icon_sort1.png';
import sort2 from '@/assets/img/bos/icon_sort2.png';

const popupRef = ref(null);
const isMobile = computed(() => window.innerWidth < 600)
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	}
})
const emit = defineEmits(['update:modelValue', 'submit'])

let state = reactive({
	query: {
		page_size: 10,
		page: 1,
		keyword: "",
		desc: "true"
	},
	listData: [] as SkinItem[],
	total: 0,
	loading: false,
	rangeIndex: 0,
	selectSkin: null as null | SkinItem,
});

const { listData, rangeIndex, query, total, loading, selectSkin } = toRefs(state);

const price_range = [0, [10, 50],
	[50, 300],
	[300, 1000],
	[1000]
];

const fetch = () => {
	state.loading = true;

	let min_price = "";
	let max_price = "";
	const {
		rangeIndex
	} = state;

	if (rangeIndex) {
		min_price = price_range[rangeIndex][0];
		max_price = price_range[rangeIndex][1] || 999999;
	}

	TopService.getUpgradeSkinList({
		...state.query,
		min_price,
		max_price,
	}).then(response => {
		const {
			list,
			total
		} = response.data.data
		state.total = total;
		state.listData = list;
		console.log(listData)
	}).finally(() => state.loading = false)
}

const handleClickPrice = (index: number) => {
	if (state.rangeIndex !== index) {
		state.rangeIndex = index;
	}
	state.query.page = 1;
	fetch();
};

const handleSearch = () => {
	state.query.page = 1;
	fetch();
};

const handleClickSkin = (skin: SkinItem) => {
	const {
		selectSkin
	} = state;
	if (selectSkin) {
		if (skin.id === selectSkin.id) {
			state.selectSkin = null;
			return;
		}
	}
	state.selectSkin = skin;
	submit()
};

const handleClose = () => {
	emit("update:modelValue", false);
}

const submit = () => {
	emit("submit", state.selectSkin);
	close();
}

const handleChangeSort = () => {
	console.log(state.query.desc);
	const desc = state.query.desc === "true" ? "false" : "true";
	state.query.desc = desc;
	fetch();
}

function open() {
	popupRef.value.open();
	fetch();
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

<style lang="scss">
.search-box {
	display: flex;
	align-items: center;

	.search-btn {
		width: 66px;
		height: 32px;
		background: #4782F5;
		border: 1px solid #4782F5;
		border-radius: 2px 2px 2px 2px;
		color: #ffffff;
		text-align: center;
		line-height: 30px;
		margin-left: -16px;
		position: relative;
		z-index: 9;
		cursor: pointer;
	}
}

.skin-dialog .el-loading-mask {
	background-color: rgb(53, 53, 59, 0.3) !important;
}
</style>
<style scoped lang="scss">
.topbar {
	display: flex;
	padding-bottom: 13px;
	position: relative;
	align-items: center;

	&::after {
		position: absolute;
		content: "";
		left: 0;
		height: 2px;
		bottom: 0;
		right: 0px;
		background-color: #4782F5;
	}
}

.skin-dialog {
	width: 100vw;
	max-width: 800px;
	background: #36363c;
	max-height: 80%;
}

.skin-list {
	height: 460px;
	overflow-y: auto;
	position: relative;

	.no-data {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 12px;
		color: #36363c;
	}
}

.skin-item {
	height: 176px;
	position: relative;
	font-size: 14px;
	background: rgba(26, 26, 27, 0.6);
	cursor: pointer;

	&:hover,
	&.active {
		background: rgba(26, 26, 27, 1);
	}

	&.active {
		.el-icon-success {
			display: inline;
		}
	}

	.el-icon-success {
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.skin-exterior-name {
		color: #989898;
	}

	.skin-short-name {
		color: #fff;
	}

	.skin-price {
		color: rgb(129, 118, 202);

		.diamond {
			position: relative;
			top: 0.085rem;
			width: 0.95rem;
			height: 0.95rem;
		}
	}

	img {
		width: 60%;
	}
}

.price-range {
	font-size: 13px;

	span {
		margin-right: 30px;
		cursor: pointer;
		padding: 0 10px;

		&:last-child {
			margin-right: 0;
		}

		&.active {
			position: relative;
			color: #4782F5;

			&::after {
				content: "";
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, 18px);
				width: 0;
				height: 0;
				border-width: 4px;
				border-style: solid;
				border-color: transparent transparent #4782F5 transparent;
			}
		}
	}
}

@media screen and (max-width: 600px) {
	.skin-list {
		height: 300px !important;
	}

	.mpx-6 {
		padding-left: 5px !important;
		padding-right: 5px !important;
	}

	.topbar {


		flex-direction: column-reverse;

		.price-range {
			margin-top: 10px;
		}

		.msearch {
			width: 100%;
		}
	}
}
</style>
