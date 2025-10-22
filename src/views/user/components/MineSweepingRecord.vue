<template>
	<div>
		<el-table
		   style="font-size: 12px;"
		  :data="list"
		  cell-class-name="custom-row"
		  header-row-class-name="custom-row"
		  header-cell-class-name="custom-header"
		  :empty-text="loading ? '数据加载中' : '暂无数据'"
		>
		  <el-table-column label="饰品名称" prop="skin_name"></el-table-column>
		  <el-table-column label="层数" prop="layer"></el-table-column>
		  <el-table-column label="状态">
		    <template #default="scope">
		      <span class="status-success" v-if="scope.row.success">成功</span>
		      <span class="status-fail" v-else>失败</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="时间" align="center" width="160">
		    <template
		      v-slot="scope"
		    >{{ $dayjs.unix(scope.row.updated_at).format("YYYY-MM-DD HH:mm:ss") }}</template>
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
    import MinesweepingService from "@/services/MinesweepingService";
	import TopService from "@/services/TopService";
	const isMobile = computed(()=>window.innerWidth < 600)
	const state = reactive({
	  list: [],
	  total: null,
	  loading: false
	});
	
	const query = reactive({
        page: 1,
        page_size: 10,
      });
	
	const { list , total} = toRefs(state)
	
	onMounted(() => {
	  getList();
	});
	const getList = async () => {
	  state.loading = true;
	  const res = await MinesweepingService.getMyRecord(query).finally(() => {
	    state.loading = false;
	  });
	  state.list = res.data.data.list;
	  state.total = res.data.data.total;
	};
	
	const currentChange = async (val) => {
	  state.currentPage = val;
	  const res = await MinesweepingService.getMyRecord({
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
	.status-success{
		color: #a3e7a1;
	}
	.status-fail{
		color: #ff0000;
	}
	.pagination-wrapper{
		display: flex;
		justify-content: center;
	}
</style>