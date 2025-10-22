<template>
	<el-dialog :append-to-body="appendToBody"  custom-class="overlay-dialog" v-model="dialog" style="z-index: 99999;" @click:outside="emit('close')">
		<div class="popupbox" :class="wrapClass" :style="{width, height, background: bg}">
			<div class="header" >
				<div>{{title}}</div>
				<el-icon size="16px" @click="handleClose">
                    <Close />
                </el-icon>
			</div>
			<div class="body">
				<slot></slot>
			</div>
			<div v-if="showFooter" class="footer">
				<slot name="footer"></slot>
			</div>
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { UserService } from "@/services/UserService";
const store = useStore();
const route = useRoute();
defineProps({
	appendToBody: {
		type: Boolean,
		default: true
	},
	wrapClass: {
		type: String,
		default: ''
	},
	fullscreen: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: ''
	},
	width: {
		type: String,
		default: '488px'
	},
	height: {
		type: String,
		default: ''
	},
	bg: {
		type: String,
		default: '#f9f9f9'
	},
	showFooter: {
		type: Boolean,
		default: true
	}

})


const state = reactive({
	dialog: false,
})

const emit = defineEmits(['close'])

const { dialog } = toRefs(state);

function handleClose() {
	close();
	emit('close')
}

function open() {
	state.dialog = true;
}
function close() {
	state.dialog = false;
}
// 向父组件暴露以下方法
defineExpose({
	open,
	close
})
</script>

<style lang="scss" scoped>

a {
	text-decoration: none;
}

.popupbox {
	position: relative;
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 10px 0;

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		// background-color: #F9F9F9;
		color: #333333;
		border-radius: 2px 2px 0 0;
		padding-left: 24px;
		padding-right: 20px;
		flex-shrink: 0;
		position: relative;
		font-size: 18px;
		font-weight: 500;
		.el-icon{
			position: absolute;
			right: 15px;
			cursor: pointer;
		}
	}
	.body {
		// flex: 1;
		padding: 0 30px;
		// background-color: #F9F9F9;
		font-size: 14px;
		color: #333333;
	}
	.footer {
		// background-color: #F9F9F9;
		border-radius: 0 0 2px 2px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 30px 30px 30px;
	}
}
</style>