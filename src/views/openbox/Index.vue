<template>
	<div class="openbox-bg">
		<v-container class="case-box">

			<div class="box-name">
				<div @click="$router.back()" class="back-btn">
					<img src="@/assets/img/back-arrow.svg" alt="">
					<span>返回</span>
				</div>

				<div>{{ activeBox.box_name }}</div>
			</div>
			<div class="lottery-box" :class="openBoxNum > 1 ? 'vertical-com' : 'horizontal-com'">
				<div class="mask left"></div>
				<div class="mask right"></div>

				<div class="box-list" v-show="!disabled">
					<div class="box-item-wrap" v-for="(item, index) in openBoxNum" :key="index" 
							:class="`item${openBoxNum} `">
							<div class="box-item show">
								<div class="boximgs">
									<img v-if="activeBox.box_cover" class="box_cover" :src="activeBox.box_cover" alt="">
									<img v-if="activeBox.box_img" class="box_img" :src="activeBox.box_img" alt="">
								</div>
							</div>
						</div>
				</div>

				<div v-show="disabled" class="lottery-group" :class="openBoxNum > 1 ? 'vertical' : 'horizontal'">
					<div v-for="(gameItem, i) in state.gameList" :key="i" class="lottery">
						<div class="container" id="shade">
							<div class="carousel-list-box" :class="{ animation: useAnimation }">
								<!-- :class="'bg_'+item.rarity_color.slice(1)" -->
								<div class="carousel carousel-list">
									<div v-for="(item, idx) in gameItem" :key="idx" class="item"
										:data-open="gameItem.length - idx === 10 ? 1 : 0" :data-id="item.item_id">
										<div class="item-img casebox carousel-item" :class="'bg_' + (item.color ? item.color.slice(1) : 'bdc2c2')">
											<div>
												<!-- <img :src="item.image_url" /> -->
												<img referrerpolicy="no-referrer" :src="item.image_url">
											</div>
											<!-- <p class="line1 px-1">{{ item.item_name }}</p> -->
										</div>
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

			<div class="d-flex a-center my-8 m-setbar relative" :class="{ 'justify-center': state.isWelfare }">
				<div class="flex-1 d-flex a-center" v-if="state.isGradeReward">
					<img :src="processImageUrl(boxKeyType)" alt="key" class="icon_key">
					<span class="key_num">{{ state.boxKeyNum }}</span>
				</div>
				<div v-else-if="state.isWelfare"></div>
				<div style="font-size: 14px;" class="flex-1 d-flex a-center" v-else-if="boxType == 4">
					<img style="width: 24px;" :src="keyIcon" alt="">
					<span class="text-white">x{{ keyCount }}</span>
				</div>

				<div class="d-flex a-center" v-else>
					<span class="text-white">开箱数量</span>
					<div class="openNum">
						<span @click="changeBoxNum(item)" :class="openBoxNum == item ? 'active' : ''"
							v-for="(item, index) in openNums" :key="index">{{ item }}</span>
						<!-- <div class="tit">转盘数量</div> -->
					</div>
				</div>
				<div class="open-btns">
					<section class="d-flex" v-if="state.isGradeReward">
						<v-btn style="border-radius: 10px;" @click="openBox('keyUnpack')"
							:disabled="disabled || !state.boxSkinData.list.length" class="ml-2" color="#f3a55e"
							elevation="0" width="144" height="40">
							<div class="d-flex a-center">点击开箱</div>
						</v-btn>
					</section>
					<section class="d-flex" v-else-if="boxType == 4">
						<v-btn style="border-radius: 10px;" @click="openBox('keyUnpack')"
							:disabled="disabled || !state.boxSkinData.list.length" class="ml-2" color="#f3a55e"
							elevation="0" width="144" height="40">
							<div class="d-flex a-center">点击开箱</div>
						</v-btn>
					</section>
					<section class="d-flex" v-else>
						<div class="d-flex a-center">
							<v-btn style="border-radius: 10px;" @click="openBox('unpack')"
								:disabled="disabled || !state.boxSkinData.list.length" class="ml-2" color="#f3a55e"
								elevation="0" :width="isMobile ? '120' : '140'" height="40">
								<div style="color: #4f3d2e;" class="d-flex a-center fs12" v-if="boxPrice">
									开箱
									<img style="width: 14px;" class="ml-1" src="@/assets/img/bos/douzi.svg" alt="">
									<span class="fw600 ml-1">{{ boxPrice }}</span>
								</div>
							</v-btn>
						</div>
					</section>
				</div>
				<div class="right-btn-box">
					<div class="switch-box mr-3 d-flex a-center flex-row-reverse">
						<div class="ml-4">
							<el-switch size="small" :disabled="disabled" active-text="关闭声音" v-model="closeAudio"
								active-color="#f3a55e">
							</el-switch>
						</div>
						<el-switch size="small" active-text="关闭动画" :model-value="closeAnimation" active-color="#f3a55e"
							:disabled="disabled" @change="onAnimationSwitchChange"></el-switch>
					</div>
					
				</div>
			</div>
			<div class="bottom-container">
				<q-title v-if="!isMobile" style="margin-bottom: 30px;" class="bg1" title="箱子内容">
					<template #desc>
						<span v-if="boxType == 4"></span>
						<span v-else @click="dialog = true" class="cursor"
							style="font-size: 12px; color: #666666;">最近开箱记录</span>
					</template>
				</q-title>

				<div class="m-tabs">
					<div class="m-tab-item active">箱子内容</div>
					<span v-if="boxType == 4"></span>
					<div v-else @click="dialog = true" class="m-tab-item">最近开箱记录</div>
				</div>

				<div v-show="tabIndex == 0">
					<BoxSkin :box="activeBox" ref="boxSinkRef"></BoxSkin>
				</div>
			</div>

			<audio ref="lottery-audio" src="/media/opening-sound.mp3" style="display: none"></audio>

			<update-seed-dialog ref="updateSeed" @refresh="getUserSeed"></update-seed-dialog>

			<open-result-dialog :openType="state.openType" ref="resultPopupRef" :list-data="state.openedData"
				@sell="sell" @sell-all="sellAll('coin')" @sell-all-coin="sellAll('diamond')">
			</open-result-dialog>
		</v-container>

		<el-dialog :lock-scroll="true" :fullscreen="true" custom-class="recordList-dialog" v-model="dialog"
			:retain-focus="true" ref="popupRef">
			<div class="recordList-box">
				<div class="result-title3">最近开箱记录
					<el-icon size="16px" @click="dialog = false">
						<Close />
					</el-icon>
				</div>
				<div class="jl-grid-wrap">
					<div class="jl-grid" style="flex-wrap: wrap;">
						<div class="jlitem" v-for="(item, index) in state.recordList" :key="index">
							<CircleItem :item="item"></CircleItem>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
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
import CircleItem from "@/components/CircleItem2.vue";
import {
	useRouter
} from "vue-router";
import {
	BackpackService
} from "@/services/BackpackService";
import {
	UserService
} from "@/services/UserService";
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
const isMobile = computed(() => window.innerWidth < 600)
const router = useRouter();
const openedData: OpenBoxResult[] = [];


