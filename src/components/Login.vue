<template>
	<el-dialog  :append-to-body="true" custom-class="overlay-dialog" v-model="dialog">
		<div class="login-wrap">
			
			<div class="right">
				<div v-if="isForget" class="loginbox">
					<div class="right"></div>
					<div class="header">
						<div>找回密码</div>
						<el-icon @click="dialog = false">
							<Close />
						</el-icon>
					</div>
					<div class="body">
						<div class="px-5 pt-4">
							<div>
								<div class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/phone.png" alt=""></div>
									<div class="flex-1">
										<input v-model="forgetForm.mobile" style="width: 100%;" placeholder="请输入手机号码"
											type="text">
									</div>
								</div>

								<div class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/msg.png" alt=""></div>
									<div class="flex-1">
										<input v-model="forgetForm.code" style="width: 100%;" placeholder="请输入验证码"
											type="text">
									</div>
									<div style="color: #f3a45d;"  @click="sendPhoneCode(forgetForm.mobile)" class="cursor">
										{{ buttonText }}
									</div>
								</div>
								<div class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/psw.png" alt=""></div>
									<div class="flex-1">
										<input v-model="forgetForm.password" style="width: 100%;" placeholder="请输入新密码"
											type="password">
									</div>
								</div>

							</div>
						</div>
					</div>
					<div class="footer px-5">
						<v-btn style="border-radius: 10px;" @click="submitEdit" width="100%" height="40" elevation="0" color="#f3a45d">
							<span class="text-white fs14">提交修改</span>
						</v-btn>
						<div class="d-flex justify-center fs14 mt-2">
							<span style="color: #f3a45d;" @click="isForget = false" class="cursor">返回登录</span>
						</div>
					</div>
				</div>
				<div v-else class="loginbox">
					<div v-if="isForget" class="header">
						<div>
							忘记密码
						</div>
						<el-icon @click="dialog = false">
							<Close />
						</el-icon>
					</div>
					<div v-else class="header">
						<span v-if="fromType == 'register'">用户注册</span>
						<span v-else>用户登录</span>
						<el-icon @click="dialog = false">
							<Close />
						</el-icon>
					</div>
					<div class="login_tabs" v-if="fromType == 'login' || fromType == 'mobile'">
						<div @click="changeType('login')" class="tab_item" :class="fromType == 'login' ? 'active' : ''">
							密码登录
						</div>
						<div @click="changeType('mobile')" class="tab_item" :class="fromType == 'mobile' ? 'active' : ''">
							验证码登录
						</div>
					</div>
					<div class="body">
						<!-- {{ fromType }} -->
						<div class="px-5 pt-3">
							<div>
								<div class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/phone.png" alt=""></div>
									<div class="flex-1">
										<input v-model="form.phone" style="width: 100%;" @keydown.enter="handLogin"
											placeholder="请输入手机号码" type="text">
									</div>
								</div>

								<div v-if="fromType == 'login' || fromType == 'register'" class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/psw.png" alt=""></div>
									<div class="flex-1">
										<input v-model="form.password" style="width: 100%;" @keydown.enter="handLogin"
											placeholder="请输入密码" type="password">
									</div>
								</div>


								<div v-if="fromType == 'mobile' || fromType == 'register'" class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/msg.png" alt=""></div>
									<div class="flex-1">
										<input v-model="form.messageCode" style="width: 100%;" @keydown.enter="handLogin"
											placeholder="请输入验证码" type="text">
									</div>
									<div style="color: #f3a45d;" @click="sendPhoneCodeBefore(form.phone)" class="cursor">
										{{ buttonText }}
									</div>
								</div>
								<div v-if="fromType == 'register' || fromType == 'mobile'" class="input-item">
									<div class="icon"><img src="@/assets/img/bos/login/yqm.png" alt=""></div>
									<div class="flex-1">
										<input v-model="form.inventCode" style="width: 100%;" @keydown.enter="handLogin"
											placeholder="邀请码(选填)" type="text">
									</div>
								</div>
							</div>

							<div class="fs13 d-flex  a-center text-gray" style="align-items: flex-start;">
								<el-checkbox v-model="isAgree"></el-checkbox>
								<div class="pt-1">
									<span style="white-space: nowrap; color: #999999;" class="mx-2">我已年满18岁，并阅读和同意</span>
									
									<router-link style="white-space: nowrap; color: #f3a45d;" target="_blank" to="/service?type=1">用户协议</router-link>
									<span class="mx-2">和</span>
									<router-link style="white-space: nowrap; color: #f3a45d;" target="_blank" to="/service?type=1">隐私政策</router-link>
									
								</div>
							</div>
						</div>
					</div>
					<div class="footer px-5">
						<v-btn style="border-radius: 10px;" @click="handLogin" width="100%" height="40" elevation="0" color="#f3a45d">
							<span class="text-white fs16">
								{{ fromType == 'login' || fromType == 'mobile' ? '登录' : '注册' }}
							</span>
						</v-btn>
						<div v-if="fromType == 'login'"  class="d-flex space-between fs14 mt-2">
							<a href="javascript:;" @click="changeType('register')" class="text-white">注册账号</a>
							<span @click="forgetPassword" class="text-white cursor">忘记密码？</span>
						</div>
						<div v-if="fromType == 'register'" class="d-flex justify-center fs14 mt-2">
							<span @click="changeType('login')" class="text-white cursor">返回登录</span>
						</div>

						<!-- <div>
							<el-divider>
								<div @click="steamLogin" class="d-flex a-center cursor">
									<span class="text-gray mr-2 fs12">STEAM登录</span>
									<img src="@/assets/img/steam.png" alt="">
								</div>
							</el-divider>
						</div> -->
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed, watch } from 'vue'
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { UserService } from "@/services/UserService";
import { ElMessage } from "element-plus";
import { useCode } from "@/composables/useCommon"
import { toast } from "@/composables/util"
const store = useStore();
const route = useRoute();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 600)
const { sendPhoneCode, buttonText } = useCode()
const form = reactive({
	account: "",
	phone: "",
	messageCode: "",
	inventCode: route.query.code || "",
	loginType: "mobile",
	password: "",
	ticket: "",
	rand_str: "",
})
const forgetForm = reactive({
	mobile: "",
	code: '',
	password: "",
	type: "mobile",
})


