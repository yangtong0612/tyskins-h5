<template>
  <el-dialog v-bind="$attrs" center :model-value="modelValue"  width="340px"  :append-to-body="true" :show-close="false"
    custom-class="welfare-dialog" :lock-scroll="false">

    <div class="cdk-popup-box">
      <section>
        <div @click="closeDialog" class="abs absrt" style="margin-right: 10px;margin-top: 10px;">
          <el-icon color="#999999" :size="30">
            <CircleClose />
          </el-icon>
        </div>
        <div>
          <div class="mb-10 fs18 fw600 tc">CDK兑换</div>
          <div class="px-8">
            <div>
              <el-input v-model="cdk.form.card_no" placeholder="请输入卡号"></el-input>
            </div>
            <div class="mt-8">
              <el-input v-model="cdk.form.card_secret" placeholder="请输入卡密码"></el-input>
            </div>

            <div class="mt-8 d-flex aj-center">
              <v-btn style="border-radius: 10px;" @click="handleCdkRecharge" elevation="0" color="#f3a45d">确认充值</v-btn>
            </div>

            <div class="mt-8 fs13 text-red">友情提示：CDK使用一次后作废，请妥善保管。若出现问题请联系管理员。</div>
          </div>
        </div>
      </section>
    </div>

  </el-dialog>
</template>

<script lang="ts">
import { provide, defineComponent, onMounted, onUnmounted, reactive, toRefs } from "vue";
import RedenvelopeService from "@/services/RedenvelopeService";
import { ElMessage } from "element-plus";
import { formatPassTime } from "@/utils";
import { useStore } from "@/store";
import {
	PaymentService
} from "@/services/PaymentService";
import {
	toast
} from "@/composables/util"
export default defineComponent({
  name: "WelfareCenter",
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {

    const store = useStore();
    const state = reactive({
      cdk: {
        loading: false,
        form: {
          card_no: "",
          card_secret: "",
        },
      },
    })


    const handleCdkRecharge = () => {
      let {
        card_no,
        card_secret
      } = state.cdk.form;
      card_no = card_no.trim();
      card_secret = card_secret.trim();
      if (!card_no) {
        toast('请输入卡号', 'warning');
        return;
      }
      if (!card_secret) {
        toast('请输入卡密', 'warning');
        return;
      }
      state.cdk.loading = true;
      PaymentService.cdkRecharge(state.cdk.form).then(() => {
        store.dispatch("getUserInfo");
        clearCdk();
        closeDialog();
      }).finally(() => {
        state.cdk.loading = false;
      })
    };

    const clearCdk = () => {
      state.cdk.form.card_no = "";
      state.cdk.form.card_secret = "";
      state.cdk.loading = false;
    }


    onMounted(async () => {

    })

    onUnmounted(() => {

    });



    function closeDialog() {
      emit("update:modelValue", false);
    }
    return {
      ...toRefs(state),
      closeDialog,
      handleCdkRecharge,
    };
  },
});
</script>

<style lang="scss">

.cdk-popup-box{
  background-color: #fff;
  padding: 30px;
  border-radius: 2px;
}
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

  .redenvelope-content {
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
      background-color: rgba(0, 0, 0, 0.3);
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

    .activity-list-title {
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

.close_icon {
  position: absolute;
  right: -30px;
  top: -40px;
  cursor: pointer;
}
</style>
