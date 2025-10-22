<template>
  <div :class="currentName == 'Home' ? 'homebg' : 'combg'">
    <div v-if="!isMobile">
      <ScrollCard />
      <Header></Header>
    </div>
    <div style="position: relative; z-index: 99;" v-else>
      <Header></Header>
      <ScrollCard />
    </div>
    
    <Sidebar></Sidebar>
    <!-- :class="{'layout-main': $route.path !== '/'}" -->
    <div class="layout-main">
      <div v-if="$route.name === 'Home'" class="carouse-box">
        <el-carousel  v-if="banners.length" :height="isMobile ? '44vw' : '420px'"
          indicator-position="" v-bind="$attrs" arrow="never">
          <el-carousel-item v-for="item in banners" :key="item.id" @click="handleClickBanner(item)" class="banner-item">
            <!-- <div class="focus-text">
              <h1>{{ item.name }}</h1>
              <p>{{ item.descr }}</p>
            </div> -->
            <div class="focus-pic"><img :src="processImageUrl(item.img)"></div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <router-view />
    </div>
    <UserDrawer></UserDrawer>
    <div class="footerbg">
      <div class="v-container">
        <div class="d-flex footer-row">
          <div class="footer-left">
            <div class="d-flex" style="align-items: center;">
              <!-- <img class="cursor mr-2" style="width: 40px;" src="@/assets/img/bos/o.png" alt=""> -->
              <img class="footer-logo" src="@/assets/img/ooskins-logo.svg" alt="" />
            </div>
            
            <div class="fs14 mr-2 pc-copyright">Copyright © 2024.ooskins.com</div>
          </div>
          <div>
            <div class="links">
              <router-link to="/service?type=2">使用条款</router-link>
              <router-link to="/service?type=1">隐私协议</router-link>
              <router-link to="/problem">常见问题</router-link>
              <router-link to="/service?type=3">关于我们</router-link>
            </div>
            <div class="pays mb_pays">
              <img style="width: 37px;" src="@/assets/img/bos/yl.png" />
              <img style="width: 60px;" src="@/assets/img/bos/visa.png" />
              <img style="width: 27px;" src="@/assets/img/bos/wx.png" />
              <img style="width: 27px;" src="@/assets/img/bos/zfb.png" />
            </div>
            <div class="mb-copyright">Copyright © 2024.ooskins.com</div>
            <div class="copyright">
              <!-- <div class="fs14 mr-2" data-v-220c3afa="">Copyright © 2022.amgcsgo.com</div> -->
             
            </div>

          </div>
          <div class="pays pc_pays">
            <img style="width: 37px;" src="@/assets/img/bos/yl.png" />
            <img style="width: 60px;" src="@/assets/img/bos/visa.png" />
            <img style="width: 27px;" src="@/assets/img/bos/wx.png" />
            <img style="width: 27px;" src="@/assets/img/bos/zfb.png" />
          </div>
        </div>
      </div>
       
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Header from "./components/Header.vue";
import UserDrawer from '@/components/UserDrawer.vue'
import Sidebar from "./components/sidebar/Index.vue";
import ScrollCard from "./components/scroll-card/Index.vue";
import PublicService from "@/services/PublicService";
import { processImageUrl } from "@/utils";
import { Banner } from "@/types";
const banners = ref<Banner[]>([]);
const isMobile = ref(false);
const route = useRoute();
const router = useRouter();
const onResize = () => {
  isMobile.value = window.innerWidth < 600;
};

const handleClickBanner = (item) => {
  if (item.url) {
    router.push(item.url);
  }
};
// 监听路由变化  
const currentName = ref('Home');
watch(router.currentRoute, (newRouter) => {
  // 在路由发生变化时执行相应的操作  
  console.log('路由发生变化：', newRouter.name);
  currentName.value = newRouter.name;
});
onMounted(() => {
  currentName.value = route.name;
  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  PublicService.getBanners().then((resp) => {
    const { code, data } = resp.data;
    if (code !== 0) return;
    banners.value = data.list;
  });
});
</script>
<style lang="scss">
.fade-carousel .el-carousel__container,
.fade-carousel .el-carousel__item {
  transition: opacity 1s;
  opacity: 1;
}

.carouse-box{
  // border: 1px solid red;
  // background-image: url("@/assets/img/banner_background.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center top;
}


.el-carousel__indicators {
  display: none;
  width: 1005px;
  bottom: 100px;
}

.el-carousel__indicators .el-carousel__button {
  background-color: #94A0BC;
  width: 36px;
  height: 4px;
  transform: skewX(-20deg);
}

.el-carousel__indicators .el-carousel__indicator.is-active .el-carousel__button {
  background-color: #f3a45d;
  width: 69px;
  height: 6px;
}

.focus-pic {
  width: 1200px;
  height: 400px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  margin-left: auto;
  margin-right: auto;
  /* animation: leftIn .5s 0s ease-in-out 1 forwards; */
  /* -webkit-animation: leftIn .5s 0s ease-in-out 1 forwards */
}

