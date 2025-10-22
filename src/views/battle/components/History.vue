<template>
	<div style="min-height: 800px;">

		<div class="mb-4">
			<v-btn-toggle :style="{height: isMobile?'32px':'48px' }" v-model="state.active" color="#f3a45d">
				<v-btn :width="isMobile?'96':'110'"  :height="isMobile?'32':'40'" class="radiobtn" :value="0">对战记录</v-btn>
				<v-btn :width="isMobile?'96':'110'"  :height="isMobile?'32':'40'" class="radiobtn" :value="1">我的记录</v-btn>
			</v-btn-toggle>
		</div>
		<el-table class="history-table m-history-table" stripe empty-text="暂无对战记录" :data="histroy" v-loading="loading">
		  <el-table-column label="时间" prop="battle_time" :width="isMobile ? 90 : 180">
		    <template #default="scope">
		      {{ $dayjs.unix(scope.row.battle_time).format("YYYY-MM-DD HH:mm:ss") }}
		    </template>
		  </el-table-column>
		  <el-table-column label="玩家" :width="isMobile ? 100 : 190">
		    <template #default="scope">
		      <div class="user-avatars">
		        <el-tooltip v-for="user in scope.row.battle_users" :content="user.nickname">
		          <img v-if="user.winner !== 1" :src="user.avatar" alt="" />
		          <div v-else class="user-winner">
		            <img :src="user.avatar" alt="" />
		          </div>
		        </el-tooltip>
		      </div>
		    </template>
		  </el-table-column>
		  <el-table-column label="盲盒信息" :width="isMobile ? 80 : void 0">
		    <template #default="scope">
		      <el-badge v-if="isMobile" :value="3" class="box-skins">
		        <img :src="scope.row.battle_boxs[0].image_url" />
		        <img :src="scope.row.battle_boxs[0].box_cover" class="box-cover" />
		      </el-badge>
			  <div v-else class="box-skins">
					<div v-for="skin in scope.row.battle_boxs" class="box-item">
						<img :src="skin.image_url" />
						<img :src="skin.box_cover" class="box-cover" />
					</div>
			  </div>
			  
		    </template>
		  </el-table-column>
		  <el-table-column label="对战积分" prop="integral" :width="isMobile ? 80 : 100">
		    <template #default="scope">
				<div class="coin-number">
					<img style="width: 14px;" src="@/assets/img/bos/douzi.svg" />
		            {{ processScore(scope.row.integral) }}
				</div>
		    </template>
		  </el-table-column>
		  <el-table-column label="花费" prop="spend" :width="isMobile ? 90 : 100">
		    <template #default="scope">
		      <div class="coin-number">
		        <img src="@/assets/img/bos/douzi.svg" />
		        {{ processScore(scope.row.spend) }}
		      </div>
		    </template>
		  </el-table-column>
		  <el-table-column width="70">
		    <template #default="scope">
		      <div class="py-3">
				  
				  <span class="cursor" style="color: #99A5B7;" @click="handleToBattleDetail(scope.row)">{{ status2str(scope.row.status) }}</span>
		       
		      </div>
		    </template>
		  </el-table-column>
		</el-table>
		

		<div class="el-pagination-wrapper">
		  <el-pagination
		    background
		    :total="total"
		    :page-size="query.page_size"
		    @current-change="getHistory"
		    v-model:current-page="query.page"
		    :pager-count="isMobile ? 5 : void 0"
		    :layout="isMobile ? 'prev, pager, next' : 'prev, pager, next, jumper, ->, total'"
		  ></el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		ref,
		toRefs,
		reactive,
		onMounted,
		watch,
		computed
	} from 'vue'
	// import BattleItem from '@/components/battleItem.vue'
	import BattleService from "@/services/BattleService";
	import {
		processImageUrl
	} from "@/utils";
	import {
		processRobot,
		status2str,
		processScore
	} from "../util";
	import {
		useRouter,
		useRoute
	} from "vue-router";
	const router = useRouter();
	const route = useRoute();
	 const isMobile = computed(()=>window.innerWidth < 600)
	const state = reactive({
		query: {
			page: 1,
			page_size: 12,
		},

		loading: false,
		total: 0,
		histroy: [],
		active: 0,
	});
	const historyType = ref('1');

	const {
		histroy,
		loading,
		query,
		total,
		active
	} = toRefs(state)
	
	watch(active, (newValue, oldValue) => {
		state.active = newValue;
		state.histroy = [];
		state.query.page = 1;
		getHistory();
	})

	const handleToBattleDetail = (row) => {
		router.push(`/battle-detail/${row.room_id}?for=history`);
	};

	function setItemBg(status) {
		let className = '';
		if (status == 2) {
			className = 'statusbg2'
		} else if (status == 1) {
			className = 'statusbg1'
		}
		return className
	}
	const getHistory = () => {
		state.loading = true;
		const method = (state.active === 0 ? "all" : "my") + "History";

		return BattleService[method](state.query)
			.then((response) => {
				
				let total = response.data.data.total;
				let list = response.data.data.list || [];

				state.histroy = list.map((item) => ({
					...item.battle_record,
					battle_users: item.battle_users
						.map((user) => ({
							...user,
							avatar: user.avatar ? processImageUrl(user.avatar) : user.avatar,
						}))
						.map(processRobot),
					battle_boxs: item.battle_boxs.map((box) => ({
						...box,
						image_url: processImageUrl(box.image_url),
						box_cover: processImageUrl(box.box_cover),
					})),
				}));

				state.total = total>72? 72: total;
				return response;
			})
			.finally(() => {
				state.loading = false;
			});
	};
	const initData = () => {
		state.histroy = [];
		state.query.page = 1;
		getHistory();
	}
	// 向父组件暴露以下方法
	defineExpose({
		initData
	})
	onMounted(() => {
		getHistory();
	});
