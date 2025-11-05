<template>
	<!-- :class="{'fixed-appbar': $route.path !== '/'}" -->
	<div class="myappbar" :class="currentName == 'Home' ? 'homebg' : 'combg'">

		<div class="d-flex align-center pc-header justify-space-between" style="position: relative;">
			<!-- style="position: absolute; left: -160px;" -->
			<section class="d-flex">
				<div @click="goIndex" class="d-flex align-center mr-9 ml-5">
					<!-- <img class="cursor logoo" src="@/assets/img/bos/o.png" alt=""> -->
					<img class="logoimg cursor" :src="logo" alt="">
				</div>
				<div class="toptabs">
					<div 
						v-for="link in links" 
						:key="link.name"
						class="nav-item-wrapper"
						:class="{ 'has-dropdown': link.hasDropdown }"
						@mouseenter="link.hasDropdown ? showDropdown(link.module) : null"
						@mouseleave="link.hasDropdown ? hideDropdown() : null"
					>
						<div 
							class="nav-item" 
							:class="{ 
								active: currentModule === link.module || 
									(link.hasDropdown && activeDropdown === link.module) ||
									(link.hasDropdown && isGameChildActive(link)),
								'has-chevron': link.hasDropdown
							}"
							@click="!link.hasDropdown && navigateTo(link.path, link.module)"
						>
							<svg v-if="link.name === 'Games'" class="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M2 4h3v2H2V4zm9 0h3v2h-3V4zM2 10h3v2H2v-2zm9 0h3v2h-3v-2zM6 6h4v4H6V6z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
							</svg>
							<svg v-else-if="link.icon === 'gift'" class="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M8 0L6 2H2v2h2v8h8V4h2V2h-4L8 0zm0 4h2v2H8V4zm-4 2h8v6H4V6z" fill="currentColor"/>
							</svg>
							<svg v-else-if="link.icon === 'trophy'" class="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M8 0l2 4h4v2a2 2 0 01-2 2h-2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8H2a2 2 0 01-2-2V4h4l2-4z" fill="currentColor"/>
							</svg>
							<span>{{ link.name }}</span>
							<svg v-if="link.hasDropdown" class="chevron-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
							</svg>
						</div>
						<!-- 下拉菜单 -->
						<div 
							v-if="link.hasDropdown && link.children && activeDropdown === link.module" 
							class="dropdown-menu-nav"
						>
							<div 
								v-for="child in link.children" 
								:key="child.path"
								class="dropdown-item"
								:class="{ active: currentModule === child.module }"
								@click="navigateTo(child.path, child.module)"
							>
								<div class="dropdown-item-icon">
									<svg v-if="child.icon === 'star'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
										<path d="M10 0l2.5 6.5L20 7.5l-5 4.5 1.5 7L10 15l-6.5 4.5L5 12l-5-4.5L7.5 6.5 10 0z"/>
									</svg>
									<svg v-else-if="child.icon === 'sword'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
										<path d="M2 2l2 2v12l-2 2h2l2-2V4l-2-2H2zm16 0l-2 2v12l2 2h-2l-2-2V4l2-2h2z"/>
									</svg>
									<svg v-else-if="child.icon === 'box'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
										<path d="M2 2h16v16H2V2zm2 2v12h12V4H4z"/>
									</svg>
									<svg v-else-if="child.icon === 'grid'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
										<path d="M2 2h6v6H2V2zm0 8h6v6H2v-6zm8-8h6v6h-6V2zm0 8h6v6h-6v-6z"/>
									</svg>
								</div>
								<span class="dropdown-item-text">{{ child.name }}</span>
								<span v-if="child.badge === 'HOT'" class="dropdown-badge badge-hot">HOT</span>
								<span v-else-if="child.badge === 'NEW'" class="dropdown-badge badge-new">NEW</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
		<div v-if="!isMobile" class="top-right-box">
			<!-- <router-link to="/problem" class="help-problems">
				<img src="@/assets/img/bos/icon_help.png" />
				<span>常见问题</span>
			</router-link> -->

			<div v-if="store.getters.userInfo" class="czbtn" @click="openCzTs()">
				<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"
					class="account_depositIcon__fQGY1" width="22" height="22">
					<path
						d="M13.6125 3.6208v3.4833h-1.375V3.6208c0-.2475-.22-.3666-.3666-.3666a.3675.3675 0 0 0-.1375.0274L4.4642 6.0225c-.4859.1833-.7975.6417-.7975 1.1642v.6141a3.4243 3.4243 0 0 0-1.375 2.75V7.1866c0-1.0908.6692-2.0625 1.6866-2.4474l7.2784-2.75a1.811 1.811 0 0 1 .6142-.11c.9166 0 1.7416.7424 1.7416 1.7416ZM19.7083 13.2917v.9167c0 .2475-.1925.4491-.4492.4583h-1.3383c-.4858 0-.9258-.3575-.9625-.8342-.0275-.2841.0825-.55.2658-.7333.165-.1742.3942-.2658.6417-.2658H19.25c.2658.0091.4583.2108.4583.4583Z"
						fill="#4F3D2E"></path>
					<path
						d="M17.8567 11.8708h.935c.5042 0 .9167-.4125.9167-.9167v-.4033c0-1.8975-1.5492-3.4467-3.4467-3.4467H5.7383c-.7791 0-1.4941.2567-2.0716.6967a3.4244 3.4244 0 0 0-1.375 2.75V16.72c0 1.8975 1.5492 3.4466 3.4466 3.4466h10.5234c1.8975 0 3.4467-1.5491 3.4467-3.4466v-.1742c0-.5042-.4125-.9167-.9167-.9167h-.7975c-.88 0-1.7233-.5408-1.9525-1.3933-.1925-.6967.0367-1.3658.495-1.815.3392-.3483.8067-.55 1.32-.55Zm-5.0233-.1833H6.4167c-.3758 0-.6875-.3117-.6875-.6875 0-.3759.3117-.6875.6875-.6875h6.4167c.3758 0 .6875.3116.6875.6875 0 .3758-.3117.6875-.6875.6875Z"
						fill="#4F3D2E"></path>
				</svg>
				<span>充值</span>
				<!-- <span class="icon-add">
					<i>+</i>
				</span> -->
			</div>
			<div v-if="store.getters.userInfo" class="header-userinfo">
				<div class="mr-2" @click="goTo()">
					<v-avatar style="border: 1px solid rgba(255,255,255,0.7)" :size="34"><img class="avatar"
							:src="processImageUrl(store.state.user?.avatar)" alt=""></v-avatar>
				</div>
				<div class="toprbox">
					<div class="text-white fs14 d-flex a-center">
						<div class="line1">{{ store.state.user?.nickname }} </div>

						<!-- <img @click="logOut" class="ml-2" style="width: 13px;height: 13px;"
							src="@/assets/img/icon_logout.png" alt=""> -->
					</div>
					<div class="d-flex a-center">
						<div style="color: #FFB300;" class="d-flex a-center">
							<img style="width: 12px;" src="@/assets/img/bos/douzi.svg" alt="">
							<span class="ml-1 mr-3 fs13">{{ store.state.user?.coin }}</span>

						</div>
						<div class="d-flex a-center" style="color: #FF8000; margin-left: 10px;">
							<img style="width: 12px;" src="@/assets/img/bos/suipian.svg" alt="">
							<span class="ml-1 fs13">{{ store.state.user?.diamond }}</span>
						</div>
					</div>
					<div class="dropdown-menu">
						<div @click="goTo()" class="menu-item">个人中心</div>
						<div @click="logOut" class="menu-item">退出登录</div>
					</div>
				</div>
			</div>
			<div v-else class="header-userinfo">
				<div class="login-btn-group">
					<div @click="openLogin">登录</div>
					<div @click="openRegister">注册</div>
				</div>
			</div>
		</div>


		<Login ref="loginRef" />
		<!-- 移动端头部 -->
		<div class="mobile-header">
			<el-icon style="margin-top: -2px;" @click="menuDialog.open()" class="ml-2" :size="20">
				<Fold />
			</el-icon>

			<div class="ml-2">
				<img style="height: 24px;" @click="goIndex" :src="logo" alt="">
			</div>
			<div class="flex-1"></div>
			<div>
				<div v-if="!store.getters.userInfo">
					<div class="login-btn-group mr-2">
						<div @click="openLogin">登录</div>
						<div @click="openRegister">注册</div>
					</div>
				</div>
				<div v-else class="d-flex">
					<v-btn class="mx-3 mt-1"
						style="border-radius: 20px; padding-left: 5px; padding-right: 5px; min-width: 30px;" height="20"
						@click="openCzTs()" color="#e79d5d" size="small"><span class="text-white">充值</span></v-btn>
					<div class="mr-2">
						<div style="color: #F5C147;" class="d-flex a-center">
							<img style="width: 12px;" src="@/assets/img/bos/douzi.svg" alt="">
							<span class="ml-1 fs13">{{ store.state.user?.coin }}</span>

						</div>
						<div style="color: #FF8000; margin-top: -2px;">
							<img style="width: 12px;" src="@/assets/img/bos/suipian.svg" alt="">
							<span class="ml-1 fs12">{{ store.state.user?.diamond }}</span>
						</div>
					</div>
					<v-avatar style="border: 1px solid #54688D; margin-right: 14px;" @click="openMobileMenu()"
						:size="34"><img class="avatar" :src="processImageUrl(store.state.user?.avatar)"
							alt=""></v-avatar>
				</div>

			</div>
		</div>

		<menu-dialog @cz="openCz()" ref="menuDialog" :showFooter="false" :links="links">
		</menu-dialog>

		<recharge-card ref="czpopupRef"></recharge-card>

		<q-popup wrapClass="popup_bg01" bg="" :showFooter="false" :width="isMobile ? '95vw' : '400px'" title="重要提示"
			ref="tspopupRef">
			<div class="py-4">
				<div class="d-flex" style="align-items: flex-start;">
					<el-checkbox v-model="isAgree"></el-checkbox>
					<p class="ml-2 fs14 text-white">充值即代表本人已满18周岁且具备完全行为能力并同意 <router-link style="color: #f3a45d"
							@click="colseCzTs()" to="/service?type=1">《隐私协议》</router-link>
						<router-link @click="colseCzTs()" style="color: #f3a45d"
							to="/service?type=2">《使用条款》</router-link>
					</p>
				</div>
				<div class="fs12 text-gray mt-4">
					<p>网站内禁止转卖饰品</p>
					<p>盲盒娱乐请理性消费，切勿上头</p>
					<p>未满十八(18)岁不得使用本服务</p>
					<p>在充值前请您仔细阅读 <router-link @click="colseCzTs()" style="color: #f3a45d"
							to="/service?type=1">《隐私协议》</router-link>
					</p>
					<p>成功充值即代表您对协议无异议!</p>
				</div>
			</div>
			<div v-if="isAgree" class="py-4">
				<v-btn style="border-radius: 10px;" @click="openCz()" width="100%" height="40" elevation="0"
					color="#f3a45d">
					<span class="text-white fs16">
						确认充值
					</span>
				</v-btn>
			</div>
		</q-popup>
		<q-popup wrapClass="popup_bg01" bg="" :showFooter="false" width="300px" height="230px" title="身份验证"
			ref="realnameTspopupRef">
			<div>
				<div class="py-10 tc text-red">请先进行身份验证再充值</div>
				<v-btn @click="openRealNameRef" width="100%" height="40" elevation="0" color="primary">
					<span class="text-white fs16">
						去认证
					</span>
				</v-btn>
			</div>
		</q-popup>

	</div>
	<RealName title="实名认证" ref="realNameRef"></RealName>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed, reactive, toRefs } from 'vue'
