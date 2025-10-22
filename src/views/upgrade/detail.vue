<template>
  <div class="noselect">
    <v-container>
      <div class="upgrade-box">
        <div v-if="isMobile" class="m-upgrade-title">幸运饰品UPGRADE</div>
        <div class="title-bar">
          <div @click="$router.back()" class="back">返回上一页</div>
          <div v-if="!isMobile" class="title">幸运饰品UPGRADE</div>
          <div class="btns">
            <div class="switch-btn" @click="changeAnimationFlag">
              <el-switch size="small" v-model="animationSwitch" /><span
                >关闭动画</span
              >
            </div>
            <div @click="upgradeTisRef.open()" class="help-btn">
              <img src="@/assets/img/bos/icon_help.png" />
              <span>游戏规则</span>
            </div>
          </div>
        </div>

        <div class="upgrade-wrap">
          <compass-box
            class="compass-box"
            :rate="rate"
            :spend="spend"
            :point="upgradePoint"
            :animation-flag="animationFlag"
          >
          </compass-box>
          <div class="upgrade-left">
            <div>
              <img
                class="notSelected-img"
                src="@/assets/img/bos/notSelected.png"
                alt=""
              />
              <div class="mt-2" style="color: #f3a55e">
                <span class="fs12">随机饰品</span>
              </div>
              <div class="fs12" style="color: #99a5b7">
                失败获得一件随机饰品
              </div>
            </div>
            <!-- <div>

                            <img class="upgradeSkin_img" :src="upgradeSkin.image_url" />
                            <div @click="openSkinDialog" class="my-2 upgradeSkin_text line1" style="color: #ff9900;">
                                {{upgradeSkin.item_name}}</div>
                            <v-btn class="ghbtn" @click="openSkinDialog" v-if="!upgradeLoading" height="24" elevation="0" color="primary">更换</v-btn>
                        </div> -->
          </div>
          <div class="upgrade-right">
            <img
              v-if="!upgradeSkin"
              src="@/assets/img/unknownskin.png"
              alt=""
            />
            <div v-else class="selected-skin">
              <div v-if="!isMobile" class="skin-name">
                <span>{{ upgradeSkin.item_name }}</span>
                <span class="tag">{{ upgradeSkin.exterior_name }}</span>
              </div>
              <div class="skin-img">
                <img :src="upgradeSkin.image_url" alt="" />
              </div>
              <div class="price-box">
                <span>物品价值</span>
                <div style="color: #f3a45d" class="price num">
                  {{ upgradeSkin.price }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="upgradeSkin" class="upgradeSkin_name">
          {{ upgradeSkin.item_name }}
        </div>

        <div>
          <div class="mx-auto d-flex flex-column j-center slider-w">
            <div style="color: #99a5b7; font-size: 14px" class="text-white">
              请拖动选择概率
            </div>
            <el-slider
              v-model="rate"
              :max="100"
              :show-tooltip="true"
              :format-tooltip="(e) => `${e}%`"
              @input="onRateChahnge"
              class="top-slider"
              :disabled="upgradeLoading"
            ></el-slider>
          </div>
        </div>

        <!-- <div class="d-flex mt-5" style="align-items: flex-end;">
                    <div class="btns-right">
                        <v-btn :disabled="upgradeLoading" @click="changeAnimationFlag" width="60" height="24" elevation="0" color="#E7AF5E">
                            <span class="text-white fs12">{{ animationFlag ? "关闭" : "开启" }}动画</span>
                        </v-btn>
                        <v-btn :disabled="upgradeLoading" @click="musicFlag = !musicFlag" class="ml-2" width="60" height="24" elevation="0" color="#E7AF5E">
                            <span class="text-white fs12">{{ musicFlag ? "关闭" : "开启" }}音效</span>
                        </v-btn>
                        <v-btn @click="reset" :disabled="upgradeLoading" class="ml-2" height="24" elevation="0" color="#E7AF5E">
                            <span class="text-white fs12">重置</span>
                        </v-btn>
                    </div>

                </div> -->
        <div class="mt-10">
          <div class="flex-1 d-flex aj-center">
            <v-btn
              style="border-radius: 10px"
              @click="upgrade"
              :disabled="!upgradeSkin || upgradeLoading"
              elevation="0"
              width="210"
              height="44"
              color="#f3a45d"
            >
              <span class="text-white fs12"
                >{{ upgradeLoading ? "升级中" : "确定升级"
                }}{{ spend ? spend : "" }}</span
              >
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>

    <skin-popup ref="skinPopupRef" @submit="handleUpgradeSkin"></skin-popup>

    <result-dialog
      ref="resultPopupRef"
      @close="handleCloseResultDialog"
      :skin="upgradeSkin"
      :result="upgradeResult"
      :backpack-id="upgradeBackpackId"
      :point="upgradePoint"
    ></result-dialog>

    <q-popup
      :showFooter="false"
      :width="isMobile ? '100%' : '448px;'"
      ref="upgradeTisRef"
      title="升级指南"
    >
      <div class="px-4 py-4">
        <p class="fs13" v-for="text in upgradeGuidTexts" :key="text">
          {{ text }}
        </p>
      </div>
    </q-popup>
  </div>
</template>

<script lang="ts">
export const upgradeAnimationDuraction = 6000;
export interface SkinItem {
  id: number;
  exterior_name: string;
  image_url: string;
  short_name: string;
  price: number;
  rarity_color: string;
  price_info: {
    price: number;
    quantity: number;
    autoDeliverPrice: number;
    autoDeliverQuantity: number;
    manualDeliverPrice: number;
    manualQuantity: number;
  };
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import SkinDialog from "./components/SkinDialog.vue";
import SkinPopup from "./components/SkinPopup.vue";
import TopService from "@/services/TopService";
import ResultDialog from "./components/ResultDialog.vue";
import QPopup from "@/components/QPopup.vue";
import { ElMessage } from "element-plus";
import CompassBox from "./components/CompassBox.vue";
import { sleep } from "@/utils";

const musicTop = new Audio("/media/top.mp3");
const musicSuccess = new Audio("/media/upgrade-success.mp3");
const musicFail = new Audio("/media/upgrade-fail.mp3");

const skinPopupRef = ref(null);
const resultPopupRef = ref(null);

let ex1 = reactive({
  label: "color",
  val: 25,
  color: "orange darken-3",
});
const upgradeTisRef = ref(null);
const minRate = 10;
const maxRate = 75;
const MIN_COINS = 3;

const defaultRate = 20;

const rate = ref(defaultRate);
const isShowSkinDialog = ref(false);
const isShowResultDialog = ref(true);
const isShowUpgradeGuideDialog = ref(false);
// const upgradeSkin = ref<SkinItem | null>(null);
const router = useRouter();
const store = useStore();
const upgradeProfitRate = ref(0);
const getConfigLoading = ref(false);
const upgradeLoading = ref(false);
const upgradeResult = ref(false);
const upgradeBackpackId = ref(0);
const upgradePoint = ref(0);

const upgradeSkin = computed(() => {
  return store.state.upgradeSkin;
});

const coins = ref<string | number>("");

const minCoins = computed(() => {
  const n = computedCost(minRate);
  return n < MIN_COINS ? MIN_COINS : n;
});
const maxCoins = computed(() => computedCost(maxRate));
const isMobile = computed(() => window.innerWidth < 600);
const setUpgradeProfitRate = (val: string) => {
  upgradeProfitRate.value = Number(val) / 100;
};

const computedCost = (r: number) => {
  const skin = upgradeSkin.value;
  if (!skin) return 0;
  let n = skin.price + skin.price * upgradeProfitRate.value;
  n = n * (r / 100);
  return Number(n.toFixed(2));
};

const spend = computed(() => {
  const spend = computedCost(rate.value);
  if (spend && spend < MIN_COINS) {
    rate.value = getRateByCoins(MIN_COINS);
    return computedCost(rate.value);
  }
  return spend;
});

const getUpgradeProfitRate = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (store.getters.upgrade_profit_rate) {
      setUpgradeProfitRate(store.getters.upgrade_profit_rate);
      resolve();
    } else {
      getConfigLoading.value = true;
      store
        .dispatch("getUpgradeProfitRate")
        .then((val) => {
          if (val) {
            setUpgradeProfitRate(val);
            resolve();
          } else {
            reject("invalid value");
          }
        })
        .catch(reject)
        .finally(() => (getConfigLoading.value = false));
    }
  });
};

