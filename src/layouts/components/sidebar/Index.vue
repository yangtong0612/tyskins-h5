<template>
  <div class="sidebar" :class="isExpand=='true'?'expand':''">
    <!-- <div class="openhd" @click="$router.push('/open')">
      <img src="@/assets/img/bos/opentag_icon.png" />
      <p>开业活动</p>
    </div> -->
    <div class="red-envelope" @click="showRedenvelope = true">
      <img src="@/assets/img/bos/bg_red_envelope_cover.png" />
      <p>领红包</p>
    </div>
    <!-- @click="handleAddGroup" -->
    <div class="contact" @click="showRwm = true">
      <img src="@/assets/img/bos/rewma.png" />
      <p style="font-size: 10px;" class="mt-2">添加客服</p>
    </div>

    <div class="kefu" @click="openKf">
      <img src="@/assets/img/bos/icon_kefu.png" />
      <p>客服</p>
    </div>

    <div class="cdk" @click="showCdk = true">
      <img src="@/assets/img/bos/icon_cdkdh.png" />
      <p>CDK兑换</p>
    </div>
    
    <div style="margin-top: 20px; margin-bottom: 0;" class="contact extension" v-if="isLogin && !inviterInfo" @click="showBindCodeDialog = true">
      <div class="icon-contact icon-extension"></div>
      <p style="font-size: 10px;">邀请码</p>
    </div>


    <div class="expand-btn" @click="toggleExpand"></div>
    <!-- <div class="message">
      <img src="@/assets/img/message.png" />
    </div> -->

    <WelfareCenter v-model="showWelfareCenter"></WelfareCenter>
    <Redenvelope v-model="showRedenvelope"></Redenvelope>
    <CdkExchange v-model="showCdk"></CdkExchange>
    <BindCodeDialog v-model="showBindCodeDialog" @submit="onBindCode" @close="showBindCodeDialog = false"
      ref="transformDialog">
    </BindCodeDialog>
    <v-dialog v-model="showRwm">
      <div class="qqrwm">
        <div class="qqrwm_title">
          <span>扫码添加客服</span>
          <div style="opacity: 0.5;" class="abs absrc cursor mr-3">
            <el-icon @click="showRwm = false" size="24px">
              <CircleClose />
            </el-icon>
          </div>
        </div>
        <div class="qqrwm_body">
          <img src="/public/m24_qqrwm.png" alt="">
          <div class="fs16 mt-3">QQ: 3789944296</div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, nextTick } from "vue";
import WelfareCenter from "@/components/welfare-center/Index.vue";
import Redenvelope from "@/components/Redenvelope.vue";
import CdkExchange from "@/components/CdkExchange.vue";
import BindCodeDialog from "./components/BindCodeDialog.vue";
import { UserService } from "@/services/UserService";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import { openLink } from "@/utils";

export default defineComponent({
  name: "Sidebar",
  components: { BindCodeDialog, WelfareCenter, Redenvelope , CdkExchange},

  setup() {
    const store = useStore();
    const state = reactive({
      isExpand: 'true',
      showWelfareCenter: false,
      showRedenvelope: false,
      showBindCodeDialog: false,
      showCdk: false,
      showRwm: false,
      isLogin: computed(() => store.getters.userInfo != null),
      inviterInfo: computed(() => store.getters.inviterInfo),
    });

    function toggleExpand() {
      if(state.isExpand == 'true') {
        state.isExpand = 'false'
      } else {
        state.isExpand = 'true'
      }
      
      localStorage.setItem('isExpand', state.isExpand);
    }

    function onBindCode(invite_code) {
      UserService.bindInviter({
        invite_code,
      }).then(() => {
        store.dispatch("getUserInfo");
        state.showBindCodeDialog = false;
        ElMessage.success("绑定成功");
      });
    }

    onMounted(()=>{
      state.isExpand = localStorage.getItem('isExpand');
    })

    return {
      ...toRefs(state),
      toggleExpand,
      onBindCode,
      handleAddGroup: () => {
        openLink("https://qm.qq.com/cgi-bin/qm/qr?k=c544vPwj1919weoGnNYM66HALDp9Jo0G&jump_from=webapi");
      },
      openKf: () => {
         var url = 'https://tb.53kf.com/code/client/46eb7135244528653a24faa3cd435f569/1';
         window.open(url, "_blank", "width=800,height=620, left=500");
        // openLink("https://tb.53kf.com/code/client/46eb7135244528653a24faa3cd435f569/1");
      }
    };
  },
});
</script>

