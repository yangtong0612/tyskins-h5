<template>
	<div class="d-flex" style="flex-wrap: wrap; margin-right: -4px;">
		<div v-for="(item,index) in list" :key="index" :style="isMobile?'width:50%;':'width:25%;'">
			<div class="px-1 py-1">
				<shop-item :rarity="false" :item="item">
					<template #btns>
						<span class="text-muted fs12">{{$dayjs.unix(item.trade_time).format("YYYY/MM/DD HH:mm:ss")}}</span>
						<span v-if="item.status == 0" class="text-blue fs12">待取回</span>
						<span v-else-if="item.status == 1" class="text-blue fs12">已取回</span>
						<span v-else-if="item.status == 2" class="text-blue fs12">取消订单</span>
					</template>
				</shop-item>
			</div>
		</div>
		<div class="d-flex aj-center" style="width: 100%;">
			<el-empty v-if="list.length == 0" description="暂无记录" />
		</div>
		
		<div class="d-flex my-5 justify-center" style="width: 100%;">
		  <el-pagination
		    :page-size="8"
		    :total="total"
		    background
		    hide-on-single-page
		    layout="prev, pager, next"
		    @current-change="currentChange"
		  />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, toRefs, computed } from "vue";
	import ShopItem from '@/components/ShopItem.vue'
	import { UserService } from "@/services/UserService";
	const isMobile = computed(()=>window.innerWidth < 600)
	const state = reactive({
	  list: [],
	  total: null,
	  loading: {
	    list: false,
	  },
	  query: {
		  page: 1,
		  page_size: 8,
		  status: -1,
		  auto_delivery: -1,
	  }
	});
	
	const { list, total } = toRefs(state)
	
	onMounted(() => {
	  getRechargeRecord();
	});
	const getRechargeRecord = async () => {
	  state.loading.list = true;
	  const res = await UserService.getRetrieveRecords(state.query).finally(() => {
	    state.loading.list = false;
	  });
	  state.list = res.data.data.list;
	  state.total = res.data.data.total;
	};
	
	const currentChange = async (val) => {
	  state.query.page = val;
	  const res = await UserService.getRetrieveRecords(state.query);
	
	  state.list = res.data.data.list;
	};
	const initData = () => {
		getRechargeRecord();
	};
	// 向父组件暴露以下方法
	defineExpose({
	    initData
	})
</script>

<style>
</style>