</script>

<style lang="scss" scoped>
	.battle-history {
	  max-width: 1520px;
	  margin: 50px auto 0 auto;
	  padding: 0 30px;
	}
	
	.battle-history-header {
	  display: flex;
	  margin-bottom: 22px;
	  align-items: center;
	  position: relative;
	
	  > * {
	    &:last-child {
	      // margin-left: auto;
	      position: absolute;
	      top: 50%;
	      right: 0;
	      transform: translateY(-50%);
	    }
	  }
	}
	
	.history-tabs {
	  font-size: 18px;
	  text-align: center;
	  display: flex;
	
	  > div {
	    width: 122px;
	    line-height: 50px;
	    border: 1px solid rgba(255, 255, 255, 0.5);
	    cursor: pointer;
	
	    &:first-child {
	      border-radius: 5px 0px 0px 5px;
	      border-right: none;
	    }
	
	    &:last-child {
	      border-radius: 0px 5px 5px 0px;
	      border-left: none;
	    }
	
	    &.active {
	      background: #8e7eed;
	      color: #ffffff;
	      border-color: transparent;
	    }
	  }
	}
	
	.user-avatars {
	  display: flex;
	  flex-wrap: wrap;
	  align-items: center;
	
	  > img,
	  > div {
	    flex: none;
	    // margin-left: -8px;
	
	    &:nth-child(1) {
	      margin-left: 0;
	    }
	  }
	
	  > div {
	    width: 50px;
	    height: 50px;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	
	    &.user-winner {
	      position: relative;
	      // border: 2px solid rgba(255, 170, 0, 1);
	      border-radius: 50%;
	      &::before {
	      	content: "";
	      	position: absolute;
	      	width: 40px;
			height: 40px;
			bottom: -10px;
	      	background: url('@/assets/img/bos/win.png');
	      	background-size: 100%;
	      	background-size: 100%;
	      }
	      
	    }
	  }
	
	  img {
	    border-radius: 50%;
	    width: 40px;
	    height: 40px;
	  }
	}
	
	.box-skins {
		position: relative;
	  display: flex;
	  flex-wrap: wrap;
	  align-items: center;

		.box-item {
			position: relative;
		}

		.box-cover {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}
	
	  img {
			position: relative;
			z-index: 1;
	    width: 40px;
	    margin-right: 6px;
	    margin-bottom: 2px;
	  }
	}
	
	.coin-number {
	  display: flex;
	  align-items: center;
	  font-size: 12px;
	  color: #FFB300;
	
	  img {
	    width: 14px;
	    margin-right: 6px;
	  }
	}
	
	.detail-btn {
	  &:hover {
	    transform: scale(1.1);
	  }
	}
	
	.el-pagination-wrapper {
	  text-align: center;
	  margin-top: 10px;
	  padding: 20px 0;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	
	.battle-history {
	  .el-table {
	    color: #fff;
	
	    th,
	    tr,
	    td {
	      background: #28253b;
	      border: none;
	    }
	  }
	
	  .el-table__body-wrapper {
	    background: #28253b;
	  }
	
	  .el-table__row--striped {
	    th,
	    tr,
	    td {
	      background: rgba(255, 255, 255, 0.04) !important;
	      border: none;
	    }
	  }
	
	  .el-table--enable-row-hover .el-table__body tr:hover > td {
	    background: rgba(255, 255, 255, 0.1) !important;
	  }
	}
	
	@media screen and (max-width: 600px) {

		.user-avatars > div.user-winner[data-v-3896ef88]::before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    bottom: -6px;
    background: url(/src/assets/img/bos/win.png);
    background-size: 100%;
    background-size: 100%;
}
	  .battle-history {
	    padding: 0 6px;
	
	    .battle-history-header {
	      margin-bottom: 16px;
	      justify-content: center;
	    }
	
	    .history-tabs {
	      > div {
	        width: 116px;
	        line-height: 32px;
	        font-size: 13px;
	        border-color: rgba(255, 255, 255, 0.5);
	
	        &.active {
	          border-color: transparent;
	        }
	      }
	    }
	  }
	
	  .user-avatars {
	    img,
	    > div {
	      width: 24px;
	      height: 24px;
	    }
	  }
	
	  .box-skins {
	    min-width: 200px;
	
	    img {
	      width: 25px;
	    }
	  }
	
	  .el-table {
	    font-size: 12px;
	  }
	}

	.radiobtn {
		border: 1px solid #F4F4F4 !important;
		background-color: #F4F4F4;
		border-radius: 0px;
	}
	
	.v-btn--selected.radiobtn {
		border: none !important;
	}
	@media screen and (max-width: 600px) { 
	        .m-history-table{
				margin-left: -8px;
				margin-right: -8px;
				width: auto !important;
				max-width: inherit !important;
			}
			
	    }
	
</style>
