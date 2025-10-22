<template>
	<div>
		<div v-if="!isMobile">
			<QTitle class="bg1" title="账号设置"></QTitle>
		</div>
		<div class="wd-mtitle">
			<span>账号设置</span>
		</div>
		<div class="m-userbox">
			<div class="pt-6" style="margin: 0 auto;font-size: 16px;">
				
				<!-- {{userInfo}} -->
				<div class="setting-item">
					<div class="label">修改头像</div>
					<div class="value">
						<el-upload :on-success="handleAvatarSuccess" :show-file-list="false" action="/api/public/upload"
							class="avatar-uploader d-flex align-center justify-center" :on-error="onUploadError" accept="image/*">
							<v-avatar>
								<section class="avatar relative">
									<img style="width: 100%;" v-if="userInfo?.avatar" :src="processImageUrl(userInfo?.avatar)" />
									<el-icon class="icon absolute">
										<EditPen />
									</el-icon>
								</section>
							</v-avatar>
							<el-icon v-if="isMobile"><ArrowRight /></el-icon>
						</el-upload>
					</div>
					<div class="btns">
						<el-upload :on-success="handleAvatarSuccess" :show-file-list="false" action="/api/public/upload"
							class="avatar-uploader d-flex align-center justify-center" :on-error="onUploadError" accept="image/*">
							<div class="btn">修改</div>
						</el-upload>
					</div>
				</div>

				<div class="setting-item">
					<div class="label">昵称</div>
					<div class="value" @click="openSetting('nickname')">
						{{ userInfo?.nickname }}
						<el-icon  v-if="isMobile"><ArrowRight /></el-icon>
					</div>
					<div class="btns">
						<a @click="openSetting('nickname')" class="btn" style="text-decoration: none;"
							href="javascript:;">{{userInfo?.nickname ? '修改' : '设置'}}</a>
					</div>
				</div>
				<div class="setting-item">
					<div class="label">手机号</div>

					<div v-if="!userInfo?.mobile && isMobile" class="value"  @click="phoneRef.open(); form2.mobile = userInfo.mobile">
						绑定
						<el-icon  v-if="isMobile"><ArrowRight /></el-icon>
					</div>
					<div v-else class="value">
						{{ userInfo?.mobile }}
						<el-icon  v-if="isMobile"><ArrowRight /></el-icon>
					</div>
					<div class="btns">
						<a v-if="!userInfo?.mobile" @click="phoneRef.open(); form2.mobile = userInfo.mobile" class="btn"
							style="text-decoration: none;" href="javascript:;">
							绑定
						</a>
					</div>
				</div>
				<div class="setting-item">
					<div class="label">密码</div>
					<div class="value" @click="passwordRef.open()">
						{{ userInfo?.set_password ? '********' : '' }}
						<el-icon  v-if="isMobile"><ArrowRight /></el-icon>
					</div>
					<div class="btns">
						<a @click="passwordRef.open()" class="btn" style="text-decoration: none;" href="javascript:;">
							{{ userInfo?.set_password ? '修改' : '设置' }}
						</a>
					</div>
				</div>
			</div>
		</div>
		<q-popup wrapClass="popup_bg01" bg="" :width="isMobile ? '100%' : '400px'" :title="`编辑${popupTitle}`" ref="settingPopupRef">
			<div class="pt-2">
				<div class="">
					<el-input v-model="valModel" style="text-align: center;" size="large" placeholder="请输入" />
				</div>
			</div>
			<template #footer>
				<v-btn @click="submit" style="border-radius: 10px;" class="mt-4" block height="40" color="#f3a45d" elevation="0">确定</v-btn>
			</template>
		</q-popup>
		<q-popup wrapClass="popup_bg02" :width="isMobile ? '100%' : '490px'" bg="" :title="`${userInfo?.set_password ? '修改' : '设置'}登录密码`" ref="passwordRef">
			<div class="pt-2">
				<div class="">
					<el-input v-model="form.password" style="text-align: center;" size="large" placeholder="请输入登录密码" />
				</div>
				<div class="mt-4">
					<el-input :disabled="true" v-model="userInfo.mobile" style="text-align: center;" size="large"
						placeholder="请输入手机号" />
				</div>
				<div class="mt-4">
					<el-input v-model="form.code" style="text-align: center;" size="large" placeholder="请输入验证码">
						<template #append>
							<span @click="sendPhoneCodeBefore(userInfo.mobile)" class="text-blue" style="cursor: pointer;">{{ buttonText }}</span>
						</template>
					</el-input>
				</div>
			</div>
			<template #footer>
				<v-btn style="border-radius: 10px;" class="mt-4" @click="submit2" block height="40" color="#f3a45d" elevation="0">保存</v-btn>
			</template>
		</q-popup>
		<q-popup wrapClass="popup_bg02" bg="" :width="isMobile ? '100%' : '490px'" title="绑定手机号" ref="phoneRef">
			<div class="pt-2">

				<div class="mt-4">
					<el-input v-model="form2.mobile" style="text-align: center;" size="large" placeholder="请输入手机号" />
				</div>
				<div class="mt-4">
					<el-input v-model="form2.code" style="text-align: center;" size="large" placeholder="请输入验证码">
						<template #append>
							<span @click="sendPhoneCode(form2.mobile)" class="text-blue">{{ buttonText }}</span>
						</template>
					</el-input>
				</div>
			</div>
			<template #footer>
				<v-btn style="border-radius: 10px;" @click="submit3" class="mt-4" block height="40" color="#f3a45d" elevation="0">保存</v-btn>
			</template>
		</q-popup>
	</div>
