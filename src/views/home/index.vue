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
import Login from "@/components/Login.vue";
import _ from "lodash";
const store = useStore()
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

const state = reactive({
	boxListData: {},
	keyBoxList: [],
	recharge_welfare_box_type_id: computed(() => store.getters.rechargeWelfareBoxTypeId),
	rechargeWelfareboxList: [],
	types: [],
	refList: [] as Array<any>
});
const { boxListData, rechargeWelfareboxList, types, keyBoxList } = toRefs(state);
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

	.section_top {
		padding-top: 0;
	}
}
</style>



