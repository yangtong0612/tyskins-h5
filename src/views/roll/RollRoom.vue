<template>
    <div class="roll-bigbg">
        <v-container class="container-top-box">
            <div class="detailt-topbox">
                <div class="pl-12 flex-1">
                    <div class="d-flex a-center">
                        <div class="mr-3">
                            <v-avatar size="56">
                                <img style="width: 100%;" :src="detail.avatar" alt="">
                            </v-avatar>
                        </div>
                        <div class="flex-1">
                            <div class="fs18 mb-2">
                                {{ detail.room_name }} <span class="fs14 text-99A5B7 ml-2" v-if="isShowAuditTips">房间审核中</span>
                            </div>
                            <div class="text-99A5B7 fs12">
                                开奖时间：{{ $dayjs.unix(detail.lottery_time).format("YYYY-MM-DD HH:mm:ss") }}
                            </div>
                        </div>
                    </div>
                    <div class="text-B4B4B4 fs13 mt-8"><span>限时充值门槛：{{ detail.recharge_amount }}</span> <span class="ml-12">最大参与人数：{{ detail.max_join_num }}人</span></div>
                    <div class="text-B4B4B4 fs13 mt-4 roomdesc">
                        <span v-if="detail.user_grade>0">等级≥{{detail.user_grade}}；</span> {{ detail.room_desc }}
                    </div>
                </div>

                <div class="pr-8 btns-boxs">
                    <template v-if="isShowJoinRoomButton">
                        <v-btn style="border-radius: 10px;" v-if="detail.is_password_room" @click="handleJoinRoom" elevation="0" color="#f3a45d">
                            <el-icon style="position: relative; top: 2px;" v-if="detail.is_password_room">
                                <Lock />
                            </el-icon><span class="ml-1">加入房间</span>
                        </v-btn>
                        <v-btn v-else @click="handleJoinRoom" elevation="0" color="#FFAA00">
                            <span class="text-white">加入房间</span>
                        </v-btn>
                    </template>
                    <!-- <div v-if="isShowEditButton">
                        <v-btn @click="handleEditRoom" elevation="0" color="#f3a45d">
                            <span>编辑房间</span>
                        </v-btn>
                        <v-btn class="ml-3" @click="handleCancelRoom" elevation="0" color="#FFAA00"><text class="text-white">取消房间</text></v-btn>
                    </div> -->
                    <p class="mt-2 fs12 text-fff50" v-if="detail.reject_reason">
                        审核失败：{{ detail.reject_reason }}
                    </p>
                </div>
                <div v-if="detail.lottery_status === 0"></div>
                <div v-else class="pr-8">
                    活动已结束
                </div>
            </div>
        </v-container>
        <v-container class="container-box">
            <template v-if="detail.skin_list">
                <div class="title-box">
                    <QTitle v-if="!isMobile" class="bg1" title="奖池奖品"></QTitle>
                    <div class="wd-mtitle">
                        <span>奖池奖品</span>
                    </div>
                    <div class="title-right">
						<div class="text-gray fs13">共有{{ detail.award_num }}件</div>
						<div class="text-yellow fs13 ml-10">总价值：{{ detail.prize_pool }} 钻石</div>
						<!-- <v-btn elevation="0" class="ml-3" size="small" @click="handlePushSkin" v-if="isShowPushSkinButton">存入饰品
						</v-btn> -->
					</div>
                </div>
                <div>
                    <div class="d-flex" style="flex-wrap: wrap; margin-left: -8px; margin-right: -8px; margin-top: -10px;">
                        <div class="skin-item-box" v-for="(item, index) in detail.skin_list" :key="index">
                            <div class="px-2 py-2">
                                <div class="relative">
                                    <skin-item :item="item"></skin-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="detail.lottery_status !== 0">
                <div class="title-box mt-3">
                    <QTitle class="bg2" title="中奖记录"></QTitle>
                    <div class="title-right">
						<div class="text-gray fs13">已送出{{ detail.winning_users.length }}件饰品</div>
                        <div class="text-yellow fs13 ml-10">价值：{{ totalPrice }} 钻石</div>
					</div>
                </div>
                <skin-list :is-plain="detail.lottery_status === 0" :skin-list="detail.winning_users"></skin-list>
            </template>

            <div class="title-box mt-3">
                <QTitle class="bg2" title="参与用户"></QTitle>
                <div style="color: #f3a45d;" class="title-right">共计{{ detail.join_users.length }}人</div>
            </div>
            <div>
                <div class="d-flex" style="flex-wrap: wrap;">
                    <v-row>
                        <v-col cols="4" sm="2" lg="2" v-for="(item, index) in detail.join_users" :key="index">
                            <div class="
									d-flex
									flex-column
									justify-space-between
									align-center
									skin-item
								">
                                <v-avatar size="100" style="border: 1px solid #ffffff;">
                                    <img style="width: 100%;" :src="processImageUrl(item.avatar)" alt="">
                                </v-avatar>
                                <div class="mt-2 text-white">{{ item.nickname }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>

        </v-container>

        <choose-skin-dialog ref="skinDialog" :room-id="roomId" @close="getRoomDetail"></choose-skin-dialog>

        <confirm-box ref="confirmBox"></confirm-box>

        <edit-room-dialog v-model="isShowEditDialog" @close="isShowEditDialog = false" ref="editRoomDialog" :room-id="roomId" @refresh="getRoomDetail"></edit-room-dialog>
    </div>
</template>

<script lang="ts">
import { RollService } from "@/services/RollService";
import { RoomDetail } from "@/types/roll";
import SkinItem from "./components/SkinItem.vue";
import { processImageUrl, processRoomItem } from "@/utils";
import { useStore } from "@/store";
import QTitle from "@/components/QTitle.vue";
import { defineComponent, ref, computed } from "vue";
import SkinList from "./components/SkinList.vue";
import CircleItem from "@/components/CircleItem.vue";

import ChooseSkinDialog from "./components/ChooseSkin/Dialog.vue";
import { RouteLocationNormalized, useRoute, useRouter } from "vue-router";

// Todo: 转公共组件
import ConfirmBox from "../user/backpack/components/ConfirmBox.vue";
import EditRoomDialog from "./components/CreateRoomDialog.vue";

let routeFrom: RouteLocationNormalized;

export default defineComponent({
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        return {
            detail: ref<Partial<RoomDetail>>({
                skin_list: [],
                join_users: [],
                winning_users: [],
                prize_pool: 0,
            }),
            userInfo: computed(() => store.getters.userInfo),
            roomId: Number(route.params.id),
            router,
            route,
            isShowEditDialog: ref(false),
            password: ref(""),
            processImageUrl,
            isMobile: computed(() => window.innerWidth < 600),
        };
    },

    methods: {
        getRoomDetail() {
            RollService.getRoomDetail(this.roomId).then((res) => {
                this.detail = processRoomItem(res.data.data);
                this.detail.join_users = this.detail.join_users.map((item) => ({
                    ...item,
                    avatar: processImageUrl(item.avatar),
                }));
                this.detail.winning_users = this.detail.winning_users.map(
                    (item) => ({
                        ...item,
                        avatar: processImageUrl(item.avatar),
                    })
                );
                this.autoOpenDialog();
                // for (let i = 0; i < 100; i++) {
                //   this.detail.join_users.push(this.detail.join_users[0]);
                // }
            });
        },

        handleJoinRoom() {
            if (this.detail.is_password_room) {
                this.$refs.confirmBox
                    .showInput("请输入密码")
                    .then((password) => {
                        this.password = password;
                        this.joinRoom();
                    });
                return;
            }

            this.joinRoom();
        },

        joinRoom() {
            RollService.joinRoom({
                free_room_id: this.detail.id as number,
                password: this.password,
            }).then(() => {
                this.$notify.success("加入房间成功");
                this.getRoomDetail();
            });
        },

        formatTime(t: number) {
            return this.$dayjs.unix(t).format("YYYY-MM-DD HH:mm:ss");
        },

        handlePushSkin() {
            if (this.detail.skin_list?.length >= this.detail.max_join_num) {
                // 饰品已达上限
                this.$notify.warning("饰品数量不可超过最大参与人数");
                return;
            }

            this.$refs.skinDialog.show();
        },

        handleCancelRoom() {
            this.$refs.confirmBox.show("确定取消房间？").then(() => {
                this.cancelRoom();
            });
        },

        cancelRoom() {
            RollService.cancelRoom(this.roomId).then(() => {
                this.$notify.success("房间取消成功");
                this.handleBack();
            });
        },

        handleEditRoom() {
            this.$refs.editRoomDialog.setEditData(this.detail);
            this.isShowEditDialog = true;
        },

        handleBack() {
            if (routeFrom?.name === "roll") {
                this.router.go(-1);
            } else {
                this.router.replace("/roll");
            }
        },

        autoOpenDialog() {
            if (!this.userInfo) return;
            // @ts-ignore
            if (window.autoOpenPushDialog) {
                this.$refs.skinDialog && this.$refs.skinDialog.show();
                // @ts-ignore
                window.autoOpenPushDialog = false;
            }
        },
    },

    created() {
        this.getRoomDetail();
    },

    beforeRouteEnter(to, from, next) {
        // 用于回退按钮
        routeFrom = from;
        next();
    },

    computed: {
        // 是否显示存入饰品按钮
        isShowPushSkinButton() {
            // <!-- 是房间创建者 、 活动进行时 、 房间未审核 -->
            const { lottery_status, audit_status } = this.detail;
            return this.isCreater && lottery_status === 0 && audit_status === 0;
        },

        isCreater() {
            return (
                this.userInfo && this.userInfo.user_id === this.detail.user_id
            );
        },

        activityIsNotEnded() {
            const { lottery_status } = this.detail;
            return lottery_status === 0;
        },

        roomIsEnabled() {
            const { audit_status } = this.detail;
            return audit_status === 1;
        },

        // 是否显示加入房间按钮
        isShowJoinRoomButton() {
            // 非活动创建者、活动未结束、参加人数未达上限、已通过审核、未加入房间
            const { join_users, max_join_num } = this.detail;
            return (
                !this.isCreater &&
                this.activityIsNotEnded &&
                join_users.length < max_join_num &&
                this.roomIsEnabled &&
                this.userInfo &&
                join_users.findIndex(
                    (user) => user.user_id === this.userInfo.user_id
                ) === -1
            );
        },

        // 是否显示编辑房间按钮
        isShowEditButton() {
            // 活动创建者、活动未结束、未通过审核
            const { audit_status } = this.detail;
            return (
                this.isCreater &&
                this.activityIsNotEnded &&
                (audit_status === 0 || audit_status === 2)
            );
        },

        // 是否显示取消房间按钮
        isShowCancelButton() {
            // 活动创建者、活动未结束、未存入饰品、未审核
            const { skin_list, audit_status } = this.detail;
            return (
                this.isCreater &&
                this.activityIsNotEnded &&
                !skin_list.length &&
                audit_status === 0
            );
        },

        // 是否显示“审核中”
        isShowAuditTips() {
            // 未开始审核、已存入饰品
            const { skin_list, audit_status } = this.detail;
            return skin_list.length && audit_status === 0;
        },

        // 已送出
        totalPrice() {
            const { winning_users } = this.detail;
            let total = 0;

            for (let i = 0; i < winning_users.length; i++) {
                total += winning_users[i].price;
            }

            return total.toFixed(2);
        },
    },

    components: {
        SkinList,
        ChooseSkinDialog,
        ConfirmBox,
        EditRoomDialog,
        QTitle,
        SkinItem,
    },
});
</script>

