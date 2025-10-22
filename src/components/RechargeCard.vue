<template>
	<q-popup wrapClass="popup_bg03" bg="" :showFooter="false" :width="isMobile ? '96vw' : '470px'" height="433px"
		title="充值" ref="popupRef" @close="closePop">
		<el-result icon="success" v-show="isShowSuccessTip">
			<template #title>
				<span class="text-white" style="font-size: 16px">充值成功</span>
			</template>
			<template #extra>
				<v-btn elevation="0" color="#f3a45d" @click="handleBack">继续充值</v-btn>
			</template>
		</el-result>

		<div class="pt-3" v-show="!isShowSuccessTip">
			<div class="pt-1">
				<!-- <div class="mb-4 fs12 text-white">选择充值金额</div> -->
				<div style="width: 110%; display: none;">
					<v-btn-toggle class="mybtntoggle" v-model="amount" color="#f3a45d" mandatory>
						<v-btn @click="selectPrice(index)" v-for="(item, index) in state.price" :key="index"
							class="radiobtn" height="40" width="88" :value="item">
							<div class="recharge_amount">{{ item }}</div>
							<!-- <div v-if="item.gift_amount > 0" class="gift_amount">送{{ item.gift_amount }}</div> -->
						</v-btn>
					</v-btn-toggle>
				</div>
				<div class="text-white mt-3 mb-4 fs12">选择支付方式</div>
				<v-btn-toggle class="type-toggle" color="white" v-model="czType" mandatory>

					<!-- 人工支付 弹框 -->
					<!-- <v-btn class="radiobtn mr-2" height="40" :width="isMobile ? '80' : '120'" value="kf">
						<div class="d-flex a-center">
							<span>人工充值</span>
						</div>
					</v-btn> -->

					<v-btn class="radiobtn d-flex a-center" height="40" :width="isMobile ? '73' : '100'" value="cdk">
						<div class="d-flex a-center">
							<img style="width: 24px;" src="@/assets/img/cdk.png" alt="">
							<span>CDK兑换</span>
						</div>
					</v-btn>
				</v-btn-toggle>

				<div class="text-white mt-3 mb-4 fs12">SKINSBACK支付</div>

				<v-btn-toggle class="type-toggle" color="white" v-model="czType" mandatory>
					<v-btn class="radiobtn mr-2" height="40" :width="isMobile ? '90' : '120'" value="skinsback">
						<div class="d-flex a-center">
							<img style="width: 80px; height: 20px;" src="@/assets/img/skinsback_logo.svg" alt="">
						</div>
					</v-btn>
				</v-btn-toggle>

			</div>

			<div class="d-flex flex-column aj-center py-6">
				<v-btn style="border-radius: 10px;" @click="getRecharge()" width="216" height="40" elevation="0"
					color="#f3a45d">确定</v-btn>
				<div class="mt-3">
					<div class="text-gray fs12"> 如果充值未到账请加添加客服qq：3789944296</div>
				</div>
			</div>
		</div>

		<el-dialog  destroy-on-close append-to-body v-model="qdialog" custom-class="overlay-dialog">
			<div v-if="czType == 'skinsback'">
				<div @click="qdialog = false" class="abs absrt" style="margin-right: 10px;margin-top: 10px; z-index: 9; cursor: pointer;">
						<el-icon color="#999999" :size="30">
							<CircleClose />
						</el-icon>
					</div>
					
				<div class="skinsback-dialog" style="z-index: 1;">
					
					<iframe v-if="!isMobile" :src="state.qrCode"
						style="width: 850px; height: 680px; border: none;"></iframe>
					<iframe v-else :src="state.qrCode" style="width: 100%; height: 700px; border: none;"></iframe>

				</div>

			</div>

			<div v-else-if="czType == 'kf'" class="bg-white d-flex flex-column aj-center"
				style="width: 400px;height: 400px;border-radius: 6px; position: relative;">
				<section>
					<div @click="qdialog = false" class="abs absrt" style="margin-right: 10px;margin-top: 10px;">
						<el-icon color="#999999" :size="30">
							<CircleClose />
						</el-icon>
					</div>
					<div v-show="!isShowSuccessTip">
						<div class="mb-10 fs18 fw600 tc">人工充值</div>
						<div class="px-8">

							<div>
								<img style="width: 200px; height: 200px;" src="@/assets/img/czkf.jpg" />
							</div>
							<div class="mt-8 fs13 text-center text-red">人工充值请添加QQ:2671774550</div>
						</div>
					</div>
				</section>
			</div>


			<div v-else class="d-flex popup_bg03 flex-column aj-center"
				style="width: 320px;height: 400px;border-radius: 6px; position: relative;">
				<section>
					<div @click="qdialog = false" class="abs absrt" style="margin-right: 10px;margin-top: 10px;">
						<el-icon color="#999999" :size="30">
							<CircleClose />
						</el-icon>
					</div>
					<div v-show="!isShowSuccessTip">
						<div class="mb-10 fs18 fw600 tc text-white">CDK兑换</div>
						<div class="px-8">
							<!-- <div>
								<el-input v-model="cdk.form.card_no" placeholder="请输入卡号"></el-input>
							</div> -->
							<div class="mt-8">
								<el-input v-model="cdk.form.card_secret" placeholder="请输入卡密码"></el-input>
							</div>

							<div class="mt-8 d-flex aj-center">
								<v-btn style="border-radius: 6px;" @click="handleCdkRecharge" elevation="0" color="#f3a45d"><span>确认充值</span></v-btn>
							</div>

							<div class="mt-8 fs13 text-red">友情提示：CDK使用一次后作废，请妥善保管。若出现问题请联系管理员。</div>
						</div>
					</div>
				</section>
			</div>
		</el-dialog>

	</q-popup>
