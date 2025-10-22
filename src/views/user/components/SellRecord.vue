<template>
	<div class="d-flex" style="flex-wrap: wrap; margin-right: -8px; margin-left: -8px; margin-top: -8px;">
		<div v-for="(item, index) in list" :key="index" :style="isMobile ? 'width:50%;' : 'width:25%;'">
			<div class="px-2 py-2">
				<shop-item :rarity="false" :item="item">
					<template #btns>
						<span class="text-muted fs12">
							{{  $dayjs.unix(item.created_at).format("YYYY-MM-DD")  }}
						</span>
						<span class="text-yellow fs12">已兑换{{  item.price  }}</span>
					</template>
				</shop-item>
			</div>
		</div>
		<div class="d-flex my-5 justify-center" style="width: 100%;">
			<el-pagination :page-size="page_size" :total="total" background hide-on-single-page layout="prev, pager, next"
				@current-change="currentChange" />
		</div>
		<div class="d-flex aj-center" style="width: 100%;">
			<el-empty v-if="list.length == 0" description="暂无记录" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, toRefs, computed } from "vue";
import { BackpackService } from "@/services/BackpackService";
import ShopItem from '@/components/ShopItem.vue'
const isMobile = computed(() => window.innerWidth < 600)
const state = reactive({
	list: [],
	total: null,
	currentPage: 1,
	loading: {
		list: false,
	},
	page_size: 12
});
const { list, total } = toRefs(state)
const sellRecord = async () => {
	state.loading.list = true;
	const res = await BackpackService.sellRecord({
		page: state.currentPage,
		page_size: state.page_size
	}).finally(() => {
		state.loading.list = false;
	});
	state.list = res.data.data.list;
	state.total = res.data.data.total;
};

const currentChange = async (val) => {
	state.currentPage = val;
	const res = await BackpackService.sellRecord({
		page: val,
		page_size: state.page_size
	});

	state.list = res.data.data.list;
};

onMounted(() => {
	sellRecord();
});
</script>

<style>
</style>