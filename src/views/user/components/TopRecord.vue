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
		  <el-table-column label="目标饰品" prop="target_skin_name"></el-table-column>
		  <el-table-column label="获得饰品" prop="item_name" min-width="100"></el-table-column>
		
		  <el-table-column label="升级概率">
		    <template #default="scope">{{ scope.row.range }}%</template>
		  </el-table-column>
		
		  <!-- <el-table-column label="落点值" prop="point"></el-table-column> -->
		
		  <el-table-column label="花费" align="center" prop="amount">
		    <template v-slot="scope">
		      <div class="d-flex align-center justify-center">
		        <!-- <img src="@/assets/img/icon/diamonds.png" class="mr-1" /> -->
		        {{ scope.row.amount }}
		      </div>
		    </template>
		  </el-table-column>
		
		  <el-table-column label="状态">
		    <template #default="scope">
		      <span class="status-success" v-if="scope.row.is_success">升级成功</span>
		      <span class="status-fail" v-else>升级失败</span>
		    </template>
		  </el-table-column>
		
		  <el-table-column label="升级时间" align="center" width="160">
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
        keyword: "",
        is_success: -1,
      });
	
	const { list , total} = toRefs(state)
	
	onMounted(() => {
	  getList();
	});
	const getList = async () => {
	  state.loading = true;
	  const res = await TopService.getUpgradeRecord(query).finally(() => {
	    state.loading = false;
	  });
	  state.list = res.data.data.list;
	  state.total = res.data.data.total;
	};
	
	const currentChange = async (val) => {
	  state.currentPage = val;
	  const res = await TopService.getUpgradeRecord({
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