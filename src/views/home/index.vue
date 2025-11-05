<template>
	<div class="bigbg">
		<!-- 欢迎横幅区域 -->
		<section class="welcome-section">
			<v-container>
				<div class="welcome-content">
					<h1 class="welcome-title">Welcome to ooskins</h1>
					<p class="welcome-subtitle">Ready to be part of the best unboxing site? Dive in and start unboxing today!</p>
					<div class="welcome-buttons" v-if="!store.getters.userInfo">
						<v-btn class="login-btn" color="#f3a45d" @click="openLogin">登录</v-btn>
						<v-btn class="register-btn" color="#f3a45d" variant="outlined" @click="openRegister">注册</v-btn>
					</div>
				</div>
			</v-container>
		</section>

		<!-- 游戏展示区域 -->
		<section class="games-section">
			<v-container>
				<q-title title="Games" class="bg1"></q-title>
				<v-row class="mt-8 games-grid">
					<v-col v-for="game in gamesList" :key="game.path" cols="6" lg="3" md="4" sm="6">
						<div class="game-card" @click="navigateToGame(game.path)">
							<div class="game-icon">
								<img v-if="game.icon" :src="game.icon" :alt="game.name" />
								<div v-else class="game-icon-placeholder">{{ game.name.charAt(0) }}</div>
							</div>
							<div class="game-name">{{ game.name }}</div>
							<div class="game-badge" v-if="game.badge">{{ game.badge }}</div>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</section>

		<!-- 游戏高光展示 -->
		<section class="highlights-section">
			<v-container>
				<div class="highlights-tabs">
					<v-btn-toggle v-model="highlightTab" mandatory color="primary" class="highlights-toggle">
						<v-btn value="all">All Bets</v-btn>
						<v-btn value="big">Big Wins</v-btn>
						<v-btn value="lucky">Lucky Wins</v-btn>
					</v-btn-toggle>
				</div>
				<div class="highlights-content">
					<div class="highlights-placeholder">
						<p>Recent game highlights will appear here</p>
					</div>
				</div>
			</v-container>
		</section>

		<!-- 支付方式展示 -->
		<section class="payment-section">
			<v-container>
				<q-title title="Select your preferred payment method" class="bg2"></q-title>
				<div class="payment-methods mt-8">
					<div class="payment-category">
						<h3 class="payment-category-title">Crypto Deposits</h3>
						<p class="payment-category-desc">No fiat? No problem. We are offering more than 10+ crypto currencies as our deposit method.</p>
					</div>
					<div class="payment-icons">
						<div class="payment-icon" v-for="method in paymentMethods" :key="method.name">
							<img v-if="method.icon" :src="method.icon" :alt="method.name" />
							<span v-else>{{ method.name }}</span>
						</div>
					</div>
				</div>
			</v-container>
		</section>

		<div class="notice-bar-wrap v-container" v-if="notice.length">
			<div v-if="!isMobile" class="notice-bar">
				<img class="icon_laba" src="@/assets/img/bos/laba.png">

				<el-carousel  direction="vertical" arrow="never" style="flex: 1;" height="44px" indicator-position="none">
					<el-carousel-item v-for="(item,index) in notice" :key="index">
						<div class="line1 cursor">
							<span>{{ item }}</span>
						</div>
					</el-carousel-item>
					
				</el-carousel>

			</div>
			<div class="notice-bar" v-else>
				<img class="icon_laba" src="@/assets/img/bos/laba.png">
				<marquee>
					<span v-for="(item,index) in notice" :key="index" style="cursor: pointer;" class="ml-3">{{ item }}</span>
				</marquee>
			</div>
		</div>
		<section v-if="rechargeWelfareboxList.length" class="section section_top" data-myName="section_top">
			<v-container>
				<div>
					<q-title title="每日充值福利箱" class="bg1"></q-title>
					<v-row class="mt-8 q-row--dense">
						<v-col v-for="(item, i) in rechargeWelfareboxList" :key="item.id" cols="6" lg="3" md="3">
							<box-item :item="item" type="welfare"></box-item>
						</v-col>
					</v-row>
				</div>
			</v-container>
		</section>

		<section v-if="keyBoxList.length" class="section section_top" data-myName="section_top">
			<v-container>
				<div>
					<q-title title="钥匙箱子" class="bg1"></q-title>
					<v-row class="mt-8 q-row--dense">
						<v-col v-for="(item, i) in keyBoxList" :key="item.id" cols="6" lg="3" md="3">
							<box-item :item="item" type="key"></box-item>
						</v-col>
					</v-row>
				</div>
			</v-container>
		</section>
		<section :ref="setRefAction" class="section" :class="`section_0${index + 1}`" :data-myName="`section_0${index + 1}`"
			v-for="(type, index) in types" :key="index">
			<v-container>
				<div :id="'tab' + index">
					<q-title :title="type?.name" :class="index % 2 == 0 ? 'bg2' : 'bg1'"></q-title>
					<v-row class="mt-8 q-row--dense" v-if="boxListData">
						<v-col v-for="(item, i) in boxListData[type?.id]" :key="item.id" cols="6" lg="3" md="3">
							<box-item :item="item"></box-item>
						</v-col>
					</v-row>
				</div>
			</v-container>
		</section>
	</div>

	<Login ref="loginRef" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs, computed, nextTick } from "vue";