const playTopMusic = (): Promise<any> => {
  return new Promise((resolve) => {
    musicTop.play();
    musicTop.onended = resolve;
    // 最多延迟500毫秒
    setTimeout(resolve, upgradeAnimationDuraction + 500);
  });
};

const upgrade = () => {
  const skin = upgradeSkin.value;
  if (!skin) return;

  const { id } = skin;
  upgradeLoading.value = true;
  musicSuccess.pause();
  musicFail.pause();

  TopService.upgrade({
    skin_id: id,
    range: rate.value,
  })
    .then(async (response) => {
      if (response.data.code === 0) {
        console.log("升级成功");
        const { point, result, backpack_id } = response.data.data;
        let hasValue;
        const setPoint = () => {
          if (!hasValue) {
            upgradePoint.value = point;
            hasValue = true;
          }
        };
        if (animationFlag.value) {
          if (musicFlag.value) {
            // 动效播放后再加载动画
            musicTop.onplay = setPoint;
            setTimeout(setPoint, 1000);
            await playTopMusic();
          } else {
            setPoint();
            await sleep(upgradeAnimationDuraction);
          }
        } else {
          setPoint();
        }

        if (musicFlag.value) {
          if (result) {
            musicSuccess.currentTime = 0;
            musicSuccess.play();
          } else {
            musicFail.currentTime = 0;
            musicFail.play();
          }
        }
        upgradeResult.value = result;
        upgradeBackpackId.value = backpack_id;
        // isShowResultDialog.value = true;
        resultPopupRef.value.open();

        store.dispatch("getUserInfo");
      } else {
        console.log("升级失败", response.data);
      }
    })
    .finally(() => {
      upgradeLoading.value = false;
    });
};

