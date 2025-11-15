<template>
  <div>
    <div v-show="!isMobile" class="d-flex a-center space-between mb-6">
      <div
        v-if="$route.path === '/user/cdk'"
        class="flex-1 text-white"
        style="font-size: 22px"
      >
        我的CDK
      </div>
      <v-btn
        v-if="$route.path === '/user/cdk'"
        style="border-radius: 10px"
        @click="showGenerateDialog = true"
        color="#f3a45d"
        height="36"
        elevation="0"
      >
        <span class="fs14 text-white">生成CDK</span>
      </v-btn>
    </div>

    <!-- <div v-if="$route.path === '/user/cdk'" class="wd-mtitle">
      <span>我的CDK</span>
      <v-btn
        v-if="isMobile"
        style="border-radius: 10px"
        @click="showGenerateDialog = true"
        color="#f3a45d"
        height="36"
        elevation="0"
        class="ml-4"
      >
        <span class="fs14 text-white">生成CDK</span>
      </v-btn>
    </div> -->
    <router-view />
    <!-- CDK表格 -->
    <div class="cdk-table-wrapper mt-6" v-if="$route.path === '/user/cdk'">
      <div class="table-header">
        <v-row class="fs12">
          <v-col cols="1" class="tc">ID</v-col>
          <v-col cols="2" class="tc">CDK名称</v-col>
          <v-col cols="2" class="tc">价值</v-col>
          <v-col cols="1" class="tc">数量</v-col>
          <v-col cols="2" class="tc">状态</v-col>
          <v-col cols="2" class="tc">创建时间</v-col>
          <v-col cols="2" class="tc">操作</v-col>
        </v-row>
      </div>
      <div v-if="cdkList.length > 0">
        <div
          v-for="(item, index) in cdkList"
          :key="index"
          class="table-row py-3"
        >
          <v-row class="fs14">
            <v-col cols="1" class="tc">
              <span class="text-white">{{ item.id }}</span>
            </v-col>
            <v-col cols="2" class="tc">
              <span class="text-white">{{ item.name || "-" }}</span>
            </v-col>
            <v-col cols="2" class="tc">
              <span class="text-white">{{ item.value || 0 }} 金币</span>
            </v-col>
            <v-col cols="1" class="tc">
              <span class="text-white">{{ item.quantity || 0 }}</span>
            </v-col>
            <v-col cols="2" class="tc">
              <span :class="getStatusClass(item.status)">
                {{ getStatusText(String(item.used)) }}
              </span>
            </v-col>
            <v-col cols="2" class="tc">
              <span class="text-white">{{ formatDate(item.created_at) }}</span>
            </v-col>
            <v-col cols="2" class="tc d-flex justify-center gap-2">
              <v-btn
                style="border-radius: 10px"
                @click="exportCdk(item.id)"
                color="#f3a45d"
                height="30"
                elevation="0"
              >
                <span class="fs14 text-white">导出</span>
              </v-btn>
              <v-btn
                style="border-radius: 10px"
                @click="goTodDetail(item.id)"
                color="#f3a45d"
                height="30"
                elevation="0"
              >
                <span class="fs14 text-white">详情</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else class="no-data">
        <span class="text-gray">暂无数据</span>
      </div>
    </div>

    <!-- 分页 -->
    <div class="d-flex py-15 justify-center" v-if="total > page_size">
      <el-pagination
        :page-size="page_size"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="onPageChange"
      />
    </div>

    <!-- 生成CDK对话框 -->
    <el-dialog
      v-model="showGenerateDialog"
      title="生成CDK"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="generate-form">
        <div class="form-item">
          <label class="form-label">CDK名称</label>
          <el-input
            v-model="generateForm.name"
            placeholder="请输入CDK名称"
            clearable
          />
        </div>
        <div class="form-item">
          <label class="form-label">价值（金币）</label>
          <el-input
            v-model.number="generateForm.amount"
            type="number"
            placeholder="请输入价值"
            clearable
          />
        </div>
        <div class="form-item">
          <label class="form-label">数量</label>
          <el-input
            v-model.number="generateForm.quantity"
            type="number"
            placeholder="请输入数量"
            clearable
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <v-btn
            @click="showGenerateDialog = false"
            variant="outlined"
            color="#99a5b7"
            elevation="0"
          >
            取消
          </v-btn>
          <v-btn
            @click="handleGenerate"
            color="#f3a45d"
            elevation="0"
            :loading="generating"
          >
            确认生成
          </v-btn>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, toRefs } from "vue";
import { CdkService } from "@/services/CdkService";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import * as XLSX from "xlsx";

