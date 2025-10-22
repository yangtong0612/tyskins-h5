<template>
	<div>
		<div class="bor-1px-b py-3">
			<span class="fs16 fw600">我的盲盒</span>
		</div>
		<div class="pt-4">
			<div class="d-flex" style="flex-wrap: wrap; margin-right: -4px;">
				<div v-for="(item,index) in 15" :key="index" style="width:20%;">
					<div class="px-1 py-1">
						<box-item>
							
						</box-item>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import avatar from '@/assets/img/avatar.png'
	import QTitle from '@/components/QTitle.vue'
	import BoxItem from '@/components/BoxItem.vue'
	const tabs = ref([
		{
			name: '我的库存'
		},
		{
			name: '我的盲盒'
		},
		{
			name: '历史记录'
		},
		{
			name: '账号设置'
		}
	])
</script>

<style scoped lang="scss">
	.userbox{
		width: 1200px;
		min-height: 584px;
		background: rgba(245, 245, 245, 1);
		box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.21);
		opacity: 1;
	}
	.left-nav{
		background-color: #ffffff;
		min-height: 584px;
	}
</style>