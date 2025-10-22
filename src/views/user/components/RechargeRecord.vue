<template>
	<div>
		<el-table
		  style="font-size: 12px;"
		  :data="list"
		  :empty-text="loading.list ? '数据加载中' : '暂无数据'"
		  cell-class-name="custom-row"
		  header-row-class-name="custom-row"
		  header-cell-class-name="custom-header"
		>
		  <el-table-column label="订单号">
		    <template #default="scope">
		      {{ scope.row.order_no }}
		    </template>
		  </el-table-column>
		  <el-table-column label="充值金额">
		    <template #default="scope"> {{ scope.row.amount }} 金币 </template>
		  </el-table-column>
		  <el-table-column label="充值时间">
		    <template #default="scope">
		      {{
		        $dayjs.unix(scope.row.created_at).format("YYYY-MM-DD HH:mm:ss")
		      }}
		    </template>
		  </el-table-column>
		  <el-table-column label="付款方式">
		    <template #default="scope">
		      {{
		        scope.row.pay_method == 1
		          ? "微信"
		          : scope.row.pay_method == 2
		          ? "支付宝"
		          : scope.row.pay_method === 3
		          ? "畅享支付宝"
		          : scope.row.pay_method === 4
		          ? "CDK充值"
		          : scope.row.pay_method === 7
		          ? "支付宝"
		          : scope.row.pay_method
		      }}
		    </template>
		  </el-table-column>
		</el-table>
		<div class="d-flex aj-center" style="width: 100%;">
			<el-empty v-if="list.length == 0" description="暂无记录" />
		</div>
		<div class="pagination-wrapper mt-3 pb-3">
		  <el-pagination
		    v-model:page-size="query.page_size"
		    :total="total"
		    v-model:current-page="query.page"
		    @current-change="getList"
		    hide-on-single-page
		  ></el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, toRefs, computed } from "vue";
	import ShopItem from '@/components/ShopItem.vue'
	import { UserService } from "@/services/UserService";
	import TopService from "@/services/TopService";
	const isMobile = computed(()=>window.innerWidth < 600)
	const state = reactive({
	  list: [],
	  total: null,
	  loading: {
	    list: false,
	  },
	});
	
	const query = reactive({
        page: 1,
        page_size: 10,
        keyword: "",
        is_success: -1,
      });
	
	const { list, loading, total } = toRefs(state)
	
	onMounted(() => {
	  getList();
	});
	const getList = async () => {
	  state.loading.list = true;
	  const res = await UserService.rechargeRecord(query).finally(() => {
	    state.loading.list = false;
	  });
	  state.list = res.data.data.list;
	  state.total = res.data.data.total;
	};
	
	const currentChange = async (val) => {
	  state.currentPage = val;
	  const res = await UserService.rechargeRecord({
	    page: val,
	  });
	
	  state.list = res.data.data.list;
	};
	const initData = () => {
		getList();
	};
	// 向父组件暴露以下方法
	defineExpose({
	    initData
	})
</script>

<style>
</style>