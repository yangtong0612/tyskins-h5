<template>
  <div class="welfate-center-sidebar">
    <div class="avatar-box">
      <img :src="loginUser ? processImageUrl(loginUser.avatar) : defaultAvatar">
    </div>
    <div class="nickname text-white fs14" v-if="loginUser">{{loginUser?.nickname}}</div>
    <template v-if="!loginUser">
      <div class="login-btn" @click="onShowLoginDialog"></div>
      <div class="login-tips">未有账号？现在<span @click="onShowLoginDialog">注册</span></div>
    </template>

    <template v-else>
      <div class="profile">
        <span class="coin text-yellow">{{loginUser.coin}}</span>
        <span class="coin2 ml-2" style="color: #FF8000;">{{loginUser.diamond}}</span>
      </div>
      <!-- <Task :list="[]"></Task> -->
    </template>

  </div>

  <Login ref="loginRef" />

</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive, toRefs, ref } from 'vue'
import Login from '../../Login.vue'
import Task from './Task.vue'
import { useStore } from '@/store'
import defaultAvatar from '@/assets/img/welfare/defautl_avatar.png'
import { processImageUrl } from '@/utils'

export default defineComponent({
  name: 'Sidebar',
  components: {
    Login,
    Task
  },
  setup(props, { emit }) {
    const closeDialog = inject("closeDialog")
    const loginRef = ref(null)
    const store = useStore()
    const state = reactive({
      showLoginDialog: false,
      loginUser: computed(() => store.state.user)
    })

    onMounted(() => {
    })

    function onShowLoginDialog() {
	    loginRef.value.open()
      closeDialog()
    }

    return {
      ...toRefs(state),
      onShowLoginDialog,
      defaultAvatar,
      processImageUrl,
    }
  }
})
</script>

<style lang="scss" scoped>
.welfate-center-sidebar {
  width: 220px;
  height: 165px;
  padding: 4px 4px 0;
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;

  .avatar-box {
    width: 60px;
    display: flex;
    align-items: center;
    background-position: left center;
    background-size: contain;
    height: 60px;
    margin-right: 0;
    border: 1px solid #54688D;
    background-color: #54688D;
    border-radius: 50%;
    margin-bottom: 5px;

    img {
      width: 100%px;
      height: 100%;
      display: block;
      border-radius: 50%;
    }
  }
.nickname{
  font-size: 14px;
}
  .login-btn {
    display: none;
    width: 213px;
    height: 68px;
    background-image: url(@/assets/img/welfare/btn_login.png);
    margin: 0 auto;
    margin-top: 22px;
    cursor: pointer;
  }

  .login-tips {
    display: none;
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
    color: #E7E3FF;
    font-weight: 600;
    & span {
      cursor: pointer;
      color: #FFEA00;
    }
  }

  .top-title {
    width: 100%;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    color: #E7E3FF;
    position: absolute;
    top: 10px;
  }

  .profile {
    display: flex;
    align-items: center;
    margin-top: 5px;
    .coin,.coin2 {
      display: flex;
      align-items: center;
      color: #2B3340;
      font-size: 12px;
    }
    .coin::before {
      content: '';
      background-image: url(@/assets/img/bos/douzi.svg);
      width: 12px;
      height: 12px;
      background-size: 100%;
      margin-left: 10px;
      margin-right: 5px;
    }
    .coin2::before {
      content: '';
      background-image: url(@/assets/img/bos/suipian.svg);
      width: 12px;
      height: 12px;
      background-size: 100%;
      margin-left: 10px;
      margin-right: 5px;
    }
  }
}

@media screen and (max-width: 768px) {
  .welfate-center-sidebar {
    display: none;
  }
}
</style>