const getRateByCoins = (coins: number) => {
  let result =
    (coins / (upgradeSkin.value!.price * (1 + upgradeProfitRate.value))) * 100;
  if (Math.ceil(result) !== result) {
    result = Number(result.toFixed(2));
  }
  return result;
};

const musicFlag = ref(true);
const animationFlag = computed(() => {
  return store.getters.upgradeLoadingTime > 0;
});
const animationSwitch = ref(false);
const changeAnimationFlag = () => {
  const val = animationFlag.value ? 0 : upgradeAnimationDuraction;
  (animationSwitch.value = animationFlag.value ? true : false),
    store.commit("setUpgradeLoadingTime", val);
};

if (!animationFlag.value) {
  changeAnimationFlag();
}

const openSkinDialog = () => {
  skinPopupRef.value.open();
  // isShowSkinDialog.value = true;
};
const reset = () => {
  upgradeSkin.value = null;
  upgradePoint.value = 0;
  coins.value = "";
  rate.value = defaultRate;
};

const howToPlayTexts =
  `1.玩家选择升级物品，升级物品不能少于10T币，玩家投入不能少于3硬币。
2玩家在决定好升级物品后，可以选择硬币数量.系统会自动生成升级概率;也可以选择升级成功率，由系统自动计算所需硬币的投入。用户选择完成后，点击开始游戏，根据最终落点值决定结果为获得升级物品或者保底物品。
3.指针停留在蓝色区域代表升级成功，空白区域则代表升级失败，升级成功率取决于不同的饰品及硬币投入量，请玩家谨慎选择。
4.升级结果可以在个人中心查询。
5.由于网站采用的纯随机的均匀分布，绝对公平，所以建议用户不要在消费过程中频繁修改成功率，因为这样相反回因此失去一些机会。
6.ooskins平台于前端开箱动画可能因部分未知错误导致显示出错，如您不幸遭遇上述情况（譬如动画结束指针停留于蓝色区域但结果显示升级失败）请您以最终结果为准。或者，我们建议您使用“跳过动画”选项，避免不必要的困扰。
7.ooskins平台中显示的累计账户余额可能与ooskins平台服务器端存在统计差异，实际账户余额以服务器端的数据为准。`.split(
    "\n"
  );

const onRateChahnge = (val) => {
  if (val < minRate) {
    rate.value = minRate;
  } else if (val > maxRate) {
    rate.value = maxRate;
  }
};