import PublicService from "@/services/PublicService";
import QTitle from '@/components/QTitle.vue'
import BoxItem from '@/components/BoxItem.vue'
import BoxService from "@/services/BoxService";
import WelfareBoxService from "@/services/WelfareBoxService";
import { useStore } from "@/store";
import { openLink } from "@/utils";
import { processImageUrl } from '@/utils';
import { useRouter } from "vue-router";
import Login from "@/components/Login.vue";
import _ from "lodash";
const store = useStore()
const router = useRouter()
store.dispatch("getRechargeWelfareBoxTypeId")

const loginRef = ref(null);
const openLogin = () => {
	if (loginRef.value) {
		loginRef.value.open('login');
	}
};
const openRegister = () => {
	if (loginRef.value) {
		loginRef.value.open('register');
	}
};

// 游戏列表
const gamesList = ref([
	{ name: '追梦升级', path: '/upgrade', icon: null, badge: null },
	{ name: 'ROLL房', path: '/roll', icon: null, badge: null },
	{ name: '热血对战', path: '/battle', icon: null, badge: null },
	{ name: '扫雷战场', path: '/mine-sweeping', icon: null, badge: null },
]);

const navigateToGame = (path: string) => {
	router.push(path);
};

// 高光标签
const highlightTab = ref('all');

// 支付方式
const paymentMethods = ref([
	{ name: 'Mastercard', icon: null },
	{ name: 'BTC', icon: null },
	{ name: 'ETH', icon: null },
	{ name: 'SOL', icon: null },
	{ name: 'USDT', icon: null },
]);

const state = reactive({
	notice: [],
	boxListData: {},
	keyBoxList: [],
	recharge_welfare_box_type_id: computed(() => store.getters.rechargeWelfareBoxTypeId),
	rechargeWelfareboxList: [],
	types: [],
	refList: [] as Array<any>
});
const { boxListData, rechargeWelfareboxList, types, keyBoxList, notice } = toRefs(state);
const tabs = ref([
	// '最新盲盒',
	// '尝鲜推荐',
	// '节日限定',
	// '高爆率盲盒',
	// '武器盲盒',
	// '家族盲盒',
	// '特殊盲盒',
	// '虎年特供',
	// '一周年限定',
])
const userInfo = computed(() => {
	return store.getters.userInfo;
})
const handleAddGroup = () => {
	openLink("https://qm.qq.com/cgi-bin/qm/qr?k=Ys_DQVDu6zNYVF_P2JOvSiAx7EEl2tPD&jump_from=webapi");
};
const setRefAction = (el: any) => {
	state.refList.push(el);
}