.focus-text {
  width: 900px;
  position: absolute;
  left: 50%;
  margin-left: -600px;
  padding-left: 80px;
  color: #D3D4D6;
  height: 380px;
  cursor: pointer;
  transform: translateX(-80px);
  /* animation: rightIn .5s 0s ease-in-out 1 forwards; */
  /* -webkit-animation: rightIn .5s 0s ease-in-out 1 forwards; */
  padding-top: 86px;
}

.focus-text h1 {
  font-size: 60px;
  font-weight: 700;
  line-height: 72px;
  height: 72px;
  color: #fff;
}

.focus-text p {
  font-size: 28px;
  line-height: 28px;
  margin-top: 30px;
}

@keyframes leftIn {
  0% {
    transform: translateX(80px);
    opacity: .5
  }

  100% {
    transform: translateX(0);
    opacity: 1
  }
}


@keyframes rightIn {
  0% {
    transform: translateX(-80px);
    opacity: .5
  }

  100% {
    transform: translateX(0);
    opacity: 1
  }
}

@-webkit-keyframes rightIn {
  0% {
    -webkit-transform: translateX(-80px);
    opacity: .5
  }

  100% {
    -webkit-transform: translateX(0);
    opacity: 1
  }
}

@media screen and (max-width: 768px) {
  .fade-carousel {
    .el-carousel__indicators {
      width: 90%;
      bottom: 20px;
    }

    .el-carousel__indicators .el-carousel__button {
      width: 15px;
      height: 2px;
    }

    .el-carousel__indicators .el-carousel__indicator.is-active .el-carousel__button {
      width: 28px;
      height: 2px;
    }
  }
}
</style>

<style lang="scss" scoped>
.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #757D88;
}

.homebg {
  background-image: url("@/assets/img/banner_background.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center 70px;
  background-color: #17171f;

}

.combg {
  // background-image: url("@/assets/img/bos/combg.png");
  background-repeat: no-repeat;
  background-position: center top;
  background-color: #17171f;
}

.footerbg {
  z-index: 0;
  position: relative;
  padding-top: 32px;
  padding-bottom: 32px;
  background-color: #1b1a23;
  background-image: url("@/assets/img/bos/dbg.png");
  background-size: cover;
  background-position: right top;
  color: #191a22;
  text-align: center;
  &::after{
    content: "";
    width: 400px;
    height: 300px;
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("@/assets/img/footer_right.webp");
    background-size: 100%;
    background-position: right bottom;
  }

  .footer-logo {
    width: 127px;
  }

  .pays {
    img {
      margin-left: 15px;
    }
  }
}

.links {
  background: linear-gradient(260.7deg, rgba(26, 26, 32, .5) 19.27%, rgba(29, 29, 37, .5) 90.31%);
  padding: 10px;
  border-radius: 20px;
  text-align: center;

  a {
    color: #f3a45d;
    margin: 0 15px;
    text-decoration: none;
    font-size: 14px;
    // border-bottom: 1px solid #f3a45d;
    padding: 12px 0;
    display: inline-block;
  }
}

.copyright {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 12px;
  margin-top: 30px;

  a {
    color: #757d88;
    text-decoration: none;
    font-size: 12px;
  }
}

.banner-item {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  // transform: none !important;
  // border: 1px solid red;

}

.layout-main {
  // margin-top: 80px;
  position: relative;
  
}

.mb-copyright {
  display: none;
}

.mb_pays {
  display: none;
}

@media screen and (max-width: 768px) {
  .fade-carousel {
    .el-carousel__indicators {
      width: 300px;
      bottom: 20px;
    }
  }

  .focus-pic {
    width: 342px;
    height: 142px;
    transform: translateX(30px);

    img {
      width: 100%;
    }
  }

  .focus-text {
    padding-top: 10px;
    width: 340px;
    height: 100px;
    margin-left: -240px;

    h1 {
      font-size: 20px;
      height: 30px;
      line-height: 30px;
    }

    p {
      font-size: 14px;
    }
  }

  .footerbg {
    color: #ffffff;
    padding-top: 20px;
    padding-bottom: 20px;
    &::after{
      display: none;
    }
  }

  .footer-row {
    flex-direction: column;
  }

  .footer-left {
    align-items: center;

    .pc-copyright {
      display: none;
    }

  }

  .mb-copyright {
    display: block;
  }

  .pc_pays {
    display: none;
  }

  .mb_pays {
    display: block;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .links {
    margin-top: 20px;
    padding: 10px;
    margin-bottom: 15px;
    a{
      font-size: 12px;
    }
  }

  .layout-main {
    margin-top: 0px;
  }

  .copyright {
    display: block;
    margin-top: 5px;
  }
}
</style>



<style lang="scss">
.el-carousel__item.is-active {
  .focus-pic {
    animation: leftIn .5s 0s ease-in-out 1 forwards;
    -webkit-animation: leftIn .5s 0s ease-in-out 1 forwards
  }

  .focus-text {
    animation: rightIn .5s 0s ease-in-out 1 forwards;
    -webkit-animation: rightIn .5s 0s ease-in-out 1 forwards;
  }

}
</style>
