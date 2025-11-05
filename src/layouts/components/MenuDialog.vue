<template>
	<el-drawer :append-to-body="true" custom-class="my-drawer" size="78%" v-model="drawer" :with-header="false" :direction="direction"
		:before-close="close" :lock-scroll="true">
		<div>
			<div class="menu-dialog">
				<div class="menu-logo-row">
					<el-icon @click="handleClose" color="#ffffff"  class="ml-2" :size="20">
						<Expand />
					</el-icon>
					<div>
						<img @click="goIndex" class="logoimg" :src="logo" alt="">
					</div>
				</div>
				
				<ul>
					<template v-for="(nav, index) in links" :key="index">
						<li v-if="!nav.hasDropdown && nav.path" @click="handleClick(nav.path)">
							<span class="text-white">{{ nav.name }}</span>
						</li>
						<li v-else-if="nav.hasDropdown" class="has-children">
							<div class="menu-parent" @click="toggleChildren(index)">
								<span class="text-white">{{ nav.name }}</span>
								<el-icon>
									<ArrowDown v-if="!expandedItems.includes(index)" />
									<ArrowUp v-else />
								</el-icon>
							</div>
							<ul v-if="expandedItems.includes(index)" class="children-menu">
								<li v-for="(child, childIndex) in nav.children" :key="childIndex" @click="handleClick(child.path)">
									<span class="text-white">{{ child.name }}</span>
									<span v-if="child.badge === 'HOT'" class="menu-badge badge-hot">HOT</span>
									<span v-else-if="child.badge === 'NEW'" class="menu-badge badge-new">NEW</span>
								</li>
							</ul>
						</li>
					</template>
				</ul>
			</div>
			
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import {
	useStore
} from "@/store";
import {
	ref,
	reactive,
	onMounted,
	computed,
} from 'vue'
import {
	useRouter
} from "vue-router";
import {
	navList
} from "./data";
import {
	UserService
} from "@/services/UserService";
import { emitter } from "@/libs";
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import logo from '@/assets/img/ooskins-logo.svg'
const store = useStore();
const router = useRouter();
const navList2 = ref(navList);
const emit = defineEmits(["login", "logout", "close", 'cz'])
const drawer = ref(false)
const direction = ref('ltr')
const expandedItems = ref<number[]>([])
defineProps({
	links: {
		type: Array,
		default: []
	}
})

function handleClose() {
	close()
}
const goTo = () => {
	router.push("/user")
}
function openCz() {
	emit('cz')
	close()
}
function handleClick(path: string) {
	if (!path) return;
	router.push(path);
	handleClose()
}

function toggleChildren(index: number) {
	const idx = expandedItems.value.indexOf(index);
	if (idx > -1) {
		expandedItems.value.splice(idx, 1);
	} else {
		expandedItems.value.push(index);
	}
}

function handleLogin() {
	emitter.emit("login");
	handleClose();
}

function handleLogout() {
	logout()
}

function logout() {
	UserService.logout();
	commitUserToken("");
}

function commitUserToken(token) {
	store.commit("setToken", token);
	window.location.reload();
}

const userInfo = computed(() => store.getters.userInfo)
const popupRef = ref(null);

function open() {
	// popupRef.value.open();
	drawer.value = true;
}

function close() {
	// popupRef.value.close();
	drawer.value = false;

}
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>

<style lang="scss">
.menu-logo-row{
	padding: 10px 0;
	margin-left: -10px;
	display: flex;
	align-items: center;
	.logoimg{
		width: 120px;
		margin-left: 10px;
	}
}
.my-drawer {
	z-index: 999999;
	.el-drawer__body {
		padding: 0;
		background-color: #141221;
	}
}

ul,
li {
	list-style: none;
}

.custom-overlay .v-overlay__content {
	width: 100%;
	height: 100%;
}

.menu-dialog {
	padding: 0 14px;
	background-color: #141221;

	ul {
		width: 100%;
	}

	li {
		display: flex;
		border-bottom: 1px solid rgba(0, 0, 0, 0.03);
		align-items: center;
		font-size: 16px;
		height: 50px;

		.navicon{
			filter: grayscale(100%) brightness(170%);
		}

		img {
			width: 16px;
		}

		&:first-child {
			border-top: 1px solid rgba(0, 0, 0, 0.03);
		}

		&.has-children {
			flex-direction: column;
			align-items: stretch;
			height: auto;
		}
	}

	.menu-parent {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 50px;
		cursor: pointer;
	}

	.children-menu {
		width: 100%;
		padding-left: 20px;
		background-color: rgba(0, 0, 0, 0.2);

		li {
			font-size: 14px;
			height: 45px;
			justify-content: space-between;
		}
	}

	.menu-badge {
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;

		&.badge-hot {
			background-color: #ff4444;
			color: #ffffff;
		}

		&.badge-new {
			background-color: #4caf50;
			color: #ffffff;
		}
	}


	.user-info {
		.user-avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
		}
	}

	.user-detail {
		img {
			width: 15px;
			height: 15px;
			margin-right: 3px;
		}
	}
}
</style>
