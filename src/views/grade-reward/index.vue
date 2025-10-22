<template>
	<div class="grade-wrap">
		<v-container class="container-box">
			<div class="d-flex a-center m-user-box">
				<div class="mr-4">
					<v-avatar style="border: 1px solid #F4F8FB" @click="goTo" :size="isMobile ? 50 : 70"><img
							style="width: 100%;" class="avatar" :src="processImageUrl(userInfo?.avatar)" alt=""></v-avatar>
				</div>
				<div class="flex-1">
					<!-- {{store.state.user}} -->
					<div><span class="nickname">{{ userInfo?.nickname }}</span><span class="userLevel">
							<img src="@/assets/img/bos/icon_lv.png" />
							<i>LV.</i>{{
								userInfo?.grade
							}}</span></div>
					<div class="mt-3" v-if="levelRewardList.length">
						<el-progress :percentage="`${userInfo?.recharge_total / calcRequiredMoney(levelRewardList) * 100}`">
							{{ userInfo?.recharge_total }} / {{ calcRequiredMoney(levelRewardList) }}
						</el-progress>
					</div>
				</div>
			</div>

			<div style="border-radius: 10px;" class="level-openbox-container a-center mt-10">
				<div class="fs14 tc mb-4 text-white">充值金额升级获取奖励，赠送宝箱在我的盲盒里。</div>
				<div :class="isMobile ? 'm-level-openbox' : 'level-openbox'">
					<div class="box-item" :class="{ 'active': userInfo.grade >= level.end_level }"
						v-for="(level, idx) in levelRewardList" :key="idx">
						<div class="boximg">
							<img style="display: block;width: 100%;height: 100%;" src="@/assets/img/bos/boxbg.png" alt="">
							<img v-if="level?.extend?.boxInfo" class="coverImg"
								:src="processImageUrl(level?.extend?.boxInfo.cover)" alt="">
							<img v-else class="coverImg" :src="processImageUrl(level?.extend?.image_url)" alt="">
							<img v-if="level?.extend?.boxInfo" class="boxCoverImg"
								:src="processImageUrl(level?.extend?.boxInfo.img)" alt="">
							<section class="icon_key" v-if="level?.reward_type === 'key'">
								<img :src="processImageUrl(level?.extend?.image_url)" alt="key">
								<span class="key_num">{{ level?.keyNum }}</span>
							</section>
							<p v-if="level?.extend?.boxInfo" class="line1 fs12">{{ level?.extend?.type_name }}</p>
							<p v-else class="line1 fs12 subtitle">{{ level?.extend?.item_name }}</p>
							<div class="tips" v-if="level.reward_type === 'skin'">
								<v-btn height="24" color="#f3a45d" class="btn" elevation="0">{{ verifyIsLock(userInfo.grade,
									level.end_level) ? '已领取到背包' : '未解锁' }}</v-btn>
							</div>
							<div class="tips" v-else>
								<v-btn width="72" height="24" color="#f3a45d" class="btn" elevation="0"
									@click="openBox(verifyIsLock(userInfo.grade, level.end_level), level?.extend?.boxInfo?.id, level?.extend?.image_url)">{{
										verifyIsLock(userInfo.grade, level.end_level) ? '开箱' : '未解锁' }}</v-btn>
							</div>
						</div>
						<div class="sline"></div>
						<div class="level-dot">
							<div class="level-num">{{ level.end_level }}</div>
						</div>
					</div>
				</div>
			</div>

		</v-container>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
	defineComponent,
	onMounted,
	reactive,
	toRefs
} from "vue";
import { useRouter } from "vue-router";
import {
	PromoteService
} from "@/services/PromoteService";

import { UserService } from "@/services/UserService";
import BoxService from "@/services/BoxService";
import {
	useStore
} from "@/store";
import {
	processImageUrl
} from "@/utils"
import {
	toast
} from "@/composables/util"
import QTitle from '@/components/QTitle.vue'

import useClipboard from 'vue-clipboard3';
const isMobile = computed(() => window.innerWidth < 600)
const router = useRouter()
const {
	toClipboard
} = useClipboard();


const copyText = async (text: string) => {
	try {
		await toClipboard(text)
		//复制成功提示
		toast('复制成功');
	} catch (e) {
		//复制失败回调
		console.error(e)
	}
}

// const calcRequiredMoney = (list:[]) => {
// 	const { grade } = state?.userInfo
// 	let requiredMoney = 0
// 	list.some((l:any, idx:number) => {
// 		const { start_level, end_level, amount } = l
// 		if (grade >= start_level && grade < end_level) {
// 			requiredMoney = amount
// 			return true
// 		}
// 	})
// 	return requiredMoney
// }

const calcRequiredMoney = (list: []) => { // 当前充值总金额 / 升级下一阶段所需充值金额
	const { grade, recharge_total } = state?.userInfo
	let curExperience = 0
	let preTotalAmount = 0
	// let grade = 40
	list.some((l: any, idx: number) => {
		const { start_level, end_level, amount } = l
		const preAmount = grade < 10 ? 0 : amount
		if (grade >= start_level && grade < end_level) {
			curExperience = (grade - start_level + 1) * amount + preTotalAmount
			return true
		} else {
			preTotalAmount += (preAmount ? preAmount * 10 : 0)
		}
	})
	return curExperience
}