</template>

<script setup lang="ts">
window.addEventListener('message', handleMessage, false);
function handleMessage(event)
	{
		if (event.origin != "https://skinsback.com")
		{
			return;
		}

		if(typeof event.data.paymentStatus == 'undefined')
		{
			return;
		}

		if(event.data.paymentStatus == 'success') /* success payment */
		{
			closePopup();
		}
		else if(event.data.paymentStatus == 'cancel') /* failed payment */
		{
			closePopup();
		}
	}

import {
	ref,
	watch,
	reactive,
	onUnmounted,
	onMounted,
	computed,
	toRefs
} from 'vue';
import rwm from '@/assets/img/rwm.png'
// import VueQrcode from 'vue-qrcode'
// import QrcodeVue from 'qrcode.vue'
import QPopup from "@/components/QPopup.vue";
import {
	toast
} from "@/composables/util"
import {
	useRecharge
} from "./service/use-recharge";
import {
	useMetaData
} from "./service/use-meta";
import {
	PaymentService
} from "@/services/PaymentService";
import {
	usePromise
} from "./service/use-promise";
import {
	useCdk
} from "./service/use-cdk";
import {
	ElMessage
} from "element-plus";
import {
	useStore
} from "@/store";
const isMobile = computed(() => window.innerWidth < 600)
const store = useStore();
const popupRef = ref(null);
const czType = ref('skinsback')
// const prices= ref([15, 50, 100, 300, 500, 1000, 3000]);
// const maxAmount = 3000;
// const minAmount = 15;
const qdialog = ref(false)
const state = reactive({
	goodsIds: [32753, 32757, 32758, 32759, 32760, 32761, 32762],
	price: [30, 50, 100, 200, 500, 1000, 3000, 6000],
	packageList: [],
	tabs: "skinsback",
	qrCode: "",
	amount: 30,
	packageId: null,
	isShowProtocol: true,
	loading: false,
	error: false,
	// 充值成功标识
	isShowSuccessTip: false,
	priceIndex: -1,
	// 二维码缓存
	qrCodeCache: [] as {
		qrcode: string;
		amount: number;
		method: string;
		order_no: string;
	}[],
	cdk: {
		loading: false,
		form: {
			card_secret: "",
		},
	},
});

const {
	amount,
	qrCode,
	loading,
	cdk,
	isShowSuccessTip
} = toRefs(state);

const handleRetry = () => {
	state.error = false;
	getRecharge();
};

const cleanQrCodeCache = () => {
	state.qrCodeCache = [];
};

let checkOrderTimer = null;

function closePopup() {
	qdialog.value = false;
}

const checkOrder = (order_no: string) => {
	clearOrderDetailTimer();
	let timerStartTime = Date.now();

	checkOrderTimer = setInterval(() => {
		PaymentService.getOrderDetail(order_no).then((res) => {
			const {
				pay_status
			} = res.data.data;
			if (pay_status === 1) {
				store.dispatch("getUserInfo");

				toast('充值成功')
				clearOrderDetailTimer();
				state.isShowSuccessTip = true;
				cleanQrCodeCache();
				qdialog.value = false;
			} else {
				if (Date.now() - timerStartTime > 1000 * 60 * 6) {
					// 超出六分钟 停止检查订单
					clearOrderDetailTimer();
				}
			}
		});
	}, 2000);
};

const clearOrderDetailTimer = () => {
	clearInterval(checkOrderTimer);
};