const tabActiveId = ref(0);
const jumpFlag = ref(false);
const toJump = (id, index) => {
	nextTick(() => {
		tabActiveId.value = id;
		jumpFlag.value = true;
		state.refList[index].scrollIntoView(true);
	})
}
const offettopList = ref([]);
const initDom = () => {

	nextTick(() => {
		const el = document.body; // 父元素，其内部元素滚动		
		const h = el.querySelectorAll('.section');
		for (const k of h) {
			// 将所有内容的标题以及距离顶部的距离存成一个数组
			offettopList.value.push({ offsetTop: k.offsetTop, name: k.getAttribute('data-myName') });
		}
		el.addEventListener('scroll', handleScroll);
	})
}

const isMobile = computed(() => window.innerWidth < 600)
const handleScroll = () => {
	// 点击跳转的时候 滚动事件也会执行（所以点击的时候return）
	// if (jumpFlag.value) {
	// 	jumpFlag.value = false;
	// 	return;
	// }
	const el = document.body; // 父元素，其内部元素滚动
	console.log('aaa', el)
	if (!el) return;
	offsetTopList.value.forEach((t, i) => {
		// +50 是为了让他提前50px的时候导航栏高亮
		if (el.scrollTop + 50 >= t.offsetTop) {
			console.log(t.name)
			// tabActiveId.value = t.name;
		}
	});
}

const getKeyBoxList = async () => {

	const res = await BoxService.list({ type_id: 39, box_type: 4, page: 1, page_size: 24 });
	state.keyBoxList = res.data.data.list;


	state.keyBoxList?.forEach(async (f, i) => {
		const bres = await BoxService.boxKeyInfo({ id: f?.key_id});
		
		const keyInfo = bres.data.data.box_key;
		state.keyBoxList[i].key_icon = processImageUrl(keyInfo.icon);


        if(userInfo.value) {
			const cres = await BoxService.getKeyNumByBoxId({box_id: f?.id});
		    state.keyBoxList[i].key_count = cres.data.data.count;
		}
		
	})

}

const getNotice = async () =>{
	PublicService.getNotice().then(res => {
        let str = res.data.data.content;
        if (!str) return;
        let isWrap = /\n/.test(str);
        if (!isWrap) {
            state.notice = [str]
        } else {
            state.notice = str.split('\n');
        }

    })
}

const getBoxList = async () => {
	let types = await getBoxAllType()
	types = _.sortBy(types, o => o.sort).filter(type => type.id !== state.recharge_welfare_box_type_id)
	tabActiveId.value = types[0].id;
	tabs.value = types;
	state.types = types
	for (let i = 0; i < types.length; i++) {
		const item = types[i]
		if (item.id == state.recharge_welfare_box_type_id) {
			continue
		}
		const res = await BoxService.list({ type_id: item.id, page: 1, page_size: 24 })
		state.boxListData[item.id] = res.data.data.list
		// console.log(res.data.data.list)
	}
}

const getBoxAllType = async () => {
	const res = await BoxService.allType({ type: 0 });
	return res.data.data;
};
async function getRechargeWelfareBoxList() {
	const resp = await WelfareBoxService.rechargeWelfareBoxList({
		disabled: 0,
		sorts: "+amount"
	})
	const { data: { list } } = resp.data
	state.rechargeWelfareboxList = list
}

onMounted(async () => {
	await getNotice();
	await getKeyBoxList();
	await getRechargeWelfareBoxList()
	await getBoxList()

	
	

	// initDom();
})

function scrollTopAnimate(id) {
	console.log(id)
	nextTick(() => {
		window.scrollTo({ top: document.getElementById(id).offsetTop + 30, behavior: 'smooth' })
	})
}


</script>

<style scoped lang="scss">
.bigbg {
	// width: 100%;
	overflow: hidden;
	background-color: #17171f;
}

.section {
	padding-top: 60px;
	padding-bottom: 80px;
	background-size: 100% 100%;
}

// 欢迎区域
.welcome-section {
	padding: 100px 0 80px;
	background: linear-gradient(135deg, rgba(243, 164, 93, 0.15) 0%, rgba(23, 23, 31, 0.95) 50%, rgba(27, 26, 35, 0.9) 100%);
	text-align: center;
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(circle at 50% 0%, rgba(243, 164, 93, 0.1) 0%, transparent 70%);
		pointer-events: none;
	}
}

.welcome-content {
	max-width: 800px;
	margin: 0 auto;
	position: relative;
	z-index: 1;
}