// import logo from '@/assets/img/m24_logo.png'
import logo from '@/assets/img/ooskins-logo.svg'
import Login from '@/components/Login.vue'
import RechargeCard from '@/components/RechargeCard.vue'
import RealName from "@/views/user/RealName.vue";
import MenuDialog from "./MenuDialog.vue";
import QPopup from "@/components/QPopup.vue";
import { useStore } from "@/store";
import { UserService } from "@/services/UserService";
import { processImageUrl } from "@/utils"
import { emitter } from "@/libs";
import { navList } from "./data";
import {
	useRouter,
	useRoute,
} from 'vue-router'
import { Fold } from '@element-plus/icons-vue';


const isMobile = ref(false);
const onResize = () => {
	isMobile.value = window.innerWidth < 600
};
const menuDialog = ref(null);
const tspopupRef = ref(null);
const router = useRouter();
const route = useRoute();
const store = useStore();
const isAgree = ref(false);

const activeTab = ref('首页')


console.log('router', router.currentRoute?.value?.meta?.module)

const state = reactive({
	links: navList,
	currentModule: router.currentRoute?.value?.meta?.module || "home",
	activeDropdown: null as string | null,
});

const { currentModule, links, activeDropdown } = toRefs(state)

function showDropdown(module: string) {
	state.activeDropdown = module;
}

