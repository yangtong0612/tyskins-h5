<template>
  <div class="roll-box">
    <div class="roll-list" v-if="roomList.length">
      <div class="roll-item" v-for="item in roomList" :key="item.id">
        <div class="profile">
          <div class="avatar">
            <img :src="item.avatar ? parseImg(item.avatar) : defaultAvater" alt="" />
            <!-- <div v-if="!item.avatar" class="badge">官方</div> -->
          </div>
          <div class="info">
            <p class="name">{{item.room_name}}</p>
            <p class="date">开奖时间：{{ $dayjs.unix(item.lottery_time).format("YYYY-MM-DD HH:mm:ss") }}</p>
          </div>
        </div>
        <div class="detalis">
          <div class="imgs">
            <img v-for="skin in item.main_skins" :key="skin.id" :src="skin.image_url" class="bg_d6b45b" />
          </div>
          <div class="info">
            <div class="item coin">
              <img src="@/assets/img/jb_01.png" alt="coin">
              <span>{{item.prize_pool}}</span>
            </div>
            <div class="item num">参与人数：{{item.max_join_num}}</div>
            <div class="item num">道具数：{{item.award_num}}</div>
          </div>
        </div>
        <!-- <div class="mobile-imgs">
          <img v-for="skin in item.main_skins" :key="skin.id" :src="skin.image_url" />
        </div> -->
        <div class="room-desc">
          {{item.room_desc}}
        </div>
        <button @click="toRoll(item.id)" class="btn-detail">查看详情</button>
        <!-- <div class="countdown">
          <div>距开奖还剩：</div>
          <p>
            <span>{{item.countdown.d}}</span>天<span>{{item.countdown.h}}</span>时<span>{{item.countdown.m}}</span>分<span>{{item.countdown.s}}</span>秒
          </p>
        </div> -->
      </div>
    </div>
    <el-empty v-else :image-size="300" :image="logo" description="暂无数据" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, inject, toRefs } from "vue";
import { processImageUrl } from "@/utils";
import { RollService } from "@/services/RollService"
import { formatRemainTime } from "@/utils"
import defaultAvater from "@/assets/img/roll/default_avatar.png"
import { useRouter } from "vue-router";
import logo from "@/assets/img/m24_logo.png"
export default defineComponent({
  name: "Roll",
  setup() {
    const router = useRouter()
    const state = reactive({
      roomList: []
    })
    const closeDialog = inject("closeDialog")

    onMounted(async () => {
      await getRoomList()
      startCountdown()
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    let timer = 0
    function startCountdown() {
      clearInterval(timer)
      timer = setInterval(() => {
        state.roomList.forEach(v => v.countdown = formatRemainTime(v.lottery_time * 1000))
      }, 1000)
    }

    async function getRoomList() {
      let resp = await RollService.getRoomList({
        i_created: false,
        is_join: false,
        lottery_status: 0,
        no_password_room: true,
        order: "desc",
        room_type: -1,
        sort: "prize_pool"
      });
      let { data: { list, total } } = resp.data

      state.roomList = list.map(v => {
        v.countdown = formatRemainTime(v.lottery_time * 1000)
        v.main_skins.splice(3)
        return v
      })
    }

    function toRoll(id: number) {
      router.push(`/roll/${id}`)
      closeDialog()
    }

    const parseImg = (img) => {
      return processImageUrl(img)
    }

    return {
      defaultAvater,
      logo,
      ...toRefs(state),
      toRoll,
      parseImg
    };
  },
});
</script>

<style lang="scss" scoped>
// 自定义背景色
.bg_d6b45b {
	background-image: linear-gradient(0deg, #413109, #9B7519, #3A2A06);
}

.bg_ff8789 {
	background-image: linear-gradient(0deg, #410E09, #922D24, #410E09);
}

.bg_e448e2 {
	background-image: linear-gradient(0deg, #3C0747, #86189F, #3E054A);
}

.bg_4d82da {
	background-image: linear-gradient(0deg, #071731, #093680, #071731);
}

.bg_bdc2c2 {
	background-image: linear-gradient(0deg, #3D4757, #697A94, #363F4E);
}

.roll-box {
  width: 100%;

  .roll-list {
    display: grid;
    grid-template-columns: repeat(2, 300px);
    grid-gap: 6px;
    // grid-template-rows: 282px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .roll-item {
    cursor: pointer;
    background-color: #fff;
    padding: 0 8px;

    .mobile-imgs {
      display: none;
    }

    .profile {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(153, 165, 183, .3);
      margin-bottom: 8px;
      padding: 22px 7px 15px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;
        position: relative;
        display: flex;
        justify-content: center;

        img {
          width: 100%;
        }

        .badge {
          width: 40px;
          height: 20px;
          background-color: #ffea00;
          position: absolute;
          bottom: -10px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          color: #000;
        }
      }

      .info {
        .name {
          font-size: 16px;
          color: #2D2F3D;
          font-weight: 500;
          margin-bottom: 3px;
        }

        .date {
          font-size: 12px;
          color: #99A5B7;
          font-weight: 500;
        }
      }
    }

    .detalis {

      .title {
        font-size: 14px;
        font-weight: bold;
      }

      .imgs {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        width: 100%;
        height: 70px;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .imgs img {
        margin-right: 5px;
        width: 89px;
      }

      .info {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;

        .item {
          padding-left: 5px;
          font-size: 13px;
        }

        .coin {
          display: flex;
          align-items: center;
          font-weight: 500;
          color: #FF9900;

          img {
            margin-right: 5px;
          }
        }

        .num {
          color: #4782F5;
        }
      }
    }

    .room-desc {
      color: #333333;
      font-size: 12px;
      margin: 8px 0 6px;
    }

    .btn-detail {
      display: block;
      width: 124px;
      height: 32px;
      background-color: #4782F5;
      margin: 0 auto;
      color: #fff;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .countdown {
      font-size: 14px;
      font-weight: bold;
      color: #cfcce7;

      p {
        color: #ffea00;
      }

      div {
        margin-left: 5px;
      }

      span {
        display: inline-block;
        height: 24px;
        width: 24px;
        text-align: center;
        border: 1px solid rgba(255, 234, 0, 0.1);
        margin: 5px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .roll-box {
    height: auto;

    .roll-list {
      padding: .7rem 1rem .7rem;
      grid-template-columns: repeat(1, 100%);
    }

    .roll-item {
      height: auto;
      padding: 0 .8rem;

      .profile {
        padding: 2.2rem .7rem 1.5rem;
        
        .avatar {
          margin: 0;
          margin-right: .5rem;
        }

        .info {
          .name {
            font-size: 1.6rem;
            margin-bottom: .2rem;
          }
          
          .date {
            font-size: 1.2rem;
            font-weight: 400;
          }
        }
      }

      .mobile-imgs {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin: 10px;

        img {
          display: block;
          width: 104px;
        }
      }

      .btn-detail {
        width: 12.4rem;
        height: 3.2rem;
        margin-bottom: 1.6rem;
      }

      .countdown {
        width: 100%;
        display: flex;
        align-items: center;
        margin-left: 5px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>