</template>

<script lang="ts" setup>
import { useCode } from "@/composables/useCommon"
import { UserService } from "@/services/UserService";
import { toast } from "@/composables/util"
// import avatar from '@/assets/img/avatar.png'
import QPopup from '@/components/QPopup.vue'
import QTitle from "@/components/QTitle.vue";
import { reactive, computed, ref, toRefs } from 'vue';
import { useStore } from '@/store'
import { processImageUrl } from "@/utils"
const store = useStore();
const userInfo = computed(()=>store.getters.userInfo);
// const userInfo = reactive(computed(() => store.getters.userInfo));
const { sendPhoneCode, buttonText, clearCountdown } = useCode()
import { ElMessage } from "element-plus";
const form = reactive({
	code: '',
	password: '',
	type: 'mobile'
})
const form2 = reactive({
	code: '',
	mobile: '',
})
const isMobile = computed(() => window.innerWidth < 600)
// const { form } = toRefs(state)
const settingPopupRef = ref(null);
const passwordRef = ref(null);
const phoneRef = ref(null);
const popupTitle = ref('');
const valModel = ref('');
let keyName = '';
function openSetting(val: any) {
	keyName = val
	console.log(userInfo)
	valModel.value = userInfo ? userInfo.value[val] : ''
	switch (val) {
		case 'nickname':
			popupTitle.value = '昵称'
			break;
		case 'trade_url':
			popupTitle.value = 'Steam链接'
			break;
		default:
			popupTitle.value = '编辑'
			break;
	}
	settingPopupRef.value.open();
}

const sendPhoneCodeBefore = async (mobile) => {
	if (buttonText.value != '获取验证码') {
	  return;
	}
	if(mobile == "") {
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
const submit = async () => {
	if (valModel == '') return;
	let res = null;
	if (keyName == 'trade_url') {
		res = await UserService.bindSteam({ [keyName]: valModel.value });
	} else {
		res = await UserService.edit({ [keyName]: valModel.value });
	}

	settingPopupRef.value.close();
	if (res.data.code == 0) {
		toast(`${popupTitle.value}编辑成功`);
		store.dispatch("getUserInfo");
	}
}
const submit2 = async () => {
	if (form.password.length < 6) {
		toast("登录密码长度至少6位", "error");
		return;
	}
	if (form.code.length != 6) {
		toast("验证码长度必须是6位", "error");
		return;
	}
	passwordRef.value.close();
	const res = await UserService.setPassword(form);
	// 清空表单
	form.password = ''
	form.code = ''
	// 重置倒计时
	clearCountdown()
	if (res.data.code == 0) {
		toast(`密码设置成功`);
		store.dispatch("getUserInfo");
	}
}
const submit3 = async () => {
	if (!form2.mobile.length) {
		toast(`手机号不能为空`, 'error');
		return;
	}
	if (form2.code.length != 6) {
		toast(`验证码长度必须是6位`, 'error');
		return;
	}
	phoneRef.value.close();
	const res = await UserService.bindMobile(form2);
	if (res.data.code == 0) {
		toast(`绑定手机号成功`);
		store.dispatch("getUserInfo");
	}
}
function onUploadError() {
	toast(`上传头像失败`, 'error');
}
function handleAvatarSuccess(res, file) {
	const path = `${res.data.file_path}`;
	UserService.edit({
		avatar: path
	})
		.then(() => {
			store.dispatch("getUserInfo");
			toast("头像修改成功");
		})
		.finally(() => {

		});
}
</script>

<style scoped lang="scss">
.setting-item{
	display: flex;
	font-size: 14px;
	min-height: 58px;
	border-bottom: 1px solid #292931;
	padding: 10px 0;
	align-items: center;
	.label{
		width: 150px;
		color: #999999;
	}
	.value{
		color: #ffffff;
		flex: 1;
		display: flex;
	}
	.btns{
		.btn{
			width: 53px;
			height: 24px;
			line-height: 24px;
			background: #f3a45d;
			border-radius: 10px;
			text-align: center;
			font-size: 12px;
			color: #fff;
			display: block;
			cursor: pointer;
		}
	}
}
.avatar {
	width: 100%;
	height: 100%;

	.icon {
		display: none;
		position: absolute;
		width: 40px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		/* 50%为自身尺寸的一半 */
		font-size: 20px;
	}

	&:hover {
		.icon {
			background: rgba(0, 0, 0, 0.4);
			display: block;
			color: #eff;
		}
	}
}

@media screen and (max-width: 600px) {
	.m-userbox {
		margin-top: 10px;
		background-color: #ffffff;
		border-radius: 2px;
		padding: 0 10px 15px 10px;
		.py-3 {
			border-bottom: 1px solid rgba(0, 0, 0, 0.04);
		}
		.pt-6{
			padding-top: 10px !important;
		}
	}
	.setting-item{
		.btns{
			display: none;
		}
		.value{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.el-icon{
				color: #666666;
				// display: block;
			}
			&::after{
				content:'',

			}
		}
	}
}
</style>