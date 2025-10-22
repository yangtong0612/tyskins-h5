<template>
<el-dialog v-bind="$attrs" :model-value="modelValue" top="10vh" width="1100px" :append-to-body="true"
    :show-close="false" custom-class="welfare-dialog" :lock-scroll="false">

    <div class="redenvelope-box" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="redenvelope-bg"></div>
    <div class="redenvelope-content">
     
      <div class="redenvelope animate__animated animate__flipInY" v-if="!showRule">
        <div @click="closeDialog" class="close_icon">
          <el-icon :size="26"><CircleClose /></el-icon>
        </div>
        <div class="roll">
          <transition enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutUp" @after-leave="onAfterLeave">
            <p v-if="message.animated">
              {{ message?.time }} <span>{{ message?.user }}</span> 领取了<span class="coin">{{ message?.coin }}</span>
              红包
            </p>
          </transition>
        </div>
        <!-- <div class="tips">加群 <span class="text-yellow">833629110</span> 不定期发红包福利</div> -->
        <div class="form-item">
          <input class="input" type="text" autofocus v-model="password" placeholder="输口令 领红包" />
        </div>
        <div class="open" @click="onReceiveRedEnvelope">
          <img src="@/assets/img/welfare/btn_open.png" />
        </div>
        <div class="activity-list-title">红包活动</div>
        <div class="activity-list">
          <div class="item" v-for="item in redEnvelopeList" :key="item.id">
            <div class="top">
              <p class="title">{{item.title}} <span>* {{item.num}}</span></p>
              <p class="status">{{item.status == 1 ? '已结束' : '已开抢'}}</p>
            </div>
            <p>描述：{{item.descr}}</p>
            <p>红包类型：{{initType(item.type)}}</p>
            <p v-show="item.type !== 0">领取要求：{{initRequireContent(item)}}</p>
            <p>活动时间：{{$dayjs.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')}}</p>
          </div>
        </div>
        <div class="rule" @click="onSeeRule">口令红包规则</div>
      </div>
      <div v-else class="redenvelope-rule animate__animated animate__flipInY">
        <div class="title">口令红包规则</div>
        <div class="text">
          <p>
            1.输入红包口令，可获得随机硬币奖励，硬币用于平台内活动，不可直接兑换商城皮肤。
          </p>

          <p>
            2.同一台设备或网络环境最多可以从 1 个红包 中，获得 1 次奖励。
          </p>

          <p>
            3.口令可以通过官方QQ、B站官方账号、活动等方式获得，口令和红包有时效性。
          </p>

          <p>
            红包最终解释权归本站所有，任何通过非法手段牟利都会导致资产冻结，或账号封禁。
          </p>
        </div>
        <div class="back" @click="showRule = false">返回红包封面</div>
      </div>
    </div>
  </div>

</el-dialog>
</template>

<script lang="ts">
import {provide, defineComponent, onMounted, onUnmounted, reactive, toRefs } from "vue";
import RedenvelopeService from "@/services/RedenvelopeService";
import { ElMessage } from "element-plus";
import { formatPassTime } from "@/utils";
import { useStore } from "@/store";
export default defineComponent({
  name: "WelfareCenter",
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    
    const store = useStore();
    const state = reactive({
      password: "",
      showRule: false,
      message: {
        time: "",
        user: "",
        coin: 0,
        animated: false,
      },
      loading: false,
      rollMessages: [],
      redEnvelopeList: []
    })

    const initRequireContent = (data) => {
      const { type, condition } = data
      if (type === 1) { // 等级
        return `用户等级 >= ${condition}`        
      } else if (type === 2) { // 今日充值
        return `今日充值金额 >= ${condition} RMB`
      }
    }

    const initType = (type) => {
      return type === 0 ? '普通红包' : type === 1 ? '等级红包' : '充值红包'
    }

    let timer: number = 0

    onMounted(async () => {
      await Promise.all([
        getRedEnvelopeList(),
        getRedEnvelopeRecord()
      ])
      timer = messageRoll();
    })

    onUnmounted(() => {
      clearInterval(timer);
    });

    function onAfterLeave() {
      state.message.animated = !state.message.animated;
    }

    function messageRoll() {
      return setInterval(() => {
        let message = state.rollMessages.pop();
        if (message) {
          state.message = {
            time: message.time,
            user: message.user,
            coin: message.coin,
            animated: !state.message.animated,
          };
          state.rollMessages.unshift(message);
        }
      }, 5000);
    }

    function onSeeRule() {
      state.showRule = true;
    }

    function getRedEnvelopeList() {
      return RedenvelopeService.getRedEnvelopeList({
        disabled: 0
      }).then(({ data: { data: { list } } }) => {
        state.redEnvelopeList = list
      })
    }

    function getRedEnvelopeRecord() {
      return RedenvelopeService.getRedEnvelopeRecord({
        page: 1,
        page_size: 20,
      }).then(({ data: { code, msg, data } }) => {
        if (data.list.length) {
          let messages = []
          data.list.forEach((item) => {
            messages.push({
              time: formatPassTime(item.receive_time * 1000),
              user: item.nickname,
              coin: item.money,
            });
          });
          state.rollMessages = messages
        }
      });
    }

    function onReceiveRedEnvelope() {
      if (state.loading) return;
      if (!state.password.length) {
        ElMessage.error("请输入红包口令");
        return;
      }
      state.loading = true;
      RedenvelopeService.receiveRedEnvelope({
        password: state.password,
      })
        .then(
          ({
            data: {
              data: { red_envelope_id, money },
            },
          }) => {
            ElMessage.success(`恭喜你成功领取 ${money} 硬币`);
            state.password = ''
            store.dispatch("getUserInfo");
            getRedEnvelopeRecord()
          }
        )
        .finally(() => {
          state.loading = false;
        });
    }

    provide("closeDialog", closeDialog)

    function closeDialog() {
      emit("update:modelValue", false);
    }
    return {
      ...toRefs(state),
      closeDialog,
      onSeeRule,
      onAfterLeave,
      onReceiveRedEnvelope,
      initRequireContent,
      initType,
    };
  },
});
</script>

<style lang="scss">

.el-dialog {
  box-shadow: unset;
}
.welfare-dialog-mobile {
  display: none;
}

.welfare-dialog {
  background: transparent !important;

  .el-dialog__header {
    padding: 0 !important;
    display: none !important;
    opacity: 0 !important;
  }

  .el-dialog__body {
    padding: 0 !important;
    background: transparent !important;
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.redenvelope-box {
  // position: relative;
  width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  height: 711px;


  .redenvelope-bg {
    position: absolute;
    width: 594px;
    height: 811px;
    background-image: url(@/assets/img/bos/bg_redenvelopes.png);
    background-size: 100%;
    background-position: center;
  }
  .redenvelope-content{
    padding-top: 40px;

  }
  .redenvelope {
    position: relative;
    width: 380px;
    height: 480px;
    background-image: url(@/assets/img/bos/bg_red_envelope_cover.png);
    background-size: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    

    .open {
      cursor: pointer;
      width: 100px;
      height: 100px;
      position: absolute;
      top: 144px;
      margin-left: 0px;
      img {
        // width: 100%;
        height: 0;
      }
    }

    .open:hover {
      animation: heartBeat;
      animation-duration: 1s;
    }

    .roll {
      width: 228px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      margin-top: 20px;
      color: #2B3340;
      font-size: 10px;
      height: 32px;
      line-height: 32px;
      background-color: rgba(0,0,0,0.3);
      border-radius: 30px;

      span {
        color: #FFAA00;
      }
      .coin::before {
        content: "";
        background-image: url(@/assets/img/bos/douzi.svg);
        width: 10px;
        height: 10px;
        background-size: 100%;
        display: inline-block;
        margin: 0 5px;
        vertical-align: middle;
        margin-bottom: 3px;
      }
    }

    .tips {
      margin-top: 10px;
      font-size: 14px;
      color: #ffffff;
    }

    .form-item {
      width: 216px;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;

      .input {
        width: 100%;
        background: #FFF7E1;
        border-radius: 4px;
        margin: 0;
        text-align: center;
        font-size: 14px;
        color: #D0A169;
        outline: none;
      }

      .input::placeholder {
        color: #99A5B7;
      }
    }
    .activity-list-title{
      position: absolute;
      top: 246px;
    }
    .activity-list {
      position: absolute;
      top: 272px;
      width: 264px;
      height: 165px;
      overflow-y: auto;
      background-color: #AE1000;
      border-radius: 13px;
      padding: 12px 18px;
      scroll-behavior: smooth;

      .item {
        margin-bottom: 15px;
        border-bottom: 1px solid #fff;
        padding-bottom: 10px;
        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;

          .title {
            font-size: 14px;
            font-weight: 600;
            span {
              color: #FFF700;
            }
          }

          .status {
            font-size: 14px;
            padding: 2px 6px;
            background-color: #FFF700;
            color: #000;
            border-radius: 12px;
          }

          .started {
            background: rgba(255, 255, 255, .5);
            color: #FFF700;
          }
        }

        &:last-child {
          border-bottom: 0;
          padding-bottom: 0;
          margin-bottom: 0;
        }
      }

      p {
        color: #fff;
        font-size: 12px;
      }

      .title {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .list {
      position: absolute;
      top: 232px;
      width: 264px;
      height: 104px;
      overflow-y: auto;
      background-color: #AE1000;
      border-radius: 13px;
      padding: 12px 18px;
      scroll-behavior: smooth;

      .item {
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .left {
          width: 80px;
          height: 90px;
          background-image: url(@/assets/img/welfare/icon_red_envelope.png);
          position: relative;

          p {
            position: absolute;
            bottom: 24px;
            font-size: 12px;
            color: #ffc2b3;
            width: 100%;
            text-align: center;
          }

          span {
            position: absolute;
            bottom: 5px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            width: 100%;
            color: #ffea00;
          }
        }

        .right {
          margin-left: 10px;
          flex: 1;
          font-size: 13px;
          line-height: 20px;
          color: #ffcac5;
        }

        .btn {
          margin-top: 10px;
          width: 100%;
          height: 35px;
          line-height: 35px;
          background: #df5858;
          border-radius: 20px;
          align-self: normal;
          text-align: center;
          color: #ffea00;
        }
      }
    }

    .rule {
      cursor: pointer;
      color: #FFF7E1;
      font-size: 12px;
      text-decoration: underline;
      margin-top: 1px;
      position: absolute;
      bottom: 14px;
    }
  }

  .redenvelope-rule {
    width: 380px;
    margin: 0 auto;
    height: 480px;
    // background-color: #f04b3b;
    background-image: url(@/assets/img/bos/bg_red_envelope_rule.png);
    background-size: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    position: relative;
    padding: 10px;
    border-radius: 10px;

    .title {
      margin-top: 20px;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
    }

    .text {
      font-size: 13px;
      padding: 5px 15px;

      p {
        margin-bottom: 20px;
      }
    }

    .back {
      font-size: 14px;
      text-decoration: underline;
      color: #FFF7E1;
      cursor: pointer;
      bottom: 15px;
      position: absolute;
    }
  }
}

@media screen and (max-width: 768px) {
  .redenvelope-bg {
    bottom: 0;
    width: 100vw !important;
    height: 77% !important;
    background-image: url(@/assets/img/welfare/bg_redenvelopes_mobile.png) !important;
    background-position: bottom !important;
  }

  .redenvelope-content {
    transform: scale(0.8);
  }

  .redenvelope-box {
    background-position: bottom;

    .redenvelope {
      .rule {
        margin-top: 0;
      }

      .roll {
        width: 22rem;
        height: 1.8rem;
        line-height: 1.8rem;
        margin-top: 1rem;

        .coin::before {
          content: "";
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 .5rem;
          margin-bottom: .3rem;
        }
      }

      .form-item {
        width: 19.6rem;
        height: 4rem;
        line-height: 4rem;
        margin-top: .5rem;

        .input {
          border-radius: .4rem;
        }

        .input::placeholder {
          color: #99A5B7;
        }
      }
    }
  }
}

.close_icon{
  position: absolute;
  right: -30px;
  top: -40px;
  cursor: pointer;
}
</style>