const store = useStore();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 600);
const token = localStorage.getItem("token");
const state = reactive({
  cdkList: [] as any[],
  page: 1,
  page_size: 10,
  total: 0,
  showGenerateDialog: false,
  generating: false,
  generateForm: {
    name: "",
    amount: 0,
    quantity: 1,
  },
});

const {
  cdkList,
  page,
  page_size,
  total,
  showGenerateDialog,
  generating,
  generateForm,
} = toRefs(state);

onMounted(() => {
  getCdkList();
});

const getCdkList = async () => {
  try {
    const res = await CdkService.list({
      page: state.page,
      page_size: state.page_size,
    });
    if (res.data.code === 0) {
      state.cdkList = res.data.data?.list || [];
      state.total = res.data.data?.total || 0;
    }
  } catch (error: any) {
    console.error("获取CDK列表失败:", error);
    ElMessage.error(error?.response?.data?.message || "获取CDK列表失败");
  }
};

const onPageChange = (pageNum: number) => {
  state.page = pageNum;
  getCdkList();
};

const handleGenerate = async () => {
  if (!state.generateForm.name) {
    ElMessage.warning("请输入CDK名称");
    return;
  }
  if (!state.generateForm.amount || state.generateForm.amount < 0) {
    ElMessage.warning("请输入有效的价值");
    return;
  }
  if (!state.generateForm.quantity || state.generateForm.quantity > 1) {
    ElMessage.warning("请输入有效的数量");
    return;
  }

  state.generating = true;
  try {
    const res = await CdkService.generate(
      state.generateForm,
      () => store.getters.token
    );
    if (res.data.code === 0) {
      ElMessage.success("生成成功");
      state.showGenerateDialog = false;
      state.generateForm = {
        name: "",
        amount: 0,
        quantity: 1,
      };
      getCdkList();
    } else {
      ElMessage.error(res.data.message || "生成失败");
    }
  } catch (error: any) {
    console.error("生成CDK失败:", error);
    ElMessage.error(error?.response?.data?.message || "生成失败");
  } finally {
    state.generating = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这个CDK吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res = await CdkService.delete(id);
    if (res.data.code === 0) {
      ElMessage.success("删除成功");
      getCdkList();
    } else {
      ElMessage.error(res.data.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除CDK失败:", error);
      ElMessage.error(error?.response?.data?.message || "删除失败");
    }
  }
};
const goTodDetail = (CdkeyId: Number) => {
  router.push({ path: `/user/cdk/detail/${CdkeyId}` });
};

//导出功能实现
const exportCdk = async (id: number) => {
  try {
    const exportInfo = await CdkService.exportCdK({
      cdkey_id: id,
      separator: "|",
    });

    ElMessage.success("CDK导出成功");
  } catch (err) {
    const text = await err;
    const cdkList = text.split("\n").filter((item) => item.trim());

    // 构建 Excel 数据结构（表头 + 数据行）
    const excelData = [
      ["CDK兑换码"], // 表头
      ...cdkList.map((cdk) => [cdk]), // 每行一个 CDK
    ];

    // 创建 Excel 工作簿和工作表
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // 设置列宽（优化显示）
    worksheet["!cols"] = [{ wch: 30 }]; // CDK 列宽设为 30，适配长字符串

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, `CDK列表_${id}`);

    // 生成并下载 Excel 文件
    XLSX.writeFile(workbook, `CDK导出_批次${id}_${new Date().getTime()}.xlsx`);
  }
};
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "-1": "全部",
    "0": "未使用",
    "1": "已使用",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    active: "text-green",
    used: "text-gray",
    expired: "text-gray",
    disabled: "text-red",
  };
  return classMap[status] || "text-white";
};

const formatDate = (timestamp: number | string) => {
  if (!timestamp) return "-";
  const date = new Date(
    typeof timestamp === "string" ? timestamp : timestamp * 1000
  );
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style lang="scss" scoped>
.cdk-table-wrapper {
  background: rgba(26, 26, 32, 0.6);
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  width: 900px;
}

.table-header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px 0;
  color: #ffffff;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
}

.no-data {
  padding: 80px 20px;
  text-align: center;
  color: #99a5b7;
  font-size: 14px;
}

.generate-form {
  padding: 20px 0;
}

.form-item {
  margin-bottom: 20px;

  .form-label {
    display: block;
    margin-bottom: 8px;
    color: #99a5b7;
    font-size: 14px;
    font-weight: 500;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}

.text-gray {
  color: #99a5b7;
}

@media screen and (max-width: 600px) {
  .cdk-table-wrapper {
    overflow-x: auto;
    max-width: 100vh;
  }

  .table-header,
  .table-row {
    min-width: 700px;
  }
}
</style>