const n = computed(() => Math.floor((rate.value / 100) * 10000));
const failRate = computed(() => {
  let failRate: string | number = 100 - rate.value;
  if (Math.ceil(failRate) !== failRate) {
    failRate = failRate.toFixed(2);
  }
  return failRate;
});
const upgradeGuidTexts =
  `ooskins的饰品升级符合公平性原则，10%的概率不代表10次必出，请选择合理的升级概率。
			升级取决于最后的落点值，可在多次尝试后选择你认为最合适的概率进行升级。`.split(
    "\n"
  );

const handleUpgradeSkin = (skin: SkinItem) => {
  if (!upgradeSkin.value) {
    rate.value = 20;
  }
  isShowSkinDialog.value = false;
  upgradeSkin.value = skin;
};

const handleClickButton = () => {
  if (!upgradeProfitRate.value) {
    getUpgradeProfitRate().then(() => {
      // openSkinDialog();
    });
  } else {
    // openSkinDialog();
  }
};

const changeRate = () => {
  let n = Number(coins.value);
  if (!n) {
    ElMessage.warning("请输入正确的数字");
    return;
  }
  const skin = upgradeSkin.value;
  if (!skin) {
    ElMessage.warning("未选择饰品");
    return;
  }

  if (n < minCoins.value) {
    coins.value = n = minCoins.value;
  } else if (n > maxCoins.value) {
    coins.value = n = maxCoins.value;
  }

  rate.value = getRateByCoins(n);
};

if (!upgradeSkin.value) {
  router.push("/upgrade");
}
onMounted(() => {
  // resultPopupRef.value.open();
  handleClickButton();
});
</script>

<style lang="scss">
$color: #f3a55e;

.el-slider__bar {
  background-color: $color !important;
}

.el-slider__button {
  border-color: #fff !important;
  background-color: $color !important;
}

.el-slider__runway {
  background-color: #d8d8d8 !important;
}

.el-slider__stop {
  background-color: transparent !important;
}

