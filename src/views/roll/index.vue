<template>
    <div class="bigbg">
        <div class="v-container m-v-container">
            <!-- <roll-tabs ref="tabs" @change="getRoomList"></roll-tabs> -->

            <roll-handler ref="rollHandler" @create="isShowCreateRoomDialog = true" @fetch="getRoomList"
                @search="getRoomList"></roll-handler>
            <div class="mt-3">
                <div class="rolls-tabs">
                    <div @click="changeRoomType(0)" class="tab-btn" :class="room_type==0?'active':''">官方</div>
                    <div @click="changeRoomType(1)" class="tab-btn" :class="room_type==1?'active':''">主播</div>
                </div>
                <room-list :list-data="listData" v-show="!loading.list"></room-list>
            </div>
            <create-room-dialog v-model="isShowCreateRoomDialog" @close="isShowCreateRoomDialog = false"
                @refresh="getRoomList"></create-room-dialog>
            <!-- loading -->
            <div   class="roll-loading justify-center align-center" v-show="loading.list">
                <i class="el-icon-loading mr-2"></i>
                <span class="text-white"> 正在加载中</span>
            </div>
            <!-- error -->
            <div  class="roll-loading d-flex justify-center align-center"
                v-if="!listData.length && !loading.list">
                <el-result icon="info">
                    <template #title>
                        <span class="text-white">暂无数据</span>
                    </template>
                </el-result>
            </div>

            <div class="d-flex py-5 justify-center" style="margin-bottom: 20px;">
                <el-pagination :page-size="query.page_size" :total="total" background layout="prev, pager, next"
                    @current-change="onPageChange" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from "vue";
import RollTabs from "./components/RollTabs.vue";
import RollHandler from "./components/RollHandler.vue";
import RoomList from "./components/RoomList.vue";
import { RollService } from "@/services/RollService";
import CreateRoomDialog from "./components/CreateRoomDialog.vue";
import { RoomItem } from "@/types/roll";
import { processImageUrl, processRoomItem } from "@/utils";
import { useStore } from "@/store";

export default defineComponent({
    setup() {
        const listData: RoomItem[] = [];
        const store = useStore();

        return {
            listData: ref(listData),
            total: ref(0),
            isShowCreateRoomDialog: ref(false),
            token: computed(() => store.getters.token),
            loading: reactive({
                list: false,
            }),
            lastRequestTimestamp: -1,
            room_type: ref(0),// 0官方 1主播
            error: ref(false),
            query: reactive({
                page: 1,
                page_size: 40,
            }),
        };
    },

    components: {
        RollTabs,
        RollHandler,
        RoomList,
        CreateRoomDialog,
    },

    methods: {
        changeRoomType(type) {
            this.room_type = type;
            this.getRoomList();
        },
        getRoomList() {
            const data = this.getData();

            this.loading.list = true;
            const requestTimestamp = (this.lastRequestTimestamp = Date.now());

            RollService.getRoomList(data.formData, data.token, this.query)
                .then((res) => {
                    if (requestTimestamp !== this.lastRequestTimestamp) {
                        return;
                    }

                    const { list, total } = res.data.data;
                    const _list = list.map(processRoomItem);

                    this.listData = _list;
                    this.total = total;
                })
                .finally(() => {
                    this.loading.list = false;
                });
        },

        getData() {
            const handlerRef = this.$refs.rollHandler as any;

            const handlerData = handlerRef.getData();

            return {
                formData: {
                    ...handlerData.formData,
                    room_type: this.room_type,
                    sort: "prize_pool",
                    order: "desc",
                },

                token: handlerData.token,
            };
        },

        onPageChange() {
            this.query.page++;
            this.getRoomList();
        },
    },

    mounted() {
        this.getRoomList();
    },
});
</script>

<style lang="scss">
.rolls-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;

    .tab-btn {
        cursor: pointer;
        width: 183px;
        height: 36px;
        text-align: center;
        border-radius: 8px;
        // background-color: #4782f5;
        color: #fff;
        line-height: 36px;
        margin: 0 -8px;
        opacity: 0.6;
        &.active{
            opacity: 1;
        }

        &:nth-child(2) {
            background-color: #1a1b25;
            color: #ffffff;
        }

        &:nth-child(1) {
            // background-color: #f6d6d6;
            color: #ffffff;
            background: linear-gradient(-65deg, transparent 20px, #f3a55e 0) top right;
        }

        &:nth-child(2) {
            // background-color: #f6d6d6;
            color: #EB4B4B;
            background: linear-gradient(115deg, transparent 20px, #f6d6d6 0) top right;
        }
    }
}

.roll {
    width: 80%;
    max-width: 1500px;
    margin: 6rem auto 0 auto;
}

.roll-loading {
    font-size: #fff;
    min-height: 300px;
    font-size: 20px;
    display: flex;
}

@media screen and (max-width: 768px) {
    .roll {
        width: 95%;
    }

    .roll-loading {
        min-height: 100px;
    }

    .m-v-container {
        // padding-left: 8px !important;
        // padding-right: 8px !important;
    }
}</style>