const setRechargeCache = (order_no: string) => {
	state.qrCodeCache.push({
		amount: state.amount,
		method: czType.value,
		order_no,
		qrcode: state.qrCode,
	});
};

const selectPrice = (index) => {
	//  state.packageId = state.packageList[index].id;
}

const getRechargeCache = () => {
	return state.qrCodeCache.find((item) => {
		return item.amount === state.amount && item.method === czType.value;
	});
};

const deleteRecahrgeCache = (order_no: string) => {
	state.qrCodeCache = state.qrCodeCache.filter(
		(item) => item.order_no !== order_no
	);
};

const getRecharge = () => {

	if (czType.value === "cdk") return;
	state.qrCode = "";

	const qrCodeCache = getRechargeCache();

	if (qrCodeCache) {
		qdialog.value = true;
		state.qrCode = qrCodeCache.qrcode;
		checkOrder(qrCodeCache.order_no);
		return;
	}

	if (amount) {
		qdialog.value = true;
		state.loading = true;
		const method = czType.value;
		if (method === "skinsback") {
			PaymentService.payment({
				channel: 'skinsback',
				method: '',
				amount: 0,
				subject: '',
				body: '',
			}).then((res) => {
				console.log(res.data.data)
				const { url, order_no } = res.data.data;
				state.qrCode = url;

				if (order_no) {
					checkOrder(order_no);
				}
				setRechargeCache(order_no);
			})
				.catch((response) => {
					state.error = true;
				})
				.finally(() => {
					state.loading = false;
				});
			return;
		}



	}
};

const handleBack = () => {
	state.isShowSuccessTip = false;
	cleanQrCodeCache();
};

const handleCdkRecharge = () => {
	let {
		card_secret
	} = state.cdk.form;
	card_secret = card_secret.trim();
	if (!card_secret) {
		toast('请输入卡密', 'warning');
		return;
	}
	state.cdk.loading = true;
	PaymentService.cdkRecharge(state.cdk.form).then(() => {
		store.dispatch("getUserInfo");
		clearCdk();
		state.isShowSuccessTip = true;
		qdialog.value = false
	}).finally(() => {
		state.cdk.loading = false;
	})
};

const getPriceList = () => {
	PaymentService.getRechargePackage().then(res => {
		const { data: { data } } = res;
		if (data.length > 0) {
			state.packageList = data;

			state.packageId = state.packageList[0].id;
		}
	})
}

const clearCdk = () => {
	state.cdk.form.card_no = "";
	state.cdk.form.card_secret = "";
	state.cdk.loading = false;
}

watch(qdialog, (newValue, oldValue) => {
	console.log(newValue)
	if (!newValue) {
		setTimeout(() => {
			czType.value = 'skinsback';
		}, 300)
	}
})
watch(czType, (newValue, oldValue) => {
	if (newValue == 'cdk') {
		qdialog.value = true;
	}
	console.log(newValue)
})

const qrc = ref('');

function confirm() {
	const method = czType.value;
	if (czType.value == 'cdk') return;
	openQrcode()
}

function open() {
	popupRef.value.open();
}

function close() {
	popupRef.value.close();
}

function openQrcode() {
	qdialog.value = true;
}

// 向父组件暴露以下方法
defineExpose({
	open,
	close
})

const closePop = () => {
	setTimeout(() => {
		isShowSuccessTip.value = false
	}, 1000)
}

onMounted(() => {
	getPriceList();
})

onUnmounted(() => {
	clearOrderDetailTimer();
})
</script>

<style scoped lang="scss">
.radiobtn {
	border: 1px solid #ffffff !important;
	border-radius: 2px;
	margin-bottom: 10px;
	margin-right: 10px;
}

.v-btn--selected.radiobtn {
	border: none !important;
}

.mybtntoggle {
	border-radius: 2px;
	flex-wrap: wrap;
	height: auto;
	// justify-content: space-between;
}

.qr-code-wrapper {
	width: 160px;
	height: 160px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	background: #252b34;
	border-radius: 2px;
	overflow: hidden;
}

.recharge-success {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	background-color: #fff;
}

.gift_amount {
	position: absolute;
	right: -1px;
	top: 0;
	background-color: red;
	padding: 3px 5px;
	font-weight: 400;
	font-size: 11px;
	margin-top: -1px;
	color: #ffffff;
	border-bottom-left-radius: 20px;
	border-top-right-radius: 4px;
}

.skinsback-dialog {
	padding-top: 30px;
	border: 1px solid #f8bc76;
	width: 850px;
	background-color: #323e61;
	height: 712px;
	border-radius: 10px;
	overflow: hidden;
	position: relative;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.skinsback-dialog {
		width: 90vw;
		height: 80vh;
	}
}
</style>