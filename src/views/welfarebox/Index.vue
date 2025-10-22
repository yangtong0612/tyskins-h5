<template>
	<div class="bigbg">
		<v-container class="case-box mt-6">
			<div class="switch-box mr-3 d-flex a-center flex-row-reverse mb-3">
				<div class="ml-4">
					<el-switch :disabled="disabled" active-text="关闭声音" v-model="closeAudio" active-color="#4782F5">
					</el-switch>
				</div>

				<el-switch active-text="关闭动画" :model-value="closeAnimation" active-color="#4782F5" :disabled="disabled"
					@change="onAnimationSwitchChange"></el-switch>
			</div>
			<div class="lottery-group">
				<div v-for="(gameItem, i) in state.gameList" :key="i" class="lottery">
					<div class="container" id="shade">
						<div class="carousel-list-box" :class="{ animation: useAnimation }">
							<!-- :class="'bg_'+item.rarity_color.slice(1)" -->
							<div class="carousel carousel-list">
								<div v-for="(item, idx) in gameItem" :key="idx" class="item"
									:class="'bg_' + (item.color ? item.color.slice(1) : 'bdc2c2')"
									:data-open="gameItem.length - idx === 10 ? 1 : 0" :data-id="item.item_id">
									<!-- {{item.rarity_color}} -->
									<div class="item-img casebox carousel-item">
										<div>
											<img :src="item.image_url" />
										</div>
										<p class="line1">{{ item.short_name }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<span class="line">
					<div class="line-bar"></div>
				</span>
			</div>

			<div class="d-flex a-center my-8 m-setbar relative justify-center">
				<section class="d-flex">
					<v-btn style="border-radius: 10px;" @click="openWelfareBox" :disabled="disabled || !state.boxSkinData.list.length"
						class="ml-2" color="#f3a55e" elevation="0" width="144" height="40">
						<div class="d-flex a-center">点击开箱</div>
					</v-btn>
				</section>
			</div>
			<q-title title="箱子内容" class="my-2"></q-title>
			<BoxSkin :box="activeBox" ref="boxSinkRef" type="welfare"></BoxSkin>
			<!-- <q-title title="最近开箱记录" class="my-4"></q-title>
			<div style="overflow: hidden;">
				<div class="d-flex" style="flex-wrap: wrap;">
					<div class="jlitem" v-for="(item, index) in state.recordList" :key="index">
						<CircleItem :item="item"></CircleItem>
					</div>
				</div>
			</div> -->

			<audio ref="lottery-audio" src="/media/opening-sound.mp3" style="display: none"></audio>

			<update-seed-dialog ref="updateSeed" @refresh="getUserSeed"></update-seed-dialog>

			<open-result-dialog ref="resultPopupRef" :list-data="state.openedData" @sell="sell"
				@sell-all="sellAll('coin')" @sell-all-coin="sellAll('diamond')">
			</open-result-dialog>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import {
	onMounted,
	computed,
	reactive,
	ref,
	toRaw,
	toRefs,
	nextTick,
	watch
} from "vue";
import BoxService from "@/services/BoxService";
import CircleItem from "@/components/CircleItem.vue";
import {
	useRouter
} from "vue-router";
import {
	BackpackService
} from "@/services/BackpackService";
import {
	useStore
} from "@/store";
import {
	OpenBoxResult,
	SkinItem
} from "@/types/box";
import UpdateSeedDialog from "./components/UpdateSeedDialog.vue";
import OpenResultDialog from "./components/OpenResultDialog.vue";
import QTitle from '@/components/QTitle.vue'
import BoxSkin from "@/components/BoxSkin.vue";
import { processImageUrl } from "@/utils";
import {
	toast
} from '@/composables/util.js'

const store = useStore();
const music = new Audio("/media/opening-sound.mp3");

const router = useRouter();
const openedData: OpenBoxResult[] = [];

const boxSkinData: {
	list: SkinItem[];
	total: number;
} = {
	list: [],
	total: 0,
};

const gameList: SkinItem[][] = [
	[]
];
const closeAnimation = computed(() => store.getters.disableOpenBoxAnimation)

store.dispatch("getRechargeWelfareBoxTypeId");
const state = reactive({
	openBoxNum: 1,
	closeAudio: false,
	buttonDisable: false,
	boxData: {},
	activeBox: {},
	boxID: parseInt(router.currentRoute.value.params.box_id),
	welfareId: parseInt(router.currentRoute.value.params.id),
	openBoxDialog: false,
	openBoxDialog2: true,
	openedData: openedData,
	boxSkinData,
	num: 0,
	groupCount: 0,
	useAnimation: false,
	opening: false,
	defaultGroupCount: 0,
	animationGroupCount: 0,
	gameList,
	recordList: [],
	isShowOpenResultDialog: true,
})

const { useAnimation, activeBox, closeAudio } = toRefs(state);

const resultPopupRef = ref(null);
const boxSinkRef = ref(null);
function shuffle(arr) {
	var tmp,
		cur,
		top = arr.length;
	if (top)
		while (--top) {
			cur = Math.floor(Math.random() * (top + 1));
			tmp = arr[cur];
			arr[cur] = arr[top];
			arr[top] = tmp;
		}
	return arr;
}

const boxSkinList = computed(() => {
	let list = toRaw(state.boxSkinData.list);
	return JSON.parse(JSON.stringify(list));
});


const getOpenRecord = async () => {
	console.log('getrecord')
	const res = await BoxService.openRecord({
		box_id: state.boxID,
		limit: 40
	});
	if (res.data.code == 0) {
		state.recordList = res.data.data;
	}
};

const onBoxCountChange = () => {
	if (state.groupCount > state.defaultGroupCount) {
		resetGroupCount();
		resetBoxPosition();
	}
	changeGameList();
	return sleep(20);
};
const getBoxAccessories = () => {
	BoxService.boxSkin({
		box_id: state.boxID,
		page_size: 400,
		sort: "price",
		order: "desc",
	}).then((response) => {
		state.boxSkinData = response.data.data;
		// console.log('state.boxSkinData', state.boxSkinData)
		generatorSkinGroupData();
		changeGameList();
	});
};


// 根据饰品概率填充数据
const generatorSkinGroupData = (openItemId?: string) => {

	const {
		list
	} = state.boxSkinData;

	if (!list.length) {
		console.error("没有饰品数据!");
		return [];
	}

	const ret: SkinItem[] = [];
	// console.log(randomSkin())
	for (let i = 0; i < state.groupCount; i++) {
		ret.push(randomSkin());
	}

	if (openItemId) {
		// 末尾追入开奖饰品
		const result = list.find((item) => item.item_id === openItemId);
		if (result) {
			ret[state.groupCount - 10] = result;
		} else {
			console.error("没有找到开奖饰品!", openItemId, list);
		}
	}
	return ret;
};

const randomSkin = () => {
	// 生成一个[0+, 100]的随机数
	let n = Math.random() * 100;

	const {
		total,
		list
	} = state.boxSkinData;
	let m = Math.floor(Math.random() * total);

	// 排个序
	// 过个滤
	const _list = list.slice().sort((a, b) => a.show_probability - b.show_probability);
	return _list[m]
}

const resetGroupCount = () => {
	state.groupCount = state.defaultGroupCount;
};
const setGroupCount = () => {
	state.groupCount = state.animationGroupCount;
};
const setDefaultGroupCount = () => {
	state.animationGroupCount = 100;
	return new Promise((resolve) => {
		const lotteryBox = document.querySelector(".lottery");
		if (!lotteryBox) {
			resolve(setDefaultGroupCount());
			return;
		}
		state.defaultGroupCount = Math.max(
			Math.ceil(lotteryBox.clientWidth / 146),
			10
		);
		resolve(true);
	});
};

const getUserInfo = () => {
	store.dispatch("getUserInfo");
};

const openWelfareBox = async () => {
	if (!userInfo.value) {
		return toast('请先登录', 'warning')
	}

	if (state.buttonDisable || state.opening) return

	state.useAnimation = true
	state.buttonDisable = true
	state.num = state.boxSkinData.total

	await BoxService.unpackRechargeWelfareBox({
		id: state.welfareId,
	})
		.then((res) => {
			state.openedData = processOpenedData([res.data.data])
			state.opening = true
			setGroupCount()
			changeGameList(false)
			let hasValue;
			const setValue = () => {
				if (!hasValue) {
					hasValue = true
					animation()
					setTimeout(() => {
						onOpen()
					}, loadingTime.value)
				}
			}

			nextTick(async () => {
				if (!closeAnimation.value) {
					if (!state.closeAudio) {
						music.currentTime = 0
						music.play()
						music.onplay = setValue
						setTimeout(setValue, 1000)
					} else {
						setValue()
					}
				} else {
					onOpen()
				}
			})

			function onOpen() {
				resultPopupRef.value.open()
				music.pause()
				state.openBoxDialog = true
				state.buttonDisable = false
				state.useAnimation = false
				state.opening = false
			}
		})
		.finally(() => {
			state.buttonDisable = false;
		})

	await getUserInfo()
	await getOpenRecord()
}

// 补充字段
const processOpenedData = (data: OpenBoxResult[]) => {
	return data.map((item) => {
		const result = state.boxSkinData.list.find(
			(skin) => skin.item_id === item.item_id
		);
		const rarity_color = result ?
			result.rarity_color :
			item.rarity_color || "";
		return {
			...item,
			rarity_color,
		};
	});
};
const animation = () => {
	const ch = document.querySelector("#shade")!.clientWidth;
	const carouselBoxs = document.querySelectorAll(".carousel-list-box");
	setTimeout(() => {
		carouselBoxs.forEach((box, index) => {
			const targetElement = box.querySelector(`[data-open="1"]`);

			if (targetElement) {
				const targetWidth = targetElement.clientWidth;
				const n = Math.min(Math.max(Math.random(), 0.2), 0.8);
				box.style.transform = `matrix(1, 0, 0, 1, -${(
					targetElement.offsetLeft -
					ch / 2 +
					targetWidth -
					targetWidth * n
				)}, 0)`
			} else {
				console.error("animation: 没有找到饰品所在位置");
			}
		});
	}, 0);
};

const resetBoxPosition = () => {
	const carouselBoxs = document.querySelectorAll(".carousel-list-box");
	setTimeout(() => {
		carouselBoxs.forEach((box) => {

			const targetWidth = 200;
			const n = Math.min(Math.max(Math.random(), 0.2), 0.8);
			box.style.transform = `matrix(1, 0, 0, 1, -${(n * targetWidth)}, 0)`
		});
	}, 10)
};

const getBox = async () => {
	const res = await BoxService.id({
		box_id: state.boxID
	})
	if (res.data.data.type_id == rechargeWelfareBoxTypeId) {
		toast('该箱子属于充值福利箱子', 'wrning')
		return router.replace('/')
	}
	state.boxData = res.data.data;

	state.activeBox = {
		box_cover: processImageUrl(state.boxData.cover),
		box_name: state.boxData.name,
		box_price: state.boxData.price,
		box_img: processImageUrl(state.boxData.img),
	}
};

const sell = async (item: OpenBoxResult) => {
	const {
		backpack_id: id,
		has_sold
	} = item;
	if (has_sold) {
		return toast('该饰品已出售', 'warning')
	}

	await BackpackService.batchSell({
		ids: [id]
	});
	await getUserInfo();
	toast('出售成功')
	setSoldStatus(id);
};

const sellAll = async (convert) => {
	const ids = state.openedData
		.filter((item) => !item.has_sold)
		.map((item) => {
			return item.backpack_id;
		});

	if (!ids.length) {
		return toast('没有可出售的饰品', 'warning')
	}

	await BackpackService.batchSell({
		ids: ids,
		convert: convert
	});
	getUserInfo();
	resultPopupRef.value = false;
	toast('出售成功')
	state.openBoxDialog = false;

	ids.map((id) => {
		setSoldStatus(id);
	});
};

const setSoldStatus = (id: number) => {
	const item = state.openedData.find((item) => item.backpack_id === id);
	if (!item) return false;
	item.has_sold = true;
	return true;
};

const changeGameList = (isRefresh = true) => {
	const gameList: SkinItem[][] = [];
	for (let i = 0; i < state.openBoxNum; i++) {
		// 只有在填充数据时（获取开奖结果以后）才传入开奖的饰品id
		const openItemId = !isRefresh ? state.openedData[i].item_id : "";
		const groupData = generatorSkinGroupData(openItemId);
		if (isRefresh) {
			gameList.push(groupData);
		} else {
			const currentGroupData = state.gameList[i] || [];
			gameList.push([...currentGroupData, ...groupData]);
		}
	}
	state.gameList = gameList;
	return gameList;
};

const getUserSeed = () => {
	store.dispatch("getUserSeed");
};

const updateSeed = ref(null);

const onAnimationSwitchChange = (value: boolean) => {
	store.commit("changeOpenBoxAnimationStatus", value);
};

const sleep = (t) => {
	return new Promise((resolve) => setTimeout(resolve, t));
};

const userInfo = computed(() => {
	return store.getters.userInfo;
})
const disabled = computed(() => {
	return state.buttonDisable || state.opening;
})
const loadingTime = computed(() => {
	return store.getters.loadingTime;
})
const rechargeWelfareBoxTypeId = computed(() => {
	return store.getters.rechargeWelfareBoxTypeId;
})

const onInit = () => {
	setDefaultGroupCount().then(async () => {
		resetGroupCount()
		getBox()
		getBoxAccessories()
	});
	resetBoxPosition();
	boxSinkRef.value.getSkinList(state.boxID);
	getOpenRecord();
	getUserSeed();
}

watch(() => router.currentRoute.value.params.box_id, (id) => {
	if (id) {
		state.boxID = parseInt(id)
		onInit()
	}
})

watch(() => router.currentRoute.value.params.id, (id) => {
	if (id) {
		state.welfareId = parseInt(id)
	}
})

onMounted(() => {
	onInit()
});
</script>

<style lang="scss" scoped>
.case-box {
	position: relative;
	width: 100%;
	margin: 0 auto;

	.return {
		cursor: pointer;
		position: absolute;
		color: #fff;
		top: 3rem;
		font-size: 1.4rem;
		left: 6%;
		display: flex;
		align-items: center;

		div {
			padding-left: 8px;
		}
	}

	.title {
		width: 100%;
		color: #fff;
		text-align: center;
		padding-top: 3rem;
		margin-bottom: 4rem;
		font-size: 20px !important;
		font-weight: 500;
	}

	.back-button {
		top: 0;
		left: 13px;
		position: absolute;
	}

	.jlitem {
		display: flex;
		justify-content: center;
		position: relative;
		margin-bottom: 10px;
		cursor: pointer;
		width: 145px;
		// margin-right: 35px;
	}

	.recordimg {
		position: absolute;
		left: 50%;
		top: 20px;
		transform: translateX(-50%);
		width: 70%;

	}

	.jlitem .text {
		text-align: center;
		opacity: 0;
		transition: all 0.8s;
	}

	.jlitem:hover .text {
		opacity: 1;
	}

	.lottery-group {
		position: relative;
		width: 100%;
		padding: 18px 0 14px 0;
		background: linear-gradient(297deg, rgba(219, 178, 77, 0) 0%, rgba(219, 178, 77, 0.1) 50%, rgba(219, 178, 77, 0) 100%);

		&::after {
			content: "";
			position: absolute;
			top: -4px;
			left: 0;
			right: 0;
			height: 4px;
			background: linear-gradient(297deg, rgba(219, 178, 77, 0) 0%, #DBB24D 50%, rgba(219, 178, 77, 0) 100%);
		}

		&::before {
			content: "";
			position: absolute;
			bottom: -4px;
			left: 0;
			right: 0;
			height: 4px;
			background: linear-gradient(297deg, rgba(219, 178, 77, 0) 0%, #DBB24D 50%, rgba(219, 178, 77, 0) 100%);
		}

		.line {
			position: absolute;
			height: 100%;
			bottom: 0;
			width: 23.5px;
			display: flex;
			justify-content: center;
			left: 50%;
			transform: translateX(-11px);

			.line-bar {
				width: 3px;
				height: 100%;
				background-color: #e8be3c;

			}

			&::before,
			&::after {
				display: block;
				position: absolute;
				content: "";
				border: 6px solid transparent;
			}

			&::before {
				top: 0;
				border-top-color: #e8be3c;
			}

			&::after {
				bottom: 0;
				border-bottom-color: #e8be3c;
			}
		}
	}

	.lottery {
		position: relative;
		height: 124px;
		overflow: hidden;
		margin-bottom: 4px;
		;

		.container {
			width: 100%;
			overflow: hidden;

			.carousel {
				display: flex;
				left: 0;
				height: 100%;
				width: 100%;

				.item {
					background-color: #36363c;
					margin-right: 4px;
					border-radius: 8px;
					overflow: hidden;
					width: 150px;
					height: 124px;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					text-align: center;

					.item-img {
						display: flex;
						flex-direction: column;
						width: 150px;
						justify-content: center;
						height: 124px;

						img {

							height: 60px;
						}

						p {
							color: #fff;
							font-size: 12px;
						}
					}
				}
			}
		}


	}


}

#shade {
	display: flex;
	align-items: center;
}

.carousel-list-box {
	display: flex;
	flex-wrap: nowrap;
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;

	&.animation {
		transition: transform 6000ms cubic-bezier(0, .64, 0, 1) 0s;
	}

	.carousel-list {
		flex: none;
	}
}

@media screen and (max-width: 768px) {
	.case-box .content .box {
		.img {
			width: 15rem;

			.bc {
				width: 200%;
			}

			.item-img {
				width: 15rem;
			}
		}

		.lottery {
			width: calc(100% + 2rem);
			height: 160px;
			background-size: cover;
			margin-left: -1rem;
			margin-right: -1rem;

			.shadow {
				max-width: 100%;
				top: 0;
				left: 0;
				right: 0;
				display: none;
			}

			.container {
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				bottom: auto;
				width: 100%;
				height: 100%;

				.carousel-list-box {
					height: 100%;
					display: flex;
					align-items: center;
				}

				.carousel {
					height: 75%;

					.item {
						width: 25%;

						.carousel-item {
							// width: 90px;
							height: 100%;

							p {
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
							}

							img {
								width: 86%;
							}
						}
					}
				}
			}
		}

		.open-tip {
			width: 90%;
		}

		.user-seed-detail {
			span:first-child {
				// display: none;
			}
		}
	}

	.jlitem {
		width: 33.33% !important;
	}

}

.user-seed-content {
	word-break: break-all;
	word-wrap: break-word;
}

.openNum span {
	border: 1px solid red;
	display: inline-flex;
	width: 32px;
	height: 32px;
	align-items: center;
	justify-content: center;
	margin-left: 16px;
	border: 1px solid #99A5B7;
	background-color: #ffffff;
	border-radius: 4px;
	cursor: pointer;
}

.openNum span.active {
	background-color: #4782F5;
	border-color: #4782F5;
	color: #ffffff;
}

.bg_e448e2 {
	background-image: url('@/assets/img/rarity_bg04.png');
	background-size: 100% 100%;
}

.bg_4d82da {
	background-image: url('@/assets/img/rarity_bg02.png');
	background-size: 100% 100%;
}

.bg_ff8789 {
	background-image: url('@/assets/img/rarity_bg05.png');
	background-size: 100% 100%;
}

.bg_bdc2c2 {
	background-image: url('@/assets/img/rarity_bg03.png');
	background-size: 100% 100%;
}

.bg_4b69ff {
	background-image: url('@/assets/img/rarity_bg01.png');
	background-size: 100% 100%;
}

.bg_8847ff {
	background-image: url('@/assets/img/rarity_bg06.png');
	background-size: 100% 100%;
}

.bg_d6b45b {
	background-image: url('@/assets/img/rarity_bg07.png');
	background-size: 100% 100%;
}

@media screen and (max-width: 600px) {
	.m-setbar {
		flex-direction: column;
	}

	.m-setbar>div:first-child {
		margin-bottom: 15px;
	}

	.case-box {
		padding-left: 8px !important;
		padding-right: 8px !important;
	}

	.switch-box {
		margin-bottom: 15px;
	}
}

.icon_key {
	width: 16px;
	height: 16px;
	display: inline-block;
	color: #99A5B7;
	// background-image: url('@/assets/img/icon_key.png');
	background-size: 100%;
	margin-right: 6px;
}

.key_num {
	color: #99A5B7;
}
</style>
