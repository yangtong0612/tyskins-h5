<template>
  <div class="notice-box">
    <div class="notice-title-group">
      <div v-for="(title, index) in titles" :key="index" class="notice-title" :class="{ active: index == titleIndex }"
        @click="onChangeNotice(index)">
        {{ title }}
      </div>
    </div>
    <div class="notice-content">
      <div class="top">
        <section class="notice-cover">
          <img :src="content.cover" alt="" />
        </section>
        <section class="notice-main">
          <!-- <div class="notice-sub-title">{{content.title}}</div> -->
          <div class="notice-details">{{ content.text }}</div>
        </section>
      </div>
      <div class="btn-see-detail" @click="onSeeDetail(content.path)">查看详情</div>
    </div>
  </div>
  <div class="notice-box-mobile">
    <div class="notice-tabs">
      <div class="notice-tab" :class="{ active: index == titleIndex }" v-for="(tab, index) in titles"
        @click="onChangeNotice(index)">{{ tab }}</div>
    </div>
    <div class="notice-card">
      <div class="notice-content">
        <div class="notice-details">{{ content.text }}</div>
        <div class="notice-cover">
          <img :src="content.cover" alt="" />
        </div>
        <div class="btn-see-detail" @click="onSeeDetail(content.path)"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, inject } from "vue";
import { useRouter } from "vue-router";
import data from './notice.json'

export default defineComponent({
  name: "Notice",
  setup() {
    const closeDialog = inject("closeDialog")
    const router = useRouter()
    const state = reactive({
      titleIndex: 0,
      titles: data.titles,
      contents: data.contents
    });

    const content = computed(() => {
      return state.contents[state.titleIndex]
    })

    function onChangeNotice(index) {
      state.titleIndex = index;
    }

    function onSeeDetail(path) {
      router.push(path)
      closeDialog()
    }

    return {
      ...toRefs(state),
      content,
      onChangeNotice,
      onSeeDetail
    };
  },
});
</script>

<style lang="scss" scoped>
.notice-box {
  position: relative;

  .notice-title-group {
    // position: sticky;
    top: 0;
    display: flex;
    border-bottom: 2px solid #4782F5;
    box-sizing: border-box;
    height: 42px;
    margin-bottom: 20px;

    .notice-title {
      // width: 100px;
      flex: 2;
      height: 42px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      cursor: pointer;
      box-sizing: border-box;
      &:first-child {
        flex: 1;
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    .active {
      position: relative;
      color: #4782F5;
      &::before{
        content: "";
        position: absolute;
        width: 0;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #4782F5 transparent;
      }
    }
  }

  .notice-content {
    display: flex;
    flex-direction: column;
    // margin: 16px;
    margin-top: 8px;
    flex: 1;

    .top {
      display: flex;
      flex-direction: column;

      .notice-cover {
        width: 100%;
        margin-right: 6px;

        img {
          width: 100%;
        }
      }

      .notice-main {
        padding-top: 10px;
        flex: 1;

        .notice-sub-title {
          color: #3f75ff;
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
          cursor: pointer;
        }

        .notice-details {
          color: #ffffff;
          font-size: 12px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 9;
          -webkit-box-orient: vertical;
          line-height: 24px;
          margin-bottom: 20px;
        }
      }
    }
  }
}

.btn-see-detail {
  cursor: pointer;
  margin: 0 auto;
  width: 163px;
  height: 40px;
  background: #4782F5;
  border-radius: 2px 2px 2px 2px;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}

.notice-box-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .notice-box {
    display: none;
  }

  .notice-box-mobile {
    display: block;
    width: 100%;

    .notice-tabs {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 3.7rem;

      .notice-tab {
        font-size: 1.2rem;
        min-width: 5rem;
        text-align: center;
        color: #2B3340;

        &.active {
          color: #FFD17E;
          // background: linear-gradient(#87777E 0%, #74626A 82%, #6B5860 100%, #64535A 78%, #87777E 0%);
          background: url(@/assets/img/welfare/bg_mobile_tab.png) no-repeat;
          background-size: cover;
        }
      }
    }

    .notice-card {
      padding: 0 .8rem 1rem;

      .notice-title {
        height: 30px;
        line-height: 26px;
        text-align: center;
        // background-image: url(@/assets/img/welfare/bg_notice_title_line.png);
        background-size: 100%;
        background-position: center;
        color: #FFEA00;
      }

      .notice-cover {
        width: 100%;
        margin-top: 1rem;

        img {
          width: 100%;
        }
      }

      .notice-content {
        font-size: 12px;
        color: rgba(43, 51, 64, .65);
        height: auto;

        .notice-details {
          display: block;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 9;
          -webkit-box-orient: vertical;
        }
      }
    }

    .btn-see-detail {
      // cursor: pointer;
      width: 16.7rem;
      height: 3.2rem;
      margin: 1.6rem auto 0;
      background-image: url(@/assets/img/welfare/btn_detail_mobile.png);
      background-size: 100%;
    }
  }
}
</style>