.frame {
  .el-input__inner {
    background: #000;
    border: none;
    color: #fff;
  }
}
</style>
<style scoped lang="scss">
.title-bar {
  display: flex;
  color: #ffffff;
  align-items: center;
  margin-bottom: 30px;
  .title {
    flex: 1;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  .back {
    width: 200px;
    font-size: 13px;
    cursor: pointer;
  }
  .btns {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
    align-items: center;
    .switch-btn {
      cursor: pointer;
      align-items: center;
      display: flex;
      span {
        margin-left: 4px;
        white-space: nowrap;
      }
    }
    .help-btn {
      margin-left: 37px;
      align-items: center;
      display: flex;
      cursor: pointer;
      img {
        width: 14px;
      }
      span {
        margin-left: 4px;
        color: #99a5b7;
        white-space: nowrap;
      }
    }
  }
}
.noselect {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.ratediv {
  font-size: 50px;
}

.ratetext {
  font-size: 20px;
}

.upgrade-title {
  transform: translateY(-100%);
  z-index: 10;
  position: relative;

  .upgrade-title-img {
    width: 140px;
  }

  .tip {
    color: #fff;
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    right: 50px;
    transform: translateY(-50%);
    cursor: pointer;

    &:hover {
      .hot-to-play {
        display: block;
      }
    }

    img {
      width: 12px;
      margin-right: 6px;
    }

    .hot-to-play {
      position: absolute;
      text-align: left;
      width: 350px;
      left: 0;
      bottom: 0;
      transform: translate(-100%, 100%);
      background: #363638;
      padding: 20px;
      box-sizing: border-box;
      display: none;

      p {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.upgrade-box {
  margin: 30px auto;
  // background-color: #11151B;
  padding: 40px 20px;
}

.frame {
  position: relative;

  .frame-content {
    display: flex;
    height: 416px;
  }
}

.top-skin {
  width: 348px;
  height: 384px;
  background-image: url(@/assets/img/top/stage.png);
  position: relative;
  margin-top: 16px;

  .upgrade-skin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    img {
      width: 90%;
    }

    .bac-icon {
      width: 45%;
      height: 45%;
      position: absolute;
      z-index: -1;
      top: 2.4rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;

      .bac {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0px;
        height: 0px;
        border-radius: 50%;
        z-index: 0;
      }

      img {
        z-index: 1;
        position: relative;
        width: 100%;
        transform: scale(2);
        opacity: 0.8;
      }
    }
  }

  .upgrade-btn {
    position: absolute;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
  }
}

.top-skin:first-child {
  margin-left: 96px;
}

.top-skin-text {
  color: #fff;
  font-size: 19px;
  position: absolute;
  top: 122px;
  text-align: center;
  width: 100%;
}

.top-skin-button {
  width: 103px;
  height: 101px;
  position: absolute;
  top: 165px;
  left: 50%;
  transform: translate(-50%, 0);
}

.top-skin-button.btn-add {
  background-image: url(@/assets/img/top/add.png);
  cursor: pointer;
}

.top-skin-button.btn-unknow {
  background-image: url(@/assets/img/top/question.png);
}

.rate-wrapper {
  width: 800px;
  margin: 0 auto;
  font-size: 14px;

  .rate-text {
    display: flex;
    justify-content: space-between;

    > div {
      flex: 1;

      span:first-child {
        text-indent: 20px;
      }

      span:last-child {
        text-indent: 10px;
      }

      &:first-child {
        span:first-child {
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #7668ca;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
        }
      }

      &:last-child {
        text-align: right;

        span:first-child {
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #d8d8d8;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
        }
      }
    }
  }

  span {
    position: relative;
    display: inline-block;
  }
}

.upgrade-guide {
  color: #fff;
  width: 100%;
  background: #36363c;
  padding: 20px;
  box-sizing: border-box;

  .upgrade-guide-title {
    text-align: center;
    color: #fff;
    font-size: 22px;
    margin-bottom: 16px;
    position: relative;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      cursor: pointer;
      font-size: 26px;
    }
  }

  p {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.top-setting {
  .upgrade-button {
    text-decoration: underline;
    cursor: pointer;
  }

  > * {
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.compass-box-mobile {
  display: none;
}

.upgrade-bottom {
  display: flex;
  justify-content: center;
}

.upgradeSkin_img {
  width: 180px;
}

.slider-w {
  width: 440px;
}
@media screen and (max-width: 768px) {
  .slider-w {
    width: 100%;
  }
  .upgradeSkin_img {
    width: auto !important;
    height: 60px;
  }

  .title-bar .btns .help-btn {
    margin-left: 15px;
  }

  .upgrade-box {
    width: 100%;
    height: auto;
    background-position: center center;
    padding-bottom: 30px;
    background-size: cover;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 0;

    .frame-content {
      height: auto;
    }

    .top-skin {
      width: 50%;
      height: 200px;
      margin-left: 0;
      background-size: 100% 100%;

      .top-skin-text {
        top: 50px;
        font-size: 13px;
      }

      .top-skin-button {
        width: 50px;
        height: 50px;
        background-size: cover;
        top: 85px;
      }
    }
  }

  .compass-box-mobile {
    display: flex;
    justify-content: center;
  }

  .compass-box-pc {
    display: none;
  }

  .rate-wrapper {
    width: 90%;
  }

  .upgrade-bottom {
    flex-direction: column;
    align-items: center;

    > * {
      margin-top: 10px;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }

  .tip {
    right: 10px !important;

    .hot-to-play {
      width: 300px !important;
      transform: translate(-80%, 100%) !important;
    }
  }
}

.btns-right {
  margin-left: auto;
}

// 我的
.input-group {
  width: 172px;
  background-color: #fff;
  display: flex;
  height: 24px;
  border-radius: 5px;
  overflow: hidden;
}

.input-group input {
  text-indent: 10px;
  flex: 1;
  width: 100%;
}

.upgrade-wrap {
  margin-top: 100px;
  margin-bottom: 100px;
  height: 355px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/img/upgrade-bg-large.png");
  background-repeat: no-repeat;
  background-position: center center;
}

.upgrade-left {
  cursor: pointer;
  left: 0;
  top: 0;
  width: 380px;
  height: 350px;
  position: absolute;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-image: url('@/assets/img/bos/upgrade-left.png');
  background-size: 146px;
  background-position: center right;
  .notSelected-img {
    width: 153px;
    margin-bottom: 10px;
    margin-top: 20px;
  }
}

.upgrade-right {
  right: 0;
  top: 0;
  width: 380px;
  height: 350px;
  position: absolute;
  font-size: 14px;
  text-align: center;
  // background-image: url('@/assets/img/bos/upgrade-right.png');
  background-size: 146px;
  background-position: center left;
  display: flex;
  align-items: center;
  justify-content: center;
  .selected-skin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    .skin-name {
      top: -20px;
      position: relative;
      width: 240px;
      .tag {
        position: absolute;
        left: 100%;
        font-size: 12px;
        color: #99a5b7;
        white-space: nowrap;
      }
    }
    .skin-img {
      position: relative;
      width: 180px;
      height: 135px;
      overflow: hidden;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
      }
    }
    .price-box {
      .price {
        color: #ffb300;
        font-size: 20px;
      }
    }
  }
}

.bigbg {
  background-size: 100%;
  background-repeat: repeat-y;
  min-height: 450px;
}

.card-box {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.text-white {
  color: #ffffff;
}

.card-item {
  flex-shrink: 0;
  width: 176px;
  height: 147px;
  background-color: #ccc;
  border: 1px solid #fff;
}

.ani01 {
  animation: compassAnimation 38s linear infinite;
  -webkit-animation: compassAnimation 38s linear infinite;
}

.ani02 {
  animation: compassAnimation2 38s linear infinite;
  -webkit-animation: compassAnimation2 38s linear infinite;
}

@-webkit-keyframes compassAnimation {
  0% {
    opacity: 0.5;
    transform: rotate(0deg);
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: rotate(360deg);
  }
}

@keyframes compassAnimation {
  0% {
    opacity: 0.5;
    transform: rotate(0deg);
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: rotate(360deg);
  }
}

@-webkit-keyframes compassAnimation2 {
  0% {
    opacity: 0.5;
    transform: rotate(360deg);
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: rotate(0deg);
  }
}

@keyframes compassAnimation2 {
  0% {
    opacity: 0.5;
    transform: rotate(360deg);
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0.5;
    transform: rotate(0deg);
  }
}
.input-left {
  width: 260px;
}
@media screen and (max-width: 600px) {
  .m-upgrade-title {
    color: #ffffff;
    font-size: 17px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .upgrade-box {
    margin-top: 0;
    padding-top: 20px;
  }
  .input-left {
    width: auto;
  }
  .upgrade-wrap {
    width: auto;
    height: 109px;
    margin-left: -15px;
    margin-right: -15px;
    margin-top: 0;
    margin-bottom: 15px;

    .upgradeBg {
      width: 100%;
      height: 100%;
    }

    .compass-box {
      transform: scale(0.4);
    }
  }

  .upgrade-right {
    width: 119px;
    height: 100px;
    right: 0px;
    background-size: 58px;
    img {
      width: 100%;
    }
    .selected-skin {
      .skin-img {
        width: 80px;
        height: 50px;
      }
    }
    .price-box {
      font-size: 10px;
      color: #99a5b7;
      .price {
        font-size: 13px !important;
      }
    }
  }

  .upgrade-left {
    height: 100px;
    width: 119px;
    left: 0px;
    font-size: 12px;
    background-size: 58px;

    img {
      width: 100%;
    }
    .notSelected-img {
      width: 60px;
      margin-bottom: 0;
    }
    .mt-2 {
      margin-top: 0;
    }
    .fs12 {
      font-size: 10px !important;
    }
  }

  .huafei {
    .fs16 {
      font-size: 14px !important;
    }
  }

  .ratediv {
    font-size: 14px;
  }

  .retetext {
    font-size: 12px;
  }

  .upgradeSkin_text {
    font-size: 12px;
    margin-top: 0 !important;
  }

  .ghbtn {
    display: none;
  }

  .mx12 {
    margin-left: 0;
  }

  .input-group {
    width: 130px;
  }
}
</style>

<style lang="scss" scoped>
.upgradeSkin_name {
  display: none;
}
@media screen and (max-width: 768px) {
  .upgradeSkin_name {
    display: flex;
    color: #fff;
    font-size: 14px;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
