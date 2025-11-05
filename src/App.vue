<template>
	<div>
		<router-view></router-view>
		<!-- <div class="zhongqiu-popup" v-show="showZq">
			<div class="inner-box">
				<div @click="showZq = false" class="zq-close"> </div>
				<router-link @click="showZq = false"  to="/open">
					<img class="zqgq" src="@/assets/img/open_popup_bg.png"/>
				</router-link>
			</div>
		</div> -->
		<!-- <q-popup  :width="isMobile ? '100%' : '494px'"  height="450px" title="关站声明" ref="ggPopupRef">

			<div>
				<p>各位亲爱的小伙伴:</p>
				<p class="mt-2">首先，感谢大家一直以来信赖并选择ooskins平台</p>
				<p class="mt-2">平台自上线以来，陪伴大家度过了很多美好时光.一路走来，风雨兼程，平台离不开各位小伙伴的支持与参与，在此向各位的热情与支持致以最诚挚的感谢! </p>
				<p class="mt-2">将于2024年5月22日【14:00】时起正式终止平台的运营及服务。因平台运营策略调整，我们怀着十分遗憾的心情，决定时间具体安排如下:</p>
				<p class="mt-2">1.2024年5月21日【11:00】时起，我们将关闭平台用户充值功能,请大家尽快提取背包饰品。</p>
			</div>

		</q-popup> -->
	</div>
</template>

<script setup lang="ts">
import { onMounted ,ref, computed } from "vue";
import { useStore } from "@/store";
import { UserService } from "@/services/UserService";
const store = useStore();
store.dispatch("getUpgradeProfitRate");
store.dispatch("getComfortSkin");
store.dispatch("getRechargeWelfareBoxTypeId")
const isMobile = computed(() => window.innerWidth < 600);
import QPopup from "@/components/QPopup.vue";

const showZq = ref(true);
const ggPopupRef = ref(null);

onMounted(() => {
	// ggPopupRef.value.open();
	const { token } = store.state;
	if (token) {
		getUserInfo();
	}

	const searchParams = new URLSearchParams(window.location.search);

	if (searchParams.has("code")) {
		const code = searchParams.get("code");

		code != null && localStorage.setItem("inventCode", code);

		console.log(code);
	}
});

async function getUserInfo() {
	return store
		.dispatch("getUserInfo")
		.then((userInfo) => {
			const status = userInfo.data?.data?.status;
			if (status !== 0) {
				logout();
				return;
			}
			store.dispatch("getUserSeed");
			store.dispatch("getInviterInfo");
			store.dispatch("getLevelSetting");
			store.dispatch("getPromoteRecord");
			store.dispatch("getPromoteStat");
		})
		.catch((response) => {
			logout();
		});
}
function logout() {
	UserService.logout();
	commitUserToken("");
}

function commitUserToken(token) {
	store.commit("setToken", token);
	window.location.reload();
}
</script>
<style lang="scss">
.line1{
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* 设置最大显示行数 */
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
	width: 100%;
	border: 1px red;

}
html,body{
	background-color: #17171f;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
}

// 移动端视口优化
@supports (-webkit-touch-callout: none) {
	/* iOS Safari */
	html {
		height: -webkit-fill-available;
	}
	
	body {
		min-height: -webkit-fill-available;
	}
}
.el-table{
	background-color: #17171f !important;
}
.right-btn-box {
	display: flex;

	.el-switch--small .el-switch__label * {
		color: #ffffff;
	}
}

@media (min-width: 1920px) {
	.v-container {
		max-width: 1200px !important;
	}
}

// 去除浏览器记住密码时自动填充的input框样式
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-text-fill-color: #333 !important; //这个地方的颜色是字体颜色，可以根据实际情况修改
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important; //设置input输入框的背景颜色为透明色
  background-color: transparent; //设置input输入框的背景颜色为透明色
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
input {
  background-color: transparent; //设置input输入框的背景颜色为透明色
}

.overlay-dialog{
	background-color: rgba(255,255,255,0) !important;
	box-shadow: none;
	position: absolute !important;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 !important;	
	padding: 0 !important;
	.el-dialog__header{
		display: none;
	}
	.el-dialog__body{
		padding: 0 !important;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(255,255,255,0);
		overflow: auto;
	}
}

.el-message-box {
	width: 320px !important;
}


.zhongqiu-popup{
		z-index: 99999;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		
		.inner-box{
			// border: 1px solid red;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			width: 1200px;
			.zqgq{
				width: 1200px;
			}
			.zq-close{
				position: absolute;
				right: 125px;
				top: 130px;
				width: 60px;
				height: 60px;
				cursor: pointer;
			}
		}
		
	}

	@media screen and (max-width: 600px)  {
		.zhongqiu-popup{
			.inner-box{
				text-align: center;
				.zqgq{
					width: 100%;
					// width: 400px;
					position: relative;
					left: 0px;
					
				}
				.zq-close{
					z-index: 99;
					width: 30px;
					height: 30px;
					top: 34px;
					right: 32px;
				}
				.zq-btn{
					width: 50%;
				}
			}
		}
	}
</style>


<style>
.v-container {
	width: 100%;
	padding: 16px;
	margin-right: auto;
	margin-left: auto;
  }
  @media (min-width: 960px) {
	.v-container {
	  max-width: 900px;
	}
  }
  @media (min-width: 1280px) {
	.v-container {
	  max-width: 1200px;
	}
  }
  @media (min-width: 1920px) {
	.v-container {
	  max-width: 1800px;
	}
  }
  @media (min-width: 2560px) {
	.v-container {
	  max-width: 2400px;
	}
  }


  .el-table tr{
	background-color: #15151c !important;
  }
  .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf{
	border-bottom-color: #292931 !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
	background-color: #15151c !important;
  }

  .el-table--border .el-table__inner-wrapper::after, .el-table--border::after, .el-table--border::before, .el-table__inner-wrapper::before{
	background-color: #292931 !important;
  }
  .el-table th.el-table__cell {
	background-color: #2f2f36 !important;
	color: #808089 !important;
  }

  .my-vlist .v-divider {
	border-color: #292931 !important;
  }

  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
	background-color: rgba(111, 116, 143, .18) !important;
  }

  .el-pagination.is-background .el-pager li:not(.is-disabled).is-active{
	background-color: #aaacbd !important;
	color:  #15151c !important;
  }
</style>