function hideDropdown() {
	state.activeDropdown = null;
}

function isGameChildActive(link: any): boolean {
	if (!link.hasDropdown || !link.children) return false;
	return link.children.some((child: any) => child.module === state.currentModule);
}

function navigateTo(path: string, module: string) {
	if (module === "" || path === "") return;
	state.currentModule = module;
	state.activeDropdown = null; // 关闭下拉菜单
	router.push(path);
}

const loginRef = ref(null);
const czpopupRef = ref(null);
const realNameRef = ref(false);
const realnameTspopupRef = ref(false);
const openRealNameRef = () => {
	realnameTspopupRef.value.close();
	realNameRef.value.open();
}

function openCzTs() {
	let isRealName = store.state.user?.is_real_auth;
	if (isRealName) {
		tspopupRef.value.open();
	} else {
		realnameTspopupRef.value.open();
	}
}
function colseCzTs() {
	tspopupRef.value.close();
}
function openCz() {
	tspopupRef.value.close();
	czpopupRef.value.open();
}



const goTo = () => {
	activeTab.value = '';
	router.push("/user/mystock")
}

const openMobileMenu = () => {
	console.log('asdfa')
	emitter.emit("openMenu")
}

const goIndex = () => {
	router.push("/")
}

const logOut = () => {
	UserService.logout()
	clearUserInfo()
	store.commit("setTargetUrl", '/');
}

