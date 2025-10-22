<template>
    <div class="record">
        <div class="toptit">当月累计签到 <span>{{ count_days }}</span> 天</div>
        <div class="mb-4">
            <QTitle v-if="!isMobile" class="bg1" title="累计签到可获得">
                <template #desc>
                    <span @click="popupRef.open()" class="game-rules-btn">签到规则</span>
                </template>
            </QTitle>
            <div v-else class="wd-mtitle">
                <span>累计签到可获得</span>
            </div>

        </div>
        <el-table :data="signinConfigList" cell-class-name="custom-row" header-row-class-name="custom-row"
            header-cell-class-name="custom-header" :empty-text="loading ? '数据加载中' : '暂无数据'">
            <el-table-column label="条件（等级/累充）" prop="point">
                <template v-slot="scope">
                    <template v-for="(item, index) in scope.row.condition">
                        <!-- <span>{{ item.type == 'level' ? `${item.name}${item.value}` : `${item.value}${item.name}`}}</span> -->
                        <span>{{ item.name }}{{ item.value }}</span>

                        <span class="ml-1 mr-1" v-if="index != scope.row.condition.length - 1">/</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="累计签到次数" prop="days">
                <template v-slot="scope">
                    <span class="td-text">{{ scope.row.days }}</span>
                </template>
            </el-table-column>
            <el-table-column label="奖励" prop="point">
                <template v-slot="scope">
                    <div v-for="(item, index) in scope.row.reward" :key="index">
                        <span v-if="item.type == 'key'" class="td-text">{{ item.name }}X1</span>
                        <span v-else class="td-text">{{ item.name }}X{{ item.value }}</span>
                    </div>
                </template>
            </el-table-column>

        </el-table>




        <div class="mt-8 mb-4">
            <QTitle v-if="!isMobile" class="bg1" title="每天签到详情"></QTitle>
            <div v-else class="wd-mtitle">
                <span>每天签到详情</span>
            </div>
        </div>
        <el-table :data="singList" :empty-text="loading.list ? '数据加载中' : '暂无数据'" cell-class-name="custom-row"
            header-row-class-name="custom-row" header-cell-class-name="custom-header">
            <el-table-column label="签到次数" prop="days">
            </el-table-column>
            <el-table-column label="日期" prop="date">
            </el-table-column>
            <el-table-column label="状态" prop="point">
                <template v-slot="scope">
                    <span v-if="scope.row.is_sign" class="td-text">已签到</span>
                    <span v-else class="td-text">未签到</span>
                </template>
            </el-table-column>

        </el-table>

        <!-- <div class="mt-8">规则说明</div> -->
        <!-- <div class="mt-2" style="line-height: 1.8em; font-size: 15px;">
            <p>1.等级箱子为4fskins为用户提供充值流水的额外福利，通过充值获取经验来提升等级。</p>
            <p>2.到达对应等级即可获得等级钥匙奖励。</p>
            <p>3.等级划分</p>
            <p>4.理性消费，适度娱乐，生活远比网站更精彩。</p>
            <p>5.本活动最终解释权归本站所有。</p>
        </div> -->
        <!-- <div class="d-flex my-5 justify-center">
            <el-pagination :page-size="10" :total="total" hide-on-single-page background layout="prev, pager, next"
                @current-change="currentChange" />
        </div> -->

        <q-popup :showFooter="false" title="签到规则" :width="isMobile ? '90%' : '540px'" ref="popupRef">
            <div class="fs14 py-6 px-4">
            <p class="mb-2" style="color: #333333; font-size: 13px;">1、累计签到天数每月重置。</p>
            <p class="mb-2" style="color: #333333; font-size: 13px;">2、签到奖励发放以签到当时是否满足所有条件为准，后补足条件不予补发。</p>
            <div class="mb-2" style="color: #333333; font-size: 13px;">
            
               <p>3、每月签到详情</p> 
               <div style="padding-left: 20px;">
                    <p>当你等级lv.0 每月累计签到7天可领取（黑铁钥匙）</p> 
                    <p>每月累计签到7天并且7天内累计充值100可领取20金币。</p> 
                    <p>每月累计签到14天并且14天内累计充值500可领取（白金钥匙）</p> 
                    <p>当你等级达到lv.30每月累计签到14天可领取（青铜钥匙）</p> 
                    <p>每月累计签到21天并且21天内累计充值1000可领取（黄金钥匙）</p> 
                    <p>当你等级达到lv.40每月累计签到21天可领取（白银钥匙）</p> 
                    <p>每月累计签到28天并且28天内累计充值3000可领取（至尊钥匙）</p> 
                    <p>当你等级达到lv.50每月累计签到28天可领取（钻石钥匙）</p> 
                    <p>如果你等级已经达到lv.50那么你每月无需充值，签到28天即可领取4把钥匙</p> 
                </div>
            
            </div>
            <p class="mb-2" style="color: #333333; font-size: 13px;">
                4、达到条件后即可去首页钥匙箱子分类开启对应箱子
            </p>

            
            </div>
        </q-popup>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import SignService from "@/services/SignService";
import { ElNotification } from 'element-plus'
import { emitter } from "@/libs";
import QTitle from '@/components/QTitle.vue'
import QPopup from '@/components/QPopup.vue'
const isMobile = computed(() => window.innerWidth < 600)
const state = reactive({
    count_days: 0,
    singList: [],
    signinConfigList: [],
});
const { count_days, singList, signinConfigList } = toRefs(state);
const popupRef = ref(null);
const isSing = ref(false);
const getSignInfo = async () => {
    const getSign = await SignService.getSign();
    let res = getSign.data;
    if (res.code == 0) {
        state.count_days = res.data.count_sign_days;
        state.singList = res.data.signs;
        isSing.value = state.singList[0].is_sign
    }
}

const getSigninConfig = async () => {
    const getSign = await SignService.signinConfig();
    let res = getSign.data;
    if (res.code == 0) {
        state.signinConfigList = res.data.list;
    }
}

emitter.on("getSign", () => {
    getSignInfo();
})
const postSign = async () => {
    const postSign = await SignService.postSign();
    const res = postSign.data;
    console.log(res)
    if (res.code == 0) {
        ElNotification({
            title: '',
            message: '签到成功',
            type: 'success',
        })
    }
    getSignInfo();
}

onMounted(() => {
    getSignInfo();
    getSigninConfig();
})

const loading = ref(false);

</script>


<style lang="scss">
.td-span {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.toptit {
    padding: 10px 0;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
    color: #ffffff;

    span {
        font-size: 40x;
        color: #FFC400;
    }
}
.game-rules-btn {
        padding-left: 16px;
        font-size: 12px;
        color: #999;
        background-image: url('@/assets/img/bos/icon_help.png');
        background-size: 13px;
        background-position: center left;
        right: 20px;
        cursor: pointer;
    }
</style>

<style lang="scss">
@media screen and (max-width: 768px) {
    .el-table th.el-table__cell>.cell {
        font-size: 10px;
    }
}
</style>
