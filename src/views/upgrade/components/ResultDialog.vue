<template>
	<el-dialog :lock-scroll="true" :fullscreen="true" custom-class="res-dialog" v-model="dialog" :retain-focus="true" ref="popupRef">
		<div class="result-box">
			<div class="result-title">
				<div style="opacity: 0;">升级结果</div>
				<el-icon size="16px" @click="dialog = false">
                    <Close />
                </el-icon></div>
			<!-- <img v-if="result" class="successBg" :src="successBg"> -->
			<div class="tc relative z-index9" v-if="skinData" :class="{ success: result }">
				<div class="pt-8">
					<img style="width: 188px;" v-if="result" src="@/assets/img/bos/upgrade-success-tit.png" alt="">
					<img style="width: 188px;"  v-else src="@/assets/img/bos/upgrade-failed-tit.png" alt="">
				</div>

				<div class="skin-item">
					<div class="skin-item-image">
						<img :src="skinData.image_url" class="skin-image" />
						<!-- <img v-if="result" class="succesbg" src="@/assets/img/bos/upgrade-success.png"/> -->
					</div>

					<div class="skin-name">{{ skinData.short_name }}</div>

					<div class="skin-price">
						<img style="width: 11px;" src="@/assets/img/bos/suipian.svg" class="diamond" />
						{{ skinData.price }}

					</div>

					<!-- <div class="text-white mt-3" style="font-size: 15px">
						落点值：{{ point }}
					</div> -->

					<!-- <div style="color: red; position: relative; top: 10px;">关闭弹窗饰品自动存入背包</div> -->
				</div>


			</div>

			<div class="d-flex py-8" style="justify-content: center;">
				<div class="px-2">
					<v-btn elevation="0" class="sell-btn"   height="40" color="#FFB300" :disabled="loading"
						@click="sell('coin')">
						<span class="text-white">
							兑换(<img class="method2" src="@/assets/img/bos/douzi.svg" width="11"
								style="margin-right: 2px;" />{{
									skinData.price }})
						</span>
					</v-btn>
				</div>
				<div class="px-2">
					<v-btn elevation="0" block  height="40" color="#FF8000" @click="sell('diamond')"
						:disabled="loading"><span class="text-white">
							兑换(<img class="method2" src="@/assets/img/bos/suipian.svg" width="11"
								style="margin-right: 2px;" />{{
									skinData?.price }})

						</span></v-btn>
				</div>
				<div v-if="!isMobile" class="px-2">
					<v-btn elevation="0" width="120"   height="40" color="#4782F5"  @click="dialog = false"> <span class="text-white">继续升级</span></v-btn>
				</div>
			</div>
			<div v-if="isMobile" class="px-10" style="margin-top: -15px;">
				<v-btn elevation="0" block size="x-large"  height="40" color="#4782F5"  @click="dialog = false"> <span class="text-white">继续升级</span></v-btn>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import {
	ref,
	computed
} from "vue";
import type {
	PropType
} from "vue";
import type {
	SkinItem
} from "../index.vue";
import QPopup from '@/components/QPopup.vue';
import {
	BackpackService
} from "@/services/BackpackService";
import {
	ElMessage
} from "element-plus";
import {
	useStore
} from "@/store";

const emit = defineEmits(['update:modelValue', 'close'])
const loading = ref(false);
const store = useStore();
const dialog = ref(false);

const comfortSkin = computed(() => store.getters.comfortSkin);

const skinData = computed(() => {
	return props.result ? props.skin : comfortSkin.value;
})
// ref('#2D2F3D');
import successBg from '@/assets/img/resultbg.png'
const resultbg = ref('#2D2F3D');
const isMobile = computed(() => window.innerWidth < 600)
const sell = (convert) => {
	loading.value = true;
	BackpackService.sell({
		id: props.backpackId,
		convert: convert
	})
		.then((response) => {
			if (response.data.code === 0) {
				ElMessage.success("已出售");
				store.dispatch("getUserInfo")
				close();
			}
		})
		.finally(() => (loading.value = false));
}

const props = defineProps({
	skin: {
		type: Object as PropType<SkinItem>,
		default: () => null,
	},
	result: {
		type: Boolean,
		default: false,
	},
	backpackId: {
		type: Number,
		default: -1,
	},
	point: {
		type: Number,
	}
})
const popupRef = ref(null);
function open() {
	// popupRef.value.open();
	dialog.value = true;
}

function close() {
	// popupRef.value.close();
	dialog.value = false;
	// sell()
}
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>
<style lang="scss">
.res-dialog {
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
}


</style>

<style scoped lang="scss">
.result-box {
	width: 400px;
	margin: 0 auto;
	.result-title {
		position: relative;
		text-align: center;
		color: #333;
		font-size: 20px;
		height: 60px;
		.el-icon{
			position: absolute;
			right: 0;
			cursor: pointer;
		}
	}
}
.method2 {
	filter: grayscale(100%) brightness(200%);
}


.skin-name {
	color: #fff;
}

.skin-price {
	color: #FF9900;
}


.skin-item-image{
	position: relative;
	height: 230px;
	.succesbg{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		width: 70%;
	}
	.skin-image {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 200px;
	}
}

.successBg {
	position: absolute;
	width: 100%;
	z-index: 0;
	left: 0;
}

</style>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.result-box{
		width: 320px;
	}
}
</style>