<style scoped lang="scss">
$plainTextColor: #868692;
$backgroundColor: #2b2c37;

.roll-bigbg {

    background-size: 100%;
    background-position: center bottom;
    background-repeat: no-repeat;
	.container-top-box{

	}
    .container-box {
        padding: 30px;
		.title-box{
			margin-bottom: 30px;
			.title-right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 37px;
				margin-top: -37px;
			}
		}
    }
}
.roomdesc {
    width: 620px;
    line-height: 1.8em;
}

.roll-room {
    margin: 0 auto;

    .roll-room-container {
        background: #1a1c24;
    }

    .roll-room-header {
        padding: 32px;
        background-color: $backgroundColor;
        border-radius: 5px;

        &.is-official {
            .left {
                .room-avatar {
                    border: 1px solid #4f5175;
                }

                .official-flag {
                    display: block;
                }
            }
        }

        .left {
            padding-right: 16px;
            border-right: 1px solid #444659;
            margin-right: 16px;
            width: 150px;

            .room-avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .room-name {
                color: #c3c3e2;
                line-height: 1.5;
                font-size: 15px;
                width: 100%;
            }

            .official-flag {
                display: none;
            }
        }

        .right {
            margin-left: 16px;
            flex: 1;
        }
    }

    .middle {
        .el-icon-lock {
            font-size: 13px;
        }
    }

    .roll-room-subtitle {
        color: #c3c3e2;
        font-size: 15px;
        line-height: 1.5;
    }

    .roll-room-desc {
        color: $plainTextColor;
        font-size: 13px;
        line-height: 1.5;
        white-space: normal;
    }

    .prize-pool {
        color: $plainTextColor;
        font-size: 16px;
        text-indent: 6px;
        background-color: $backgroundColor;
        padding: 15px 10px;

        .prize-pool-title {
            color: #c3c3e2;
            font-size: 19px;
        }

        .number {
            color: #e9b10f;
            margin: 0 2px;
        }
    }
}