const boxSkinData: {
	list: SkinItem[];
	total: number;
} = {
	list: [],
	total: 0,
};
const openNums = ref([1, 2, 3, 4, 5]);
const gameList: SkinItem[][] = [
	[]
];
const closeAnimation = computed(() => store.getters.disableOpenBoxAnimation)

store.dispatch("getRechargeWelfareBoxTypeId");
const state = reactive({
	openType: '',
	openBoxNum: 1,
	closeAudio: false,
	buttonDisable: false,
	boxData: {},
	activeBox: {},
	boxID: router.currentRoute.value.params.id,
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
	isGradeReward: false,
	isWelfare: false,
	boxKeyNum: 0,
	boxKeyType: '',
	welfareId: '',
	boxType: 0,
	keyIcon: '',
	keyCount: 0,
});

const { openBoxNum, useAnimation, openBoxDialog, boxData, activeBox, closeAudio, boxKeyType, boxType, keyIcon, keyCount } = toRefs(state);

// function changeBoxNum(i) {
//  	state.openBoxNum = i;
//  }

const dialog = ref(false);
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

const tabIndex = ref(0);

const changeTab = (index) => {
	tabIndex.value = index;
}

const boxSkinList = computed(() => {
	let list = toRaw(state.boxSkinData.list);
	return JSON.parse(JSON.stringify(list));
});

const boxPrice = computed(() => {
	return state.boxData.price ?
		(state.boxData.price * state.openBoxNum).toFixed(2) :
		"";
});