const state = reactive({
	fromType: 'login',
	dialog: false,
	loading: false,
	store: computed(() => store),
})
const isAgree = ref(true);


const { dialog, loading, fromType } = toRefs(state);




watch(dialog, (newValue, oldValue) => {
	if(!newValue) {
		store.commit("setTargetUrl", '/');	
	}
	setTimeout(() => {
		isForget.value = false;
	}, 1000)
});

const changeLoginType = (e) => {
	state.fromType = e;
	form.loginType = e
}

const isForget = ref(false);
const forgetPassword = () => {
	isForget.value = true;
}

const submitEdit = () => {
	changePassword()

}


const sendPhoneCodeBefore = async (mobile) => {
	if (buttonText.value != '获取验证码') {
		return;
	}
	if (form.phone == "") {
		toast("请输入手机号码", "error");
		return;
	}
	let ticket = '';
	let rand_str = '';
	if (import.meta.env.VITE_TCAPTCHA_OPEN === 'true') {
		console.log("open tencent captcha");
		try {
			let res = await new Promise<void>((resolve, reject) => {
				let captchaAppid = import.meta.env.VITE_TCAPTCHA_APPID
				const captcha = new window.TencentCaptcha(captchaAppid, function (res) {
					if (res.ret === 0) {
						resolve(res)
					} else {
						reject(res)
					}
				}, {
					type: 'popup',
					userLanguage: 'zh-cn',
					needFeedBack: true,
				});
				console.log(captcha);
				captcha.show(); // 显示验证码
			})
			ticket = res.ticket;
			rand_str = res.randstr;
		} catch (err) {
			console.log(err);
			ElMessage.error("验证失败");
			return false;
		}
	}

	sendPhoneCode(mobile, ticket, rand_str);
}

