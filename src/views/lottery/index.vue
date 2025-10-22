<template>
    <div class="lottery-wrap">
        <v-container>
            <div class="lottery">
                <div class="fs24 fw600 mb-3">积分抽奖</div>
                <div>每抽奖一次花费 <span class="text-yellow fw600">{{ integral }}</span> 积分</div>
                <LuckyWheel class="mLuckyWheel" ref="myLucky" width="400px" height="400px" :prizes="prizes" :blocks="blocks"
                    :buttons="buttons" @start="startCallback" @end="endCallback" />
                <div>我的积分：<span class="text-yellow fw600">{{ store.state.user?.integral }}</span></div>
            </div>
        </v-container>

        <!-- 结果弹框 -->
        <q-popup wrapClass="popup_bg01" :width="isMobile ? '280px' : '284px'" bg="" :title="prize.prize_type > 0 ? '恭喜获得' : ''"
            ref="resultPopupRef">
            <div class="text-white px-4 py-2" style="line-height: 1.8em;">
                <div class="result-popup-box">
                    <div class="skin-img">
                        <img style="width: 100px;" :src="prize.imgs[0].src" alt="">
                    </div>
                    <div v-if="prize.prize_type == 3" class="skin-price">
                        <span>{{ prize.fonts[0].text }}</span>
                        <img class="mx-1" style="width: 13px;" src="@/assets/img/bos/douzi.svg" alt="">
                        <span>{{ prize.prize_value }}</span>
                    </div>
                    <div v-else class="skin-name">{{ prize.fonts[0].text }}</div>
                </div>
            </div>
        </q-popup>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import PublicService from "@/services/PublicService";
import TopService from "@/services/TopService";
import QPopup from "@/components/QPopup.vue";
import { processImageUrl } from '@/utils';
import { useStore } from "@/store";
const store = useStore();
const isMobile = computed(() => window.innerWidth < 600)

const resultPopupRef = ref(null);

const state = reactive({
    configs: [],

    blocks: [
        {
            padding: '60',
            imgs: [{
                src: '/wheel-bg.png',
                width: '100%',
                height: '100%',
                // rotate: true
            }]
        }
    ],
    prizes: [
        // { fonts: [{ text: '0', top: '10%' }], background: '#ffffff' },
        // { fonts: [{ text: '1', top: '10%' }], background: '#e4faf8' },
        // { fonts: [{ text: '2', top: '10%' }], background: '#ffffff' },
        // { fonts: [{ text: '3', top: '10%' }], background: '#e4faf8' },
        // { fonts: [{ text: '4', top: '10%' }], background: '#ffffff' },
        // { fonts: [{ text: '5', top: '10%' }], background: '#e4faf8' },
        // { fonts: [{ text: '5', top: '10%' }], background: '#ffffff' },
        // { fonts: [{ text: '5', top: '10%' }], background: '#e4faf8' },
    ],
    prize: {},
    buttons: [{
        radius: '35%',
        imgs: [{
            src: '/wheel-btn.png',
            width: '100%',
            top: '-130%'
        }]
    }],
})
const { prizes, buttons, blocks, prize } = toRefs(state);

const myLucky = ref(null);
// 点击抽奖按钮会触发star回调
const startCallback = async () => {
    // 调用抽奖组件的play方法开始游戏

    const res = await PublicService.startLuckyWheel();

    

    myLucky.value.play()
    // 模拟调用接口异步抽奖
    setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = res.data.data.index;
        // 调用stop停止旋转并传递中奖索引
        myLucky.value.stop(index)


    }, 3000)
};


// 抽奖结束会触发end回调
const endCallback = (prize) => {
    console.log('中奖', prize)
    state.prize = prize;
    resultPopupRef.value.open();

    store.dispatch('getUserInfo');
};

const integral = ref(0);
// 获取汇率
const getConfigAll = () => {
  return TopService.getConfigAll().then((response) => {
    if (response.data.code === 0) {
    //   console.log(response.data.data.lucky_wheel_expend_integral)
      integral.value = response.data.data.lucky_wheel_expend_integral
    }
    throw new Error(response.data.msg);
  });
};
onMounted(() => {
    getConfigAll();
    PublicService.getLuckyWheelConfigs().then((resp) => {
        const { code, data } = resp.data;
        if (code !== 0) return;
        let configs = data.configs || [];
        console.log('data', configs)
        state.prizes = configs.map((v, i) => {
            return {
                prize_value: v.value,
                background: i % 2 == 0 ? '#e4faf8' : '#ffffff',
                prize_type: v.prize_type,
                imgs: [{
                    src: processImageUrl(v.prize_image),
                    top: '20',
                    width: '50',
                    heigith: '50',
                }],
                fonts: [
                    {
                        text: v.prize_name,
                        top: '5',
                        fontSize: '12',
                        lineClamp: 1
                    }
                ]
            }
        })

    });
})
</script>


<style lang='scss' scoped>
.lottery {
    background-color: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    font-size: 14px;
    padding: 30px;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.result-popup-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .skin-price {
        display: flex;
        align-items: center;
    }
}

@media screen and (max-width: 768px) {
    .mLuckyWheel {
        transform: scale(0.8);
    }
}</style>