function clearUserInfo() {
	store.commit("setToken", '')
	store.commit("setUser", null)
	router.replace('/')
}
emitter.on("login", () => {
	openLogin()
})


const openLogin = () => {
	loginRef.value.open('login');
}
const openRegister = () => {
	loginRef.value.open('register');
}
// 监听路由变化  
const currentName = ref('Home');
watch(router.currentRoute, (newRouter) => {
	// 在路由发生变化时执行相应的操作  
	console.log('路由发生变化：', newRouter.name);
	currentName.value = newRouter.name;
	// 更新当前模块
	state.currentModule = newRouter.meta?.module || "home";
	
	// 检查是否是Games子项
	if (state.currentModule !== 'home' && state.currentModule !== 'games') {
		const gameLink = state.links.find(link => link.hasDropdown && link.children?.some(child => child.module === state.currentModule));
		if (gameLink) {
			// 当前模块是Games的子项，保持Games活跃状态
		}
	}
});

watch(
	() => router.currentRoute.value.path,
	(to, from) => {
		if (from == '/duanwu') {
			location.reload();
		}
	},
	{ immediate: true }
)

onMounted(() => {
	currentName.value = route.name;
	state.currentModule = route.meta?.module || "home";
	onResize();
	window.addEventListener('resize', onResize, { passive: true });
})

</script>

<style lang="scss" scoped>
.homebg {
	// background-image: url("@/assets/img/bos/banenr1.png");
	background-repeat: no-repeat;
	background-position: center top;
	background-color: #1b1c24;

}

.combg {
	background-color: #1b1c24;
	// background-image: url("@/assets/img/bos/combg.png");
	background-repeat: no-repeat;
	background-position: center top;

}

.help-problems {
	display: flex;
	align-items: center;
	cursor: pointer;
	color: #4b4c52;
	font-size: 14px;

	span {
		margin-left: 4px;
	}

	img {
		width: 13px;
	}
}

.toptabs {
	position: relative;
	display: flex;
	align-items: center;
}

.nav-item-wrapper {
	position: relative;

	&.has-dropdown {
		.nav-item {
			cursor: pointer;
		}
	}
}

.nav-item {
	min-width: 94px;
	height: 80px;
	padding: 0 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	position: relative;
	border-right: 1px solid #242631;
	transition: all 0.3s ease;

	.nav-icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.chevron-icon {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
		transition: transform 0.3s ease;
	}

	&.has-chevron {
		&.active .chevron-icon,
		&:hover .chevron-icon {
			transform: rotate(180deg);
		}
	}

	&:hover,
	&.active {
		color: #ffcd7f;
		background-color: rgba(243, 164, 93, 0.1);
	}
}

// 下拉菜单样式
.dropdown-menu-nav {
	position: absolute;
	top: 100%;
	left: 0;
	background: linear-gradient(135deg, rgba(26, 26, 32, 0.98) 0%, rgba(29, 29, 37, 0.98) 100%);
	border: 1px solid rgba(243, 164, 93, 0.3);
	border-radius: 12px;
	padding: 8px;
	min-width: 200px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	z-index: 1000;
	margin-top: 4px;
	backdrop-filter: blur(10px);
}

.dropdown-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	color: #99a5b7;
	font-size: 14px;
	font-weight: 500;

	&:hover {
		background-color: rgba(243, 164, 93, 0.15);
		color: #ffcd7f;
	}

	&.active {
		background-color: rgba(243, 164, 93, 0.2);
		color: #ffcd7f;
	}
}

.dropdown-item-icon {
	width: 20px;
	height: 20px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: currentColor;
}

.dropdown-item-text {
	flex: 1;
}