.welcome-title {
	font-size: 48px;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 20px;
	background: linear-gradient(135deg, #f3a45d 0%, #ffcd7f 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.welcome-subtitle {
	font-size: 18px;
	color: #99a5b7;
	margin-bottom: 40px;
	line-height: 1.6;
}

.welcome-buttons {
	display: flex;
	gap: 20px;
	justify-content: center;
}

.login-btn, .register-btn {
	min-width: 120px;
	height: 44px;
	border-radius: 22px;
	font-weight: 600;
	text-transform: none;
}

.register-btn {
	border: 2px solid #f3a45d;
	color: #f3a45d;
}

// 游戏展示区域
.games-section {
	padding: 80px 0;
	background: rgba(23, 23, 31, 0.5);
}

.games-grid {
	margin-top: 40px;
}

.game-card {
	background: linear-gradient(135deg, rgba(26, 26, 32, 0.9) 0%, rgba(29, 29, 37, 0.9) 100%);
	border-radius: 16px;
	padding: 30px 20px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	border: 1px solid rgba(243, 164, 93, 0.2);
	overflow: hidden;
	height: 100%;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(243, 164, 93, 0.05) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	&:hover {
		transform: translateY(-8px);
		border-color: #f3a45d;
		box-shadow: 0 15px 40px rgba(243, 164, 93, 0.4);

		&::before {
			opacity: 1;
		}

		.game-icon {
			transform: scale(1.15) rotate(5deg);
		}
	}
}

.game-icon {
	width: 80px;
	height: 80px;
	margin: 0 auto 20px;
	border-radius: 12px;
	background: linear-gradient(135deg, #f3a45d 0%, #ffcd7f 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s ease;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
	}
}

.game-icon-placeholder {
	font-size: 36px;
	font-weight: 700;
	color: #503d2e;
}

.game-name {
	font-size: 18px;
	font-weight: 600;
	color: #ffffff;
}

.game-badge {
	position: absolute;
	top: 10px;
	right: 10px;
	background: #f3a45d;
	color: #503d2e;
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 600;
}

// 高光展示区域
.highlights-section {
	padding: 80px 0;
	background: linear-gradient(180deg, rgba(23, 23, 31, 0.8) 0%, rgba(26, 26, 32, 0.6) 100%);
}

.highlights-tabs {
	display: flex;
	justify-content: center;
	margin-bottom: 40px;
}

.highlights-toggle {
	background: rgba(26, 26, 32, 0.8);
	border-radius: 12px;
	padding: 4px;

	:deep(.v-btn) {
		border-radius: 8px;
		color: #99a5b7;
		text-transform: none;
		font-weight: 500;

		&.v-btn--active {
			background: #f3a45d;
			color: #503d2e;
		}
	}
}

.highlights-content {
	min-height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.highlights-placeholder {
	color: #99a5b7;
	font-size: 16px;
	text-align: center;
	padding: 40px;
}

// 支付方式区域
.payment-section {
	padding: 80px 0;
	background: rgba(23, 23, 31, 0.3);
}

.payment-methods {
	background: linear-gradient(135deg, rgba(26, 26, 32, 0.8) 0%, rgba(29, 29, 37, 0.8) 100%);
	border-radius: 16px;
	padding: 40px;
}

.payment-category {
	text-align: center;
	margin-bottom: 30px;
}

.payment-category-title {
	font-size: 24px;
	font-weight: 600;
	color: #ffffff;
	margin-bottom: 10px;
}

.payment-category-desc {
	font-size: 14px;
	color: #99a5b7;
	line-height: 1.6;
}

.payment-icons {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	justify-content: center;
}

.payment-icon {
	width: 80px;
	height: 80px;
	border-radius: 12px;
	background: rgba(243, 164, 93, 0.1);
	border: 1px solid rgba(243, 164, 93, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	cursor: pointer;

	&:hover {
		background: rgba(243, 164, 93, 0.2);
		border-color: #f3a45d;
		transform: translateY(-3px);
	}

	img {
		width: 60px;
		height: 60px;
		object-fit: contain;
	}

	span {
		color: #f3a45d;
		font-size: 14px;
		font-weight: 600;
	}
}

.section_top {
	// background-image: url('@/assets/img/bos/bg7.png');
}

.section_01 {
	// background-image: url('@/assets/img/bos/bg5.png');
}

.section_02 {
	// background-image: url('@/assets/img/bos/bg6.png');
}

.section_03 {
	// background-image: url('@/assets/img/bos/bg2.png');
}

.section_04 {
	// background-image: url('@/assets/img/bos/bg4.png');
}

.section_05 {
	// background-image: url('@/assets/img/bos/bg1.png');
}

.section_06 {
	// background-image: url('@/assets/img/bos/bg3.png');
}

.notice-bar {
	height: 44px;
	background: #FCD5D5;
	border-radius: 2px 2px 2px 2px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	font-size: 14px;
	font-weight: 500;
	color: #ffffff;
	margin-bottom: 30px;
	margin-top: 20px;
	line-height: 44px;
	overflow: hidden;
	background: linear-gradient(90deg, rgba(230, 157, 93, 0) 0%, rgba(230, 157, 93, .4) 18%, rgba(230, 157, 93, .67) 49%, rgba(230, 157, 93, .4) 85%, rgba(230, 157, 93, 0) 100%);
	.line1 {
		line-height: 44px;
	}

	.icon_laba {
		margin-right: 10px;
		width: 25px;
	}
}

.left-menu {
	position: fixed;
	left: 0;
	top: 300px;
	z-index: 999;

	&>div {
		width: 150px;
		height: 37px;
		line-height: 37px;
		background-image: url('@/assets/img/bos/bt_h.png');
		margin-bottom: 8px;
		background-size: 100% 100%;
		font-size: 14px;
		color: #ffffff;
		padding-left: 20px;
		cursor: pointer;

		&.active {
			background-image: url('@/assets/img/bos/bt.png');
			width: 170px;
		}
	}
}

.qtabs {
	position: relative;

	&::after {
		position: absolute;
		content: "";
		border-bottom: 1px solid #eee;
		left: 0;
		right: 0;
		bottom: 0px;
		z-index: 0;
	}
}

.card-box {
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;
}

.card-item {
	flex-shrink: 0;
	width: 176px;
	height: 147px;
	background-color: #ccc;
	border: 1px solid #fff;
}

@media (min-width: 1280px) {
	.v-col-lg-3 {
		flex: 0 0 20%;
		max-width: 20%;
	}
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.welcome-section {
		padding: 40px 0;
	}

	.welcome-title {
		font-size: 32px;
	}

	.welcome-subtitle {
		font-size: 14px;
		margin-bottom: 30px;
	}

	.welcome-buttons {
		flex-direction: column;
		align-items: center;
		gap: 15px;
	}

	.login-btn, .register-btn {
		width: 200px;
	}

	.game-card {
		padding: 20px 15px;
	}

	.game-icon {
		width: 60px;
		height: 60px;
		margin-bottom: 15px;
	}

	.game-name {
		font-size: 16px;
	}

	.payment-methods {
		padding: 20px;
	}

	.payment-icon {
		width: 60px;
		height: 60px;

		img {
			width: 40px;
			height: 40px;
		}
	}

	.section {
		padding-top: 20px;
		padding-bottom: 20px;
		background-size: 100% 100%;

		.v-row.mt-1 {
			margin-top: 0 !important;
		}
		.v-container{
			padding-left: 0px;
			padding-right: 0px;
		}
		.mt-8{
			margin-top: 10px !important;
		}
	}

	.left-menu {
		display: none;
	}

	.notice-bar {
		height: 32px;
		padding: 0 10px;
		margin: 0 15px;
		font-size: 14px;
		line-height: 32px;

		.line1 {
			span {
				font-size: 12px;
			}
		}
	}

	.section_top {
		padding-top: 0;
	}

	.notice-bar-wrap {
		// background-color: #F4F8FB;
		padding-top: 15px;
		padding-bottom: 20px;
	}

	.notice-bar {
		font-size: 12px;

		.icon_laba {
			width: 14px;
		}
	}
}
</style>