<style lang="scss" scoped>
.openhd{
  margin-bottom: 20px;
  cursor: pointer;
  img{
    width: 40px;
  }
}
.sidebar {
  transition: 0.6s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  z-index: 10;
  top: 35%;
  right: 16px;
  background-color: #282d33;
  color: #99A5B7;
  font-size: 12px;
  text-align: center;
  border-radius: 5px;
  padding: 18px 4px;
  transform: translateX(calc(100% + 16px));
  transition: transform 0.3s linear;
  width: 60px;

  &.expand {
    transform: translateX(0);
    // box-shadow: 0 0 10px 1px #242427;

    .expand-btn {
      &::after {
        transform: rotate(0);
      }
    }
  }

  .expand-btn {
    width: 26px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%);
    // background-color: #DFE5E8;
    background-color: rgba(0, 0, 0, .2);
    border-radius: 3px 0px 0px 3px;
    cursor: pointer;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(@/assets/img/sidebar/fold.png) center no-repeat;
      background-size: 8px 14px;
      transition: transform 0.2s linear;
      transform: rotate(180deg);
    }
  }

  // & .toggle {
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   cursor: pointer;
  //   height: 60px;
  //   width: 30px;
  //   background-color: #363746;
  //   box-shadow: -6px 0 10px 1px #242427;
  //   border-radius: 4px 0 0 4px;
  //   left: -30px;
  //   position: absolute;
  //   top: 50%;
  //   transform: translateY(-30px);

  //   i {
  //     font-size: 24px;
  //     color: #d4d1d1;
  //   }
  // }
  .red-envelope {
    cursor: pointer;
    margin-bottom: 15px;
    color: #99A5B7;

    img {
      width: 28px;
      margin-bottom: 3px;
    }

    &:hover {
      color: #e79d5d;
    }
  }
  .kefu{
    margin-top: 20px;
    cursor: pointer;
    img{
      width: 28px;
    }
  }
  .cdk{
    margin-top: 20px;
    cursor: pointer;
    img{
      width: 28px;
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    z-index: 100;
    height: 50px;
    img{
      width: 27px;
    }
    &:hover {
      color: #e79d5d;

      .icon-contact {
        background-image: url(@/assets/img/welfare/icon_chat_active.png);
      }
    }

    .icon-contact {
      width: 20px;
      height: 20px;
      margin-bottom: 7px;
      background-image: url(@/assets/img/welfare/icon_chat.png);
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
    }

    p {
      font-size: 12px;
    }
  }

  .extension {
    margin-bottom: 10px;
    p{
      font-size: 12px;
    }

    &:hover {
      .icon-extension {
        background-image: url(@/assets/img/welfare/icon_extension_active.png);
      }
    }

    .icon-extension {
      background-image: url(@/assets/img/welfare/icon_extension.png);
    }
  }

  & .message {
    cursor: pointer;
    z-index: 50;
    width: 6rem;
    height: 6rem;
    border-radius: 0 1rem 1rem 0;

    & img {
      width: 100%;
      transform: scale(1.4);
    }
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    font-size: 1rem;
    // right: 2px;
    border-radius: .5rem;
    padding: .9rem .5rem 1.1rem;
    transform: translateX(calc(100% + 1.4rem));

    .red-envelope {
      margin-bottom: 1.2rem;

      img {
        width: 2rem;
        margin-bottom: .15rem;
      }
    }

    .contact {
      .icon-contact {
        width: 1.6rem;
        margin-bottom: .35rem;
      }

      p {
        font-size: .6rem;
      }
    }
  }

  .expand-btn {
    width: 2rem !important;
    height: 4rem !important;
  }
}

.qqrwm {
  position: relative;
  width: 240px;
  background-color: #ffffff;
  border-radius: 10px;

  .qqrwm_title {
    position: relative;
    // background-color: #000;
    color: #000;
    padding: 10px 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .qqrwm_body {
    text-align: center;
    padding: 20px 0;
  }

  img {
    width: 150px;
    height: 150px;
  }
}
</style>