@media screen and (max-width: 768px) {
    .detailt-topbox{
        margin-left: 10px;
        margin-right: 10px;
    }
    .roll-bigbg {
        .container-box {
            padding: 15px;
            .title-box{
                .title-right{
                    margin-top: 0px;
                    padding-left: 0;
                    justify-content: space-between;
                    margin-bottom: -30px;
                }
            }
        }
    }
    .roll-room {
        .roll-room-header {
            .left {
                margin-left: 0;
                padding-right: 0;
                border: none;
            }

            .right {
                margin-left: 0;
            }
        }
    }
}

.join-item {
    img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }
}

@media screen and(max-width: 600px) {
    .prize-pool {
        font-size: 12px !important;

        .prize-pool-title {
            font-size: 13px !important;
        }
    }
}

.detailt-topbox {
    display: flex;
    align-items: center;
    height: 200px;
    background: url("@/assets/img/bos/roomdetailbg.png");
    background-size: 100% 100%;
    color: #fff;
    border-radius: 2px;
    margin-bottom: 20px;
}

.text-99A5B7 {
    color: #99a5b7;
}

.text-B4B4B4 {
    color: #b4b4b4;
}

.btns-boxs {
    .v-btn {
        width: 170px;
        height: 40px !important;
    }
}

.w900 {
    width: 900px;
}

.skin-item-box {
    width: 20%;
}

@media screen and (max-width: 600px) {
    .w900 {
        width: auto !important;
    }

    .detailt-topbox {
        position: relative;
        display: flex;
        align-items: center;
        height: 216px;
        background: url("@/assets/img/roomdetailbg.png");
        background-size: cover;
        background-position: center center;
        border-radius: 2px;
        color: #fff;

        .pl-12 {
            padding-left: 14px !important;
        }

        .mt-8 {
            margin-top: 14px !important;
            display: flex;
            justify-content: space-between;
            padding-right: 10px;
        }
    }

    .m-v-container {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .roomdesc {
        width: auto;
    }

    .btns-boxs {
        position: absolute;
        right: 0;
        top: 20%;
        padding-right: 10px !important;

        .v-btn {
            width: 72px;
            height: 24px !important;
        }
    }

    .skin-item-box {
        width: 50%;
    }
}
</style>