// methods
const changeBoxNum = (i) => {
	if (disabled.value) return;
	state.openBoxNum = i;

	onBoxCountChange()
	nextTick(() => {
		setTimeout(() => {
			resetBoxPosition();
		}, 100)
	})
};

const getOpenRecord = async () => {
	console.log('getrecord')
	const res = await BoxService.openRecord2({
		box_id: state.boxID,
		limit: 40
	});
	if (res.data.code == 0) {
		state.recordList = res.data.data.list;
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
	// console.log(state.boxSkinData)
	let m = Math.floor(Math.random() * total);
	let start = 0;



	// 排个序
	// 过个滤
	const _list = list.slice().sort((a, b) => a.show_probability - b.show_probability);
	// console.log(_list[m].rarity_color)
	return _list[m];
	// for (let i = 0; i < _list.length; i++) {
	// 	const skin = _list[i];
	// 	const {
	// 		show_probability
	// 	} = skin;
	// 	// console.log('start', start, 'end', show_probability + start, 'show_probability', skin.show_probability, 'n', n);
	// 	if (n >= start && n <= (show_probability * 100) + start) {
	// 		return skin;
	// 	}

	// 	start += show_probability * 100;
	// }

	// 未命中任何项，返回一个兜底
	// 开奖率最高的
	// console.log("Default!", n, _list);
	return _list.slice(-1)[0];
	// return _list
};

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

const getKeyNum = () => {
	// 获取钥匙数量
	return BoxService.getKeyNumByBoxId({
		box_id: `${state.boxID}`
	}).then(res => {
		state.keyCount = res?.data?.data?.count
	})
}

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
		id: parseInt(state.welfareId),
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

const openBox = async (type: string) => {
	console.log(state.closeAudio)

	//
	if (!userInfo.value && type == 'open') {
		toast('请登录后购买', 'warning')
		return;
	}
	state.lotteryDialog = true;
	await sleep(300);

	if (state.buttonDisable || state.opening) return;



	state.openType = type;


	// resetBoxPosition();
	// await sleep(20);
	state.useAnimation = true;
	state.buttonDisable = true;
	state.num = state.boxSkinData.total;

	// 重新渲染行
	// await onBoxCountChange();

	const param = {
		box_id: parseInt(state.boxID),
	}

	if (type !== 'keyUnpack') {
		param.num = state.openBoxNum
	}

	await BoxService[type]({
		...param
	})
		.then((res) => {
			let result = []
			if (type === 'keyUnpack') {
				result = [res.data.data]
			} else {
				result = Array.isArray(res.data.data) ? res.data.data : res.data.data.list
			}
			console.log(result)
			if (type !== 'tryUnpack') {
					getUserInfo()
					getOpenRecord()
				if (type === 'keyUnpack') {
						getKeyNum()
				}
			}
			
			state.openedData = processOpenedData(result);
			state.opening = true;
			setGroupCount();
			changeGameList(false);
			let hasValue;
			const setValue = () => {
				if (!hasValue) {
					hasValue = true;
					if (openBoxNum.value > 1) {
						animation2();
					} else {
						animation();
					}

					setTimeout(async () => {
						onOpen();
						if (type !== 'tryUnpack') {
							await getUserInfo()
							await getOpenRecord()
							if (type === 'keyUnpack') {
								await getKeyNum()
							}
						}
					}, loadingTime.value);
				}
			}

			nextTick(async () => {
				if (!closeAnimation.value) {

					if (!state.closeAudio) {
						music.currentTime = 0;
						music.play();
						music.onplay = setValue;
						setTimeout(setValue, 1000);
					} else {
						setValue();
					}

				} else {

					if (openBoxNum.value > 1) {
						animation2();
					} else {
						animation();
					}
					onOpen();
					
				}
			});

			async function onOpen() {

				music.pause();
				
				resultPopupRef.value.open();
				await sleep(1000);
				state.lotteryDialog = false;
				state.buttonDisable = false;
				state.useAnimation = false;
				state.opening = false;
			}
		})
		.finally(() => {
			state.buttonDisable = false;
		});
};
// 补充字段
// rarity_color
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
				// +6px maring-right
				const targetWidth = targetElement.clientWidth;
				console.log(targetWidth)
				const n = Math.min(Math.max(Math.random(), 0.2), 0.8);
				// transform: matrix(1, 0, 0, 1, -6264, 0);
				box.style.transform = `matrix(1, 0, 0, 1, -${(
					targetElement.offsetLeft -
					ch / 2 +
					targetWidth -
					targetWidth * n
				)}, 0)`

				// box.style.left = -(
				// 	targetElement.offsetLeft -
				// 	ch / 2 +
				// 	targetWidth -
				// 	targetWidth * n
				// ) + "px";
			} else {
				console.error("animation: 没有找到饰品所在位置");
			}
		});
	}, 0);
};
const animation2 = () => {
	const ch = document.querySelector("#shade")!.clientHeight;

	const carouselBoxs = document.querySelectorAll(".carousel-list-box");

	setTimeout(() => {
		carouselBoxs.forEach((box, index) => {
			const targetElement = box.querySelector(`[data-open="1"]`);

			if (targetElement) {
				const targetHeight = targetElement.clientHeight;
				console.log('targetHeight', targetHeight)
				let items = [];
				if(openBoxNum.value == 2) {
					items = [ 5000, 5500]
				}
				if(openBoxNum.value == 3) {
					items = [ 4500, 5000, 5500]
				}
				if(openBoxNum.value == 4) {
					items = [ 4000, 4500, 5000, 5500]
				}
				if(openBoxNum.value == 5) {
					items = [ 3500, 4000, 4500, 5000, 5500]
				}
				
				if (!closeAnimation.value) {
					box.style.transitionDuration = items[index] + 'ms';
				}
				box.style.transform = `matrix(1, 0, 0, 1, 0, -${(
					targetElement.offsetTop - (ch/2) + (targetHeight/2)
				)})`

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

			const targetWidth = 0;
			const n = Math.min(Math.max(Math.random(), 0.2), 0.8);
			box.style.transform = `matrix(1, 0, 0, 1, -${(n * targetWidth)}, 0)`
		});
	}, 10)
};


const getBox = async () => {
	const res = await BoxService.id({
		box_id: state.boxID
	});
	if (res.data.data.type_id == rechargeWelfareBoxTypeId.value) {
		toast('该箱子属于充值福利箱子', 'wrning')
		return router.replace('/')
	}
	state.boxData = res.data.data;
	state.boxType = res.data.data.box_type;





	state.activeBox = {
		box_cover: processImageUrl(state.boxData.cover),
		box_name: state.boxData.name,
		box_price: state.boxData.price,
		box_img: processImageUrl(state.boxData.img),
		type: state.isWelfare ? 'welfare' : ''
	}

	if (state.boxType == 4) {
		getKeyCount()
		const bres = await BoxService.boxKeyInfo({ id: state.boxData.key_id });
		state.keyIcon = processImageUrl(bres.data.data.box_key.icon);
	}



}

const getKeyCount = async () => {
	if (userInfo.value) {
		const cres = await BoxService.getKeyNumByBoxId({ box_id: state.boxID });
		state.keyCount = cres.data.data.count;
	}

}

const sell = async (item: OpenBoxResult) => {
	const {
		backpack_id: id,
		has_sold
	} = item;
	if (has_sold) {
		toast('该饰品已出售', 'warning')
		return;
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
		toast('没有可出售的饰品', 'warning')
		return;
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
const handleChangeSeed = () => {
	updateSeed.value.open();
};

const onAnimationSwitchChange = (value: boolean) => {
	store.commit("changeOpenBoxAnimationStatus", value);
};

const sleep = (t) => {
	return new Promise((resolve) => setTimeout(resolve, t));
};



const userSeed = computed(() => {
	return store.getters.userSeed;
})
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
	const query = router.currentRoute.value?.query
	if (query) {
		const type = query?.type
		const isGradeReward = type === 'grade_reward'
		const isWelfare = type === 'welfare'
		state.isGradeReward = isGradeReward
		state.isWelfare = isWelfare
		state.welfareId = query?.id
		if (isGradeReward) {
			state.boxKeyType = query?.key
			getKeyNum()
		}
	}
	setDefaultGroupCount().then(async () => {
		resetGroupCount();
		getBox();
		getBoxAccessories();
	});
	resetBoxPosition();
	boxSinkRef.value.getSkinList(state.boxID);
	getOpenRecord();
	getUserSeed();

}

watch(() => router.currentRoute.value.params.id, (id) => {
	if (id) {
		state.boxID = id
		onInit()
	}
})

onMounted(async () => {
	onInit()
	// getKeyCount();
});
</script>

<style lang="scss" scoped>
.case-box {
	position: relative;
	width: 100%;
	margin: 0 auto;
	padding-top: 36px;
	padding-bottom: 16px;

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

	.lottery-box {
		position: relative;
		border-bottom: 3px solid #141328;
		border-top: 3px solid #16152c;
		height: 300px;

		.mask {
			position: absolute;
			z-index: 1;
			top: 0;
			bottom: 0;
			transition: width 6s ease-in-out 0ms;
			height: 100%;
			width: 186px;
		}

		.mask.left {
			left: -186px;
			background-image: url('@/assets/img/bos/arrow.svg');
			background-size: 100% 100%;
		}

		.mask.right {
			right: -186px;
			background-image: url('@/assets/img/bos/arrow.svg');
			background-size: 100% 100%;
			transform: scale(-1);
		}

		.line {
			position: absolute;
			height: 100%;
			bottom: 0;
			width: 98px;
			display: flex;
			justify-content: center;
			left: 50%;
			transform: translateX(-50%);
			z-index: 9;

			&::before,
			&::after {
				display: block;
				position: absolute;
				content: "";
				width: 98px;
				height: 48px;
				left: 50%;
				z-index: 9;
				transform: translate(-50%, -50%);
			}

			&::before {
				background-image: url('@/assets/img/bos/toparrow.svg');
				background-size: contain;
				transform: translate(-51.6%, -50%) scale(-1);

			}

			&::after {
				bottom: 0;
				background-image: url('@/assets/img/bos/toparrow.svg');
				background-size: contain;
				transform: translate(-48.6%, 50%);
			}
			.line-bar{
				border-left: 1px solid #f3a45d;
				transform: scaleY(0.9);
				opacity: 0.2;
			}
		}

		.box-list {
			display: flex;
			align-items: center;
			height: 300px;

			.box-item-wrap {
				transition: all 0.2s;
				height: 300px;

				&.item1 {
					width: 100%;
				}

				&.item2 {
					width: 50%;
				}

				&.item3 {
					width: 33.33333%;
				}

				&.item4 {
					width: 25%;
				}

				&.item5 {
					width: 20%;

					.boximgs {
						width: 180px;
						height: 180px;
					}
				}
			}

			.box-item {
				height: 300px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #19182f;

				opacity: 0;

				&.show {
					animation-duration: .5s;
					animation-name: bounceInDown;
					animation-timing-function: ease;
					opacity: 1
				}

				&:first-child {
					border-left: none;
				}

				.boximgs {
					transition: all 0.2s;
					position: relative;
					width: 200px;
					height: 200px;

					img {
						position: absolute;
						width: 100%;
					}

					.box_img {
						z-index: 2;
					}
				}
			}
		}

		&.vertical-com {
			.line {
				left: 0;
				top: 50%;
				width: 100%;
				height: 94px;

				transform: translate(0%, -50%);

				&::before,
				&::after {
					display: block;
					position: absolute;
					content: "";
					width: 48px;
					height: 98px;
					top: 50%;
					z-index: 9;
					margin-top: -49px;
				}

				&::before {
					left: -60px;
					background-image: url('@/assets/img/bos/leftarrow.svg');
					background-size: contain;
					transform: translate(0%, 2.5%);
				}

				&::after {
					left: auto;
					right: -60px;
					background-image: url('@/assets/img/bos/leftarrow.svg');
					background-size: contain;
					transform: scale(-1) translate(0%, 2.5%);
				}
				.line-bar{
					height: 0px;
					width: 105%;
					border-top: 1px solid #f3a45d;
					top: 50%;
					position: absolute;
					transform: scaleY(0.9) translate(0 , -50%);
					opacity: 0.2;
				}

			}

		}
	}


	.lottery-group {
		height: 290px;
		position: relative;
	}

	.lottery {
		position: relative;
		height: 103px;
		overflow: hidden;
		width: 100%;

		.container {
			width: 100%;
			overflow: hidden;

			.carousel {
				display: flex;
				left: 0;
				height: 100%;
				width: 100%;

				.item {
					margin-right: 4px;
					border-radius: 8px;
					overflow: hidden;
					width: 163px;
					height: 103px;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					text-align: center;


					.item-img {
						display: flex;
						flex-direction: column;
						width: 163px;
						justify-content: center;
						height: 103px;
						background-size: 100% 100%;
						// mask-image: url('@/assets/img/maskbg.png');
						// mask-position: 50%;
						// mask-size: cover;
						&>div {
							position: relative;
							height: 68px;
							display: flex;
							align-items: center;
							justify-content: center;

							img {
								width: 65%;
							}
						}
					}
				}
			}
		}


	}

	// 水平滚动
	.lottery-group.horizontal {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	// 垂直滚动
	.lottery-group.vertical {
		display: flex;
		flex-direction: row;
		justify-content: space-around;

		.lottery {
			width: 190px;
			height: auto;
			margin-left: 3px;
			margin-right: 3px;

			.container {
				height: 290px;
				.carousel-list-box {
					width: 100%;
				}
			}
		}

		.carousel-list {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.item{
				.item-img{
					transform: scale(0.96);
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

.m-tabs {
	display: none;
}
.box-name{
	position: relative;
	text-align: center;
	color: #ffffff;
	font-weight: bold;
	font-size: 28px;
	margin-bottom: 30px;
	.back-btn{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0;
		font-size: 14px;
		cursor: pointer;
		background-color: #1b1c24;
		border-radius: 8px;
		color: #7e8494;
		display: inline-block;
		font-size: 14px;
		padding: 10px 20px 10px 20px;
		display: inline-flex;
		align-items: center;
		opacity: 0.8;
		span{
			margin-left: 10px;
		}
		&:hover{
			opacity: 1;
		}
	}
}
@media screen and (max-width: 768px) {
	.m-tabs {
		display: flex;
		border-bottom: 1px solid #BF9E4B;
		margin-bottom: 15px;

		.m-tab-item {
			height: 34px;
			line-height: 34px;
			padding: 0 5px;
			position: relative;
			font-size: 14px;
			color: #666666;
			margin-right: 10px;

			&.active {
				color: #BF9E4B;
				font-size: 16px;

				&::before {
					content: "";
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 2px;
					background-color: #BF9E4B;
				}
			}

		}
	}

	.case-box .jlitem {
		width: 33.3333%;
	}

	.box-name{
		font-size: 18px;
	}

	.case-box {
		.lottery {
			height: 53px;

			.container {
				.carousel {
					.item {
						
						width: 64px;
						height: 53px;
						.item-img {
							width: 64px;
						    height: 53px;
							&>div {
								height: 40px;
								margin-bottom: -10px;
							}

							img {
								width: 50%;
							}

							.line1 {
								font-size: 10px;
							}
						}
					}
				}
			}

		}

		.lottery-group {
			height: 160px;
			.line {

				// transform: scale(0.8);
				&::before,
				&::after {
					width: 26px;
					height: 18px;
				}

				&::before {
					top: -10px;
				}

				&::after {
					bottom: -10px;
				}

			}
			&.horizontal{
				height: 160px;
			}
			&.vertical{
				.lottery{
					.container{
						height: 160px;
					}
				}
			}
		}

		.lottery-box{
			height: 160px;
			.mask{
				&.right{
					display: none;
				}
				&.left{
					display: none;
				}
			}
			.box-list{
				height: 160px;
				.box-item-wrap{
					height: 160px;
					.box-item{
						height: 160px;
						.boximgs{
							width: 120px;
							height: 120px;
						}
					}
					&.item2{
						.boximgs{
							width: 110px;
							height: 110px;
						}
					} 
					&.item3{
						.boximgs{
							width: 90px;
							height: 90px;
						}
					} 
					&.item4{
						.boximgs{
							width: 70px;
							height: 70px;
						}
					} 
					&.item5{
						.boximgs{
							width: 60px;
							height: 60px;
						}
					} 
				}
			}
			&.vertical-com{
				.line{
					&::before{
						left: -20px;
					}
					&::after{
						right: -20px;
					}
				}
			}
		}
	}
}


@keyframes bounceInDown {
	0% {
		transform: translateY(-120px)
	}

	40% {
		transform: translateY(25px)
	}

	65% {
		transform: translateY(-10px)
	}

	80% {
		transform: translateY(5px)
	}

	to {
		transform: translateY(0)
	}
}

.user-seed-content {
	word-break: break-all;
	word-wrap: break-word;
}

.openNum {
	// background-image: url('@/assets/img/bos/openNumbg.png');
	width: 290px;
	height: 42px;
	background-size: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 30px;

	.tit {
		width: 90px;
		color: #ffffff;
		text-align: center;
		font-size: 14px;
	}
}

.openNum span {
	display: inline-flex;
	width: 40px;
	height: 40px;
	align-items: center;
	justify-content: center;
	background-color: #1D2A47;
	border-radius: 10px;
	cursor: pointer;
	color: #ffffff;
}

.openNum span.active {
	background-color: #f3a45d;
	border-color: #f3a45d;
	color: #ffffff;
}


// 自定义背景色
.bg_E4AE39 {
	background: radial-gradient(circle at center, #ffd700 0%, rgba(0,0,0,0) 50%);
}

.bg_EB4B4B {
	background: radial-gradient(circle at center, #EB4B4B 0%, rgba(0,0,0,0) 50%);
}

.bg_D32CE6 {
	background: radial-gradient(circle at center, #D32CE6 0%, rgba(0,0,0,0) 50%);

	
}

.bg_8847FF {
	background: radial-gradient(circle at center, #8847FF 0%, rgba(0,0,0,0) 50%);
}

.bg_4B69FF {
	background: radial-gradient(circle at center, #4B69FF 0%, rgba(0,0,0,0) 50%);
}


.bg_5E98D9 {
	background: radial-gradient(circle at center, #5E98D9 0%, rgba(0,0,0,0) 50%);
}

.bg_B0C3D9 {
	background: radial-gradient(circle at center, #B0C3D9 0%, rgba(0,0,0,0) 50%);
}



.q-tabs {
	display: flex;
	height: 40px;
	margin-bottom: 30px;
	border-bottom: 1px solid #99A5B7;

	.tab-item {
		position: relative;
		margin-right: 30px;
		font-size: 18px;
		color: #666;
		cursor: pointer;
		padding-left: 10px;
		padding-right: 10px;

	}

	.tab-item.active {
		color: #ba943b;
		font-weight: bold;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			right: 0;
			bottom: -1px;
			height: 3px;
			background-color: #ba943b;


		}
	}
}

@media screen and (max-width: 600px) {
	.box-list{}

	.openNum {
		width: 220px;
		height: 28px;

		span {
			width: 28px;
			height: 28px;
		}

		.tit {
			width: 70px;
		}
	}

	.q-tabs {
		display: flex;
		height: 30px;
		margin-bottom: 20px;
		border-bottom: 1px solid #99A5B7;

		.tab-item {
			position: relative;
			margin-right: 30px;
			font-size: 16px;
			color: #666;
			cursor: pointer;
			padding-left: 5px;
			padding-right: 5px;

		}

		.tab-item.active {
			color: #ba943b;
			font-weight: bold;

			&::after {
				height: 2px;
			}
		}
	}

	.m-setbar {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.open-btns{
			left: auto;
			transform: translateX(0);
		}
		.right-btn-box{
			margin-left: 0;
			margin-top: 10px;
		}
	}

	.m-setbar>div:first-child {
		margin-bottom: 15px;
	}

	.case-box {
		padding-left: 8px !important;
		padding-right: 8px !important;
	}

	.switch-box {
		// margin-bottom: 15px;
	}

	.bottom-container {
		padding: 20px 10px;
		margin-left: -9px;
		margin-right: -9px;
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

.right-btn-box {
	display: flex;
	align-items: center;
	margin-left: auto;

	.el-switch--small .el-switch__label * {
		font-size: 12px;
		color: #ffffff;
	}
}
</style>


<style lang="scss">
.recordList-dialog {
	background-color: rgba(255, 255, 255, 0.6);
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

	.result-title3 {
		width: 100%;
		position: relative;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		font-size: 20px;
		margin-bottom: 40px;

		.el-icon {
			position: absolute;
			right: 0;
			cursor: pointer;
		}
	}
}

.recordList-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.jl-grid-wrap {
		position: relative;
		height: 500px;
		overflow: auto;
		padding: 0px;
	}

	.jl-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-gap: 10px;

	}
}
</style>


<style lang="scss" scoped>
.open-btns{
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
@media screen and (max-width: 768px) {
	.open-btns{
		position: relative;
		
	}
	.recordList-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.jl-grid-wrap {
			position: relative;
			height: 500px;
			overflow: auto;
			padding: 0px;
		}

		.jl-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 8px;

		}
	}
}

.slide-fade-enter-active {
	transition: all .3s ease;
}

.slide-fade-leave-active {
	transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
	{
	transform: translateX(10px);
	opacity: 0;
}


</style>