.dropdown-badge {
	padding: 2px 8px;
	border-radius: 10px;
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;

	&.badge-hot {
		background-color: #ff4444;
		color: #ffffff;
	}

	&.badge-new {
		background-color: #4caf50;
		color: #ffffff;
	}
}

.v-tab__slider {
	width: 40px !important;
	transform: translateX(-50%) !important;
	left: 50% !important;
}

.avatar {
	width: 100%;
}

.logoimg {
	width: 150px;
}

.logoo {
	width: 40px;
	margin-right: 5px;
}

.header-userinfo {
	margin-left: 20px;
	cursor: pointer;
	display: flex;
	height: 80px;
	align-items: center;
	flex-direction: row-reverse;
	text-align: right;

	.toprbox {
		margin-right: 10px;
	}

}

.myappbar {
	height: 80px;
	box-shadow: none !important;
	// background-color: #2B3340;
	color: #99A5B7;
	z-index: 9;
	display: flex;
	align-items: center;
	position: relative;
}

.fixed-appbar {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
}

.mobile-header {
	display: none !important;
}

@media screen and (max-width: 1200px) {
	.toptabs .nav-item {
		font-size: 12px;
		padding: 0 5px;
		min-width: 70px;
	}
}

@media screen and (max-width: 768px) {
	.myappbar {
		height: 60px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: rgba(23, 23, 31, 0.98);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(243, 164, 93, 0.1);
		padding-top: env(safe-area-inset-top);
	}

	.pc-header {
		display: none !important;
	}

	.mobile-header {
		height: 60px;
		position: relative;
		display: flex !important;
		align-items: center;
		width: 100%;
		flex: 1;
		padding: 0 12px;
		background-color: transparent;
	}

	.logoimg {
		width: 100px;
		height: auto;
		margin-left: 0;
		max-height: 32px;
	}

	.login-btn-group {
		width: auto !important;
		min-width: 140px;
		gap: 8px;

		& > div {
			height: 32px;
			line-height: 32px;
			font-size: 13px;
			padding: 0 16px;
			border-radius: 16px;
		}
	}
}

.radiobtn {
	border: 1px solid #C4C4C4 !important;
	border-radius: 4px;
	margin-bottom: 16px;
	// margin-right: 16px;
}

.v-btn--selected.radiobtn {
	border: none !important;
}

.login-btn-group {
	border-radius: 20px;
	overflow: hidden;
	width: 100px;
	display: flex;

	&>div {
		cursor: pointer;
		flex: 1;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 12px;
		background-color: #f3a55e;
		color: #503d2e;

		&:last-child {
			border-left: 1px solid rgba(255, 255, 255, 0.1);
		}
	}
}

.mybtntoggle {
	flex-wrap: wrap;
	height: auto;
	justify-content: space-between;
}

.top-right-box {
	position: absolute;
	right: 15px;
	display: flex;
	align-items: center;
	top: 0;
}

.czbtn {
	align-items: center;
	background-color: #f3a45d;
	border-radius: 20px;
	color: #4f3d2e;
	display: flex;
	height: 26px;
	justify-content: center;
	position: relative;
	transition: color .3s ease, background-color .3s ease;
	margin-left: 10px;
	flex-shrink: 0;
	padding: 0 10px;
	cursor: pointer;
	font-size: 12px;

	svg {
		width: 16px;
	}

	.icon-add {
		align-items: center;
		background: linear-gradient(90deg, #e6a160 -2.5%, #bd8a5a 31.01%, #6c5645 55.76%, #5c4c40);
		border-radius: 10px;
		color: #ffe5cd;
		display: flex;
		font-size: 18px;
		font-weight: 700;
		height: 20px;
		justify-content: center;
		line-height: 11px;
		position: absolute;
		right: -13px;
		top: 2px;
		width: 20px;
		
		i{
			font-style: normal;
			position: relative;
			top: -1px;
		}
	}
}

.header-userinfo {

	.dropdown-menu {
		position: absolute;
		right: 0;
		opacity: 0;
		top: 20%;
		transition: all 0.3s;
		background-color: #4b4c52;
		width: 100px;
		border-radius: 10px;
		padding: 10px;

		.menu-item {
			padding: 0 10px;
			text-align: left;
			height: 35px;
			line-height: 35px;
			border-radius: 10px;
			font-size: 12px;

			&:hover {
				color: #ffffff;
				background-color: #17171f;

			}
		}
	}

	&:hover {
		.dropdown-menu {
			top: 90%;
			opacity: 1;
		}
	}
}
</style>