const shortcuts = [{
	text: "最近一周",
	value: (() => {
		const end = new Date();
		const start = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		return [start, end];
	})(),
},
{
	text: "最近一个月",
	value: (() => {
		const end = new Date();
		const start = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		return [start, end];
	})(),
},
{
	text: "最近三个月",
	value: (() => {
		const end = new Date();
		const start = new Date();
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		return [start, end];
	})(),
},
];

const store = useStore();

const state = reactive({
	shortcuts,
	value: "",
	stat: computed(() => store.getters.promoteStat),
	record: computed(() => store.getters.promoteRecord),
	levelSetting: computed(() => store.getters.levelSetting),
	inventInfo: computed(() => store.getters.inviterInfo),
	inviteCode: computed(() => store.state.user?.invite_code),
	userInfo: computed(() => store.getters.userInfo),
	levelRewardList: []
});

const openBox = (verifyIsLock, id, keyUrl) => {
	if (verifyIsLock) {
		router.push(`/openbox/${id}?type=grade_reward&key=${keyUrl}`)
	}
}

const verifyIsLock = (curLevel, end_level) => {
	return curLevel >= end_level
}

const {
	inviteCode,
	levelSetting,
	record,
	userInfo,
	levelRewardList
} = toRefs(state)

onMounted(() => {
	UserService.getUserLevel().then(res => {
		const data = res?.data?.data
		const requestQueue = []
		data?.list?.forEach((f) => {
			if (f.reward_type === 'key') {
				const extend = JSON.parse(f?.extend)
				const apiPromise = new Promise((resolve, reject) => {
					return BoxService.getKeyNumByBoxId({
						box_id: `${extend?.boxInfo?.id}`
					}).then(resolve).catch(reject)
				})
				requestQueue.push(apiPromise)
			}
		})
		Promise.all(requestQueue).then((values) => {
			values = values.map(v => {
				return v?.data?.data?.count
			})
			state.levelRewardList = data?.list.map(m => {
				let result = {
					...m,
					extend: JSON.parse(m.extend)
				}
				if (m.reward_type === 'key') {
					result.keyNum = values.shift()
				}
				return result
			})
		})
	})
});

const stat = async () => {
	store.dispatch('getPromoteStat');
};
</script>

<style lang="scss" scoped>
.grade-wrap {

	
	background-size: 100%;
	background-position: center bottom;
	background-repeat: no-repeat;

	.container-box {
		min-height: 600px;
		padding-top: 0;
		box-shadow: 0px 1px 20px 1px rgba(0, 0, 0, 0.08);
		padding: 30px;

	}
}

.toph {
	height: 150px;
}


.nickname {
	font-size: 18px;
	color: #ffffff;
	font-weight: 600;
	margin-right: 10px;
}

.userLevel {
	color: #FFAA00;
	font-size: 12px;
	font-weight: 500;
	height: 19px;
	background: rgba(255, 179, 0, 0.1);
	text-align: center;
	border-radius: 10px 10px 10px 10px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0px 4px;

	img {
		width: 13px;
	}

	i {
		font-style: inherit;
	}
}

.subtitle {
	padding: 0 5px;
}

@media screen and (max-width: 600px) {

	.grade-wrap {
		padding: 15px;
		border: none;

		.container-box {
			// margin-top: -55px;
			// margin-left: 15px;
			// margin-right: 15px;
			box-shadow: none;
			padding: 0;

			.m-user-box {
				border-radius: 2px !important;
				padding: 10px;
			}
		}
	}

	.level-openbox-container.mt-10 {
		margin-top: 20px !important;

		.fs14 {
			font-size: 12px !important;
		}
	}

	.mhide {
		display: none !important;
	}

	.level_img {
		width: 50px;
	}


	.toph {
		height: 60px;
	}
}



::-webkit-scrollbar {
	height: 4px;
	// background: rgba(44,44,46,.5);
	background: #99a5b7;
}

::-webkit-scrollbar-thumb {
	background: #f5f5f5;
}