const changePassword = async () => {
	if (forgetForm.password.length < 6) {
		toast("登录密码长度至少6位", "error");
		return;
	}
	if (forgetForm.code.length != 6) {
		toast("验证码长度必须是6位", "error");
		return;
	}

	const res = await UserService.forgetPassword(forgetForm);
	isForget.value = false;
	if (res.data.code == 0) {
		toast(`密码设置成功`);
		store.dispatch("getUserInfo");
	}
}
async function handLogin() {
	if (!isAgree.value) {
		toast("请先阅读以下协议并勾选同意", 'warning')
		return;
	}
	if (form.phone.length == 0) {
		toast('请输入登录手机号', 'error')
		return;
	}
	if (form.loginType == "mobile") {
		if (form.messageCode.length == 0) {
			toast('请输入短信验证码', 'error')
			return;
		}
	} else if (form.loginType == "password") {
		if (form.password.length == 0) {
			toast('请输入密码', 'error')
			return;
		}
	}
	const params = {
		mobile: form.phone,
		invite_code: form.inventCode,
		login_type: form.loginType,
		ticket: form.ticket,
		rand_str: form.rand_str,
	}

	if (state.fromType === 'login') {
		delete params.code
		params.password = form.password
	}
	else if (state.fromType === 'register') {
		params.password = form.password
		params.code = form.messageCode
	} else {
		params.code = form.messageCode
		delete params.password
	}

	console.log(params)
	return UserService.login(params).then((login) => {
		if (login.data.data.access_token) {
			const token = login.data.data.access_token;
			toast("登录成功");
			UserService.setToken(token);
			commitUserToken(token);
		}
	});
}
function dialogInput() {
	console.log('sadf')
};

function commitUserToken(token) {
	store.commit("setToken", token);	
	router.push(store.getters.getTargetUrl)
	setTimeout(()=>{
		window.location.reload();
	},100)
	
	
	
}
const changeType = (type) => {
	state.fromType = type
	if (state.fromType == 'login') {
		form.loginType = 'password'
	} else {
		form.loginType = 'mobile'
	}
}

function open(type) {
	console.log('type', type)
	state.fromType = type;
	state.dialog = true;
	if (state.fromType == 'login') {
		form.loginType = 'password'
	} else {
		form.loginType = 'mobile'
	}
}
function close() {
	state.dialog = false;
}
function steamLogin() {
	const steamAuthUrl = `${import.meta.env.VITE_BASE_URL
		}/api/user/auth/steam`;
	window.open(
		steamAuthUrl,
		"_blank",
		"width=900,height=600,menubar=no,toolbar=no, status=no,scrollbars=yes"
	);
}
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>

<style lang="scss">
.login_tabs {
	display: flex;
	color: #fff;
	justify-content: center;
	font-size: 14px;
	width: 200px;
	margin: 0 auto;
	justify-content: space-between;

	.tab_item {
		padding: 5px 0;
		cursor: pointer;
	}

	.tab_item.active {
		font-weight: bold;
		position: relative;

		&::after {
			position: absolute;
			content: "";
			bottom: 0;
			width: 30px;
			background-color: #f3a45d;
			height: 2px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}

.input-item {
	height: 40px;
	background: #ffffff;
	border: 1px solid #ffffff;
	opacity: 1;
	border-radius: 2px;
	padding: 0 12px;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	font-size: 14px;
	overflow: hidden;

	input {
		outline: 0;
		height: 48px;
		font-size: 14px;
	}

	.icon {
		width: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;

		img {
			width: 12px;
		}
	}
}

.login-wrap {
	width: 400px;
	max-height: 460px;
	display: flex;
	overflow: hidden;
	border-radius: 10px;
	// background-image: url('@/assets/img/bos/login/loginbox_bg.png');
	background: linear-gradient(180deg, #79798e, #4c4c53);

	.left {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.logo {
			padding-left: 18px;
			padding-top: 16px;
		}

		.other-login {
			display: flex;
			justify-content: space-between;
			padding-left: 27px;
			padding-right: 36px;
			padding-bottom: 30px;
			color: #999;
			font-size: 14px;

			.steam-login {
				color: #ffffff;
				display: flex;
				align-items: center;
				cursor: pointer;

				img {
					margin-right: 4px;
				}
			}
		}

	}

	.right {
		width: 400px;
		background-color: rgba(0, 0, 0, 0.6);
	}
}

.loginbox {
	display: flex;
	flex-direction: column;

	.header {
		position: relative;
		padding-top: 20px;
		padding-bottom: 10px;
		color: #fff;
		border-radius: 8px 8px 0 0;
		padding-left: 24px;
		padding-right: 20px;
		width: 100%;
		font-size: 20px;
		text-align: center;
		display: flex;
		justify-content: center;

		.el-icon {
			position: absolute;
			right: 20px;
			top: 24px;
			cursor: pointer;
		}
	}

	.body {
		flex: 1;

	}

	.footer {
		border-radius: 0 0 8px 8px;
		padding: 30px 0;
	}

	.el-divider__text {
		// background-color: #f5f5f5;
	}
}

@media screen and (max-width: 600px) {
	.loginbox {
		width: 100%;
	}
	.login-wrap{
		width: 100%;
		.left{
			display: none;
		}
	}
}
</style>