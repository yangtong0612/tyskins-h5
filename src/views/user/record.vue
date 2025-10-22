<template>
	<div>
		<div class="record-tabs">
			<div @click="changeTab(index)" class="record-tab-item" :class="index==tabIndex?'active':''" v-for="(item, index) in tabs" :key="index">
				<span>{{ item }}</span>
			</div>
		</div>
		<div v-if="tabIndex == 0">
			<RetrieveRecord ref="retrieveRecordRef"></RetrieveRecord>
		</div>
		<div v-if="tabIndex == 1">
			<SellRecord></SellRecord>
		</div>
		<div v-if="tabIndex == 2">
			<RechargeRecord></RechargeRecord>
		</div>
		<div v-if="tabIndex == 3">
			<TopRecord ref="topRecordRef"></TopRecord>
		</div>
		<div v-if="tabIndex == 4">
			<MineSweepingRecord ref="mineSweepingRecordRef"></MineSweepingRecord>
		</div>
	</div>
</template>

<script lang="ts" setup>

import { ref, computed, watch, nextTick } from 'vue';
import RetrieveRecord from './components/RetrieveRecord.vue'
import SellRecord from './components/SellRecord.vue'
import TopRecord from './components/TopRecord.vue'
import RechargeRecord from './components/RechargeRecord.vue'
import MineSweepingRecord from './components/MineSweepingRecord.vue'
const tab = ref(null);
const isMobile = computed(() => window.innerWidth < 600)
const tabs = ref([
	'提取记录', // 提取记录
	'兑换记录',// 出售记录
	'充值记录',
	'升级记录',
	'扫雷记录',
])

const tabIndex = ref(0);
const changeTab = (index) => {
	tabIndex.value = index;
}
const retrieveRecordRef = ref(null);
const topRecordRef = ref(null);
watch(tabIndex, (n, o) => {
	console.log(n)
	if (n == 0) {
		nextTick(() => {
			retrieveRecordRef.value.initData();
		})
	} else if (n == 1) {

	} else if (n == 3) {
		nextTick(() => {
			topRecordRef.value.initData();
		})
	}
})


</script>

<style lang="scss">
.record-tabs{
	position: relative;
	display: flex;
	margin-bottom: 20px;
	.record-tab-item{
		padding: 0px 13px 18px 13px;
		margin-right: 20px;
		position: relative;
		font-size: 14px;
		color: #666;
		cursor: pointer;
		z-index: 9;
		&.active{
			color: #f3a45d;
			&::after{
				content:"";
		        position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 3px;
				background-color: #f3a45d;
			}
		}
	}
	&::after{
		content:"";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background-color: #292931;
	}
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.record-tabs{
		flex-wrap: nowrap;
		overflow-x: auto;
		.record-tab-item{
			padding: 10px 0;
			white-space: nowrap;
			margin-right: 12px;
		}
	}
  
}
</style>