.level-openbox {
	position: relative;
	display: flex;
	// justify-content: center;
	height: 380px;
	// padding: 0 30px;
	overflow-x: auto;
	overflow-y: hidden;

	.box-item {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 180px;
		margin-right: -72px;
		// border-bottom: 1px dashed #99A5B7;

		.sline {
			content: "";
			height: 100%;
			border-left: 1px dashed #99A5B7;
			position: absolute;
			left: 50%;
			z-index: 0;
		}

		.boximg {
			position: relative;
			z-index: 9;
			width: 175px;
			height: 133px;
			background-color: #99A5B7;
			flex-shrink: 0;

			.btn {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			p {
				position: absolute;
				bottom: 10px;
				text-align: center;
				width: 100%;
				color: #ffffff;
			}

			&:hover {
				.tips {
					display: flex;
				}
			}
		}

		.coverImg {
			position: absolute;
			left: 50%;
			top: 50%;
			width: auto;
			height: 65%;
			transform: translate(-50%, -50%);
		}

		.boxCoverImg {
			position: absolute;
			left: 50%;
			top: 50%;
			width: auto;
			height: 65%;
			transform: translate(-50%, -50%);
		}

		.tips {
			display: none;
			position: absolute;
			justify-content: center;
			align-items: center;
			z-index: 2;
			background-color: rgba(0, 0, 0, .5);
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.level-dot {
			position: relative;
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: center;
			transform: translateY(50%);

			.level-num {
				width: 32px;
				height: 32px;
				line-height: 32px;
				border-radius: 50%;
				text-align: center;
				font-size: 16px;
				color: #282828;
				border: 1px solid #C0C0C0;
				background-color: #ffffff;
			}

			&::before {
				content: "";
				position: absolute;
				top: 50%;
				left: 1px;
				right: 50%;
				border-bottom: 2px solid #eeeeee;
				z-index: -1;
			}

			&::before {
				left: 0;
			}

			&::after {
				right: 0;
			}
		}
	}

	.box-item:nth-child(2n) {
		flex-direction: column-reverse;
		transform: translateY(100%);
		// border-top: 1px dashed #99A5B7;
		border-bottom: 0;
		height: 179px;

		.level-dot {
			transform: translateY(-50%);
		}
	}

	.box-item:first-child {
		.level-dot::before {
			left: -18px;
		}


	}

	.box-item:last-child {
		.level-dot::before {
			right: -18px;
		}
	}

	.box-item.active {
		.level-num {
			background-color: #f3a55e;
			border-color: #f3a55e;
			color: #ffffff;
		}
	}

	.mline {
		opacity: 0;
		position: absolute;
		z-index: 1;
		left: 20px;
		right: 0;
		top: 50%;
		height: 0px;
		transform: translateY(-50%);
		border-bottom: 1px dashed #99A5B7;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			width: 10px;
			height: 10px;
			background-color: #99A5B7;
			border-bottom: 1px dashed #99A5B7;
			border-radius: 50%;
			transform: translate(-100%, -50%);
		}

		&::before {
			content: "";
			position: absolute;
			right: 0;
			width: 10px;
			height: 10px;
			background-color: #99A5B7;
			border-bottom: 1px dashed #99A5B7;
			border-radius: 50%;
			transform: translate(100%, -50%);
		}
	}

	.icon_key {
		position: absolute;
		display: flex;
		align-items: center;
		right: 10px;
		top: 10px;
		color: #99A5B7;
		font-size: 12px;

		img {
			display: inline-block;
			width: 16px;
			height: 16px;
			// background-image: url('@/assets/img/icon_key.png');
			margin-right: 4px;
		}
	}
}


.m-level-openbox {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding-bottom: 100px;

	.box-item {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 150px;
		height: 115px;
		margin-bottom: 10px;

		.boximg {
			position: relative;
			z-index: 9;
			width: 150px;
			height: 115px;
			background-color: #99A5B7;
			flex-shrink: 0;

			.btn {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			p {
				position: absolute;
				bottom: 10px;
				text-align: center;
				width: 100%;
				color: #ffffff;
			}

			&:hover {
				.tips {
					display: flex;
				}
			}
		}

		.coverImg {
			position: absolute;
			left: 50%;
			top: 50%;
			width: auto;
			height: 65%;
			transform: translate(-50%, -50%);
		}

		.boxCoverImg {
			position: absolute;
			left: 50%;
			top: 50%;
			width: auto;
			height: 65%;
			transform: translate(-50%, -50%);
		}

		.tips {
			display: none;
			position: absolute;
			justify-content: center;
			align-items: center;
			z-index: 2;
			background-color: rgba(0, 0, 0, .5);
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}


	}

	

	.level-num {
		position: absolute;
		right: 0;
		top: 50%;
		border: 1px solid #C0C0C0;
		background-color: #ffffff;
		color: #282828;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		text-align: center;
		line-height: 24px;
		z-index: 99;
		transform: translate(150%, -50%);
		&::before{
			content: "";
			position: absolute;
			border-bottom: 1px dashed #ccc;
			top: 50%;
			width: 10px;
			right: 100%;
		}
	}

	.box-item:nth-child(2n) {
		position: relative;
		transform: translateY(50%);
		.level-num{
			right: 100%;
			transform: translate(-10px, -50%);
			&::before{
				left: 100%;
			}
		}
		
	}

	.box-item.active .level-num{
		background-color: #f3a55e;
		border-color: #f3a55e;
		color: #ffffff;
	}

	.icon_key {
		position: absolute;
		display: flex;
		align-items: center;
		right: 10px;
		top: 10px;
		color: #99A5B7;
		font-size: 12px;

		img {
			display: inline-block;
			width: 16px;
			height: 16px;
			margin-right: 4px;
		}
	}
}
</style>
