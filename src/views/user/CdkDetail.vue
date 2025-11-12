<template>
  <div class="cdk-detail">
    <div class="cdk-detail-head">
      <h2>CDK详情</h2>
      <v-btn class="back" color="#f3a45d" @click="$router.go(-1)"
        >返回列表</v-btn
      >
    </div>
    <table class="detail-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>卡号</th>
          <th>卡密</th>
          <th>使用状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cdkDetails" :key="item.id">
          <td>{{ item.cdkey_id }}</td>
          <td>{{ item.card_no }}</td>
          <td>{{ item.card_secret }}</td>
          <td>{{ getStatusText(item.is_use) }}</td>
          <!-- 优化：状态文字格式化 -->
        </tr>
      </tbody>
    </table>

    <!-- 【新增】分页组件 -->
    <div class="d-flex py-15 justify-center" v-if="total > page_size">
      <el-pagination
        :current-page="page"
        :page-size="page_size"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 暂无数据提示 -->
    <div class="no-data" v-if="cdkDetails.length === 0 && !loading">
      <span class="text-gray">暂无详情数据</span>
    </div>

    <!-- 加载中提示 -->
    <div class="loading" v-if="loading">
      <span class="text-gray">加载中...</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { CdkService } from "@/services/CdkService";
import { ElMessage } from "element-plus";

const route = useRoute();
const CdkeyId = route.params.id as string; // 获取路由参数中的 CDK ID

// 【新增】分页相关状态
const state = reactive({
  cdkDetails: [] as any[],
  page: 1, // 当前页码
  page_size: 10, // 每页条数
  total: 0, // 总条数
  loading: false, // 加载状态
  is_use: "", // 可选：使用状态筛选（根据接口支持添加）
});

const { cdkDetails, page, page_size, total, loading } = toRefs(state);

// 【新增】状态文字格式化（和列表页保持一致）
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "-1": "全部",
    "1": "已使用",
    disabled: "已禁用",
  };
  return statusMap[status] || status;
};

// 【核心修改】获取详情数据（添加分页参数）
const fetchCdkDetails = async () => {
  state.loading = true;
  try {
    // 调用接口：传递分页参数 + CDK ID + 可选筛选条件
    const res = await CdkService.getDetail({
      page: state.page,
      page_size: state.page_size,
      cdkey_id: CdkeyId, // 可选：根据需要添加筛选条件
    });
    if (res.data.code === 0) {
      state.cdkDetails = res.data.data?.list || []; // 接口返回列表数据
      state.total = res.data.data?.total || 0; // 接口返回总条数
    } else {
      ElMessage.error(res.data.message || "获取详情失败");
    }
  } catch (error: any) {
    console.error("获取CDK详情失败:", error);
    ElMessage.error(error?.response?.data?.message || "网络错误，获取详情失败");
  } finally {
    state.loading = false;
  }
};

// 【新增】分页切换事件
const handlePageChange = (pageNum: number) => {
  state.page = pageNum;
  fetchCdkDetails(); // 切换页码后重新获取数据
};

// 页面加载时获取第一页数据
onMounted(() => {
  const cdkId = route.params.id as string;
  fetchCdkDetails();
});
</script>

<style scoped lang="scss">
.cdk-detail {
  padding: 20px;
  .cdk-detail-head {
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-weight: 500;
    margin: 20px;
    .back {
      float: right;
    }
  }
  .detail-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    th,
    td {
      border: 1px solid #333; // 适配深色主题
      padding: 12px 8px;
      text-align: center;
      color: #fff; // 文字白色
    }
    th {
      background: #222;
      font-weight: 500;
    }
    tr:nth-child(even) {
      background: #17171f;
    }
  }

  // 分页样式（和列表页保持一致）
  .py-15 {
    padding: 15px 0;
  }

  // 暂无数据样式
  .no-data {
    padding: 80px 20px;
    text-align: center;
    color: #99a5b7;
    font-size: 14px;
  }

  // 加载中样式
  .loading {
    padding: 80px 20px;
    text-align: center;
    color: #99a5b7;
    font-size: 14px;
  }

  // 适配移动端
  @media screen and (max-width: 600px) {
    .detail-table {
      overflow-x: auto;
      display: block;
    }
    th,
    td {
      min-width: 100px;
    }
  }
}
</style>
