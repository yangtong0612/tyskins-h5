<template>
  <div class="mine-sweeping-wrap">
    <div class="mine-tabs">
      <div
        class="tab-item"
        @click="onChangeTab(index)"
        v-for="(item, index) in tabs"
        :key="index"
        :class="{ active: index == tabIndex }"
      >
        {{ item.label }}
      </div>
      <span @click="gzPopupRef.open()" class="game-rules-btn">游戏规则</span>
    </div>
    <div class="mine-sweeping-ontainer mt-4">
      <!-- <div class="mine-sweeping-title">
                <div class="tit-text">
                    排雷战场
                </div>
                <span @click="gzPopupRef.open()" class="game-rules-btn">游戏规则</span>
            </div> -->
      <div v-show="tabIndex == 0" class="mine-sweeping-body">
        <div class="left">
          <div class="m-reward-resetbtn">
            <div class="week-reward" v-if="topLevelReward">
              <div class="tit">本层奖励饰品</div>
              <div class="sink-img">
                <img
                  style="width: 120px"
                  :src="topLevelReward.skin_image"
                  alt=""
                />
              </div>
              <div class="skin-info">
                <div>
                  <div class="text-muted fs12">
                    {{ topLevelReward.skin_exterior }}
                  </div>
                  <div class="fs14">{{ topLevelReward.skin_name }}</div>
                </div>
                <div class="price text-yellow">
                  <img style="width: 11px" src="@/assets/img/bos/douzi.svg" />
                  <span class="fs14 ml-1">{{ topLevelReward.skin_price }}</span>
                </div>
              </div>
            </div>
            <div @click="nextGroup" class="reset-btn">
              <img src="@/assets/img/bos/icon_reset.png" alt="" />
              <div>
                <div class="fs18">刷新战场</div>
                <div class="fs14">试试运气</div>
              </div>
            </div>
          </div>
          <!-- {{ endAward }} -->
          <div class="data-list">
            <div class="title">每层各分布数</div>
            <ul class="list">
              <li
                class="list-item"
                v-for="(item, index) in layerData"
                :key="index"
              >
                <span class="num">{{ item.layer }}</span>
                <div class="price">
                  <img
                    referrerpolicy="no-referrer"
                    style="width: 24px"
                    :src="item.skin_image"
                  />
                  <span>{{ item.skin }}</span>
                </div>
                <div class="price">
                  <img style="width: 18px" src="@/assets/img/bos/icon_zd.png" />
                  <span>{{ item.bomb }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="right">
          <div class="slider-box">
            <div class="btn_arrow left_arrow"></div>
            <div class="skin-list-wrap">
              <div class="skin-list">
                <div
                  class="skin-list-item"
                  :class="`bg_${
                    item.skin_color ? item.skin_color.slice(1) : 'bdc2c2'
                  }`"
                  v-for="(item, index) in currentGroupSkinList"
                  :key="index"
                >
                  <div class="imgbox">
                    <img :src="item.skin_image" alt="" />
                  </div>
                  <div class="skin-name line1">{{ item.skin_name }}</div>
                  <div class="skin-price">
                    <img
                      class="mr-1"
                      style="width: 10px"
                      src="@/assets/img/bos/douzi.svg"
                    />
                    <span>{{ item.skin_price }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn_arrow right_arrow"></div>
          </div>

          <div class="pyramids">
            <!-- {{ pyramid3 }} -->
            <div
              v-for="(lay, i) in pyramid3"
              :key="i"
              class="pyramid-row"
              :class="{
                activeLayer: currentLayer == pyramid3.length - i,
                open: lay.opened == true,
              }"
            >
              <div
                v-for="(pos, j) in lay.col"
                :key="j"
                class="item"
                :class="pos.opened ? 'opened' : ''"
              >
                <div
                  class="card-front"
                  @click="playing(pyramid3.length - i, j + 1, pos)"
                ></div>
                <div class="card-back" :class="pos.active ? 'active' : ''">
                  <img v-show="pos.dist == 1" :src="lay.skin_image" alt="" />
                  <img
                    v-show="pos.dist == 0"
                    class="bombb"
                    src="@/assets/img/bos/bombb.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div v-if="!roomId" class="mask">
              <div @click="createRoomBefore" class="start-btn">
                <span>开始</span>
                <img
                  class="mx-1"
                  style="width: 11px"
                  src="@/assets/img/bos/douzi.svg"
                  alt=""
                />
                <span v-if="currentGroup"> {{ currentGroup.price }}</span>
              </div>
            </div>
            <div
              v-if="roomId && currentLayer > 1"
              @click="closeRoom"
              class="end-btn"
            >
              放弃扫雷
            </div>
          </div>
        </div>
      </div>

      <div v-show="tabIndex == 1" class="mine-sweeping-record">
        <div class="record-list">
          <div class="list-header">
            <div class="col_1">时间</div>
            <div class="col_2">玩家</div>
            <div class="col_3">层数</div>
            <div class="col_4">饰品名称</div>
            <div class="col_5">饰品价值</div>
            <div class="col_6">成功/失败</div>
          </div>
          <div
            class="record-item"
            v-for="(item, index) in recordList"
            :key="index"
            :class="item.room_id % 2 == 1 ? 'bg1' : 'bg2'"
          >
            <div class="col_1">
              {{ $dayjs.unix(item.created_at).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
            <div class="col_2">
              <div class="userinfo">
                <div class="avatar-box">
                  <img :src="processImageUrl(item.avatar)" alt="" />
                </div>
                <div class="nickname">{{ item.nickname }}</div>
              </div>
            </div>
            <div class="col_3">
              <!-- <div v-if="item.layer ==6 && item.success" class="layernum2">{{ item.layer }}  <span>挑战成功</span></div> -->
              <div class="layernum">{{ item.layer }}</div>
            </div>
            <div class="col_4">{{ item.skin_name }}</div>
            <div class="col_5">
              <div class="price">
                <img src="@/assets/img/bos/douzi.svg" alt="" />
                <span class="text-yellow"> {{ item.skin_price }}</span>
              </div>
            </div>
            <div class="col_6">
              <span style="color: #ff8000" v-if="item.success">成功</span>
              <span v-else>失败</span>
            </div>
          </div>
        </div>

        <div class="d-flex py-5 justify-center" style="margin-bottom: 20px">
          <el-pagination
            :page-size="params.page_size"
            :total="total"
            background
            layout="prev, pager, next"
            @current-change="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 玩法说明 -->
  <q-popup
    wrapClass="popup_bg04"
    :width="isMobile ? '100%' : '600px'"
    bg=""
    title="玩法说明"
    ref="gzPopupRef"
  >
    <div class="text-white px-4 py-2" style="line-height: 1.8em">
      <p>
        1.排雷行动共有6层关卡，每次都有对应的奖品（如没有心仪的奖品，玩家可以免费重置战场，直到有心仪的奖品）。
      </p>
      <p>
        2.每一层都有对应数量的炸弹卡片和奖品卡片，玩家开始挑战后，点击激活层的卡片，如果是炸弹则挑战失败（获取随机奖励饰品，并且排雷饰品重置），反之进入到下一层。
      </p>
      <p>
        3.玩家赢取至少一层后，即可放弃挑战，放弃挑战获得当前已开关卡最高层的奖品（例如玩家挑战到第三层，放弃当前挑战，即获得第二层的奖品）。
      </p>
      <p>4.玩家挑战成功即可获得当前排雷最高层的奖品。</p>
    </div>
  </q-popup>

  <!-- 结果弹框 -->
  <q-popup
    @close="resultClose"
    wrapClass="popup_bg01 popup-offset"
    :width="isMobile ? '100%' : '394px'"
    bg=""
    :title="popupTitle"
    ref="resultPopupRef"
  >
    <div class="text-white px-4 py-2" style="line-height: 1.8em">
      <div class="result-popup-box">
        <div class="skin-img">
          <img :src="endAward.image_url" alt="" />
        </div>
        <div class="skin-price">
          <img style="width: 11px" src="@/assets/img/bos/douzi.svg" alt="" />
          <span>{{ endAward.price }}</span>
        </div>
        <div class="skin-name">{{ endAward.item_name }}</div>
        <div class="btns">
          <div @click="sell('coin')" class="btn btn1">兑换</div>
          <div @click="putBackpack()" class="btn btn2">放入背包</div>
        </div>
      </div>
    </div>
  </q-popup>

  <!-- 支付确认 -->
  <q-popup
    wrapClass="popup_bg01 popup-offset"
    :width="isMobile ? '100%' : '394px'"
    bg=""
    title="是否进行挑战？"
    ref="payPopupRef"
  >
    <div class="text-white px-4 py-2" style="line-height: 1.8em">
      <div class="result-popup-box">
        <div class="py-8">
          你需要支付 <span class="text-yellow">{{ currentGroup.price }}</span>
          <img
            class="m-1"
            style="width: 11px"
            src="@/assets/img/bos/douzi.svg"
            alt=""
          />即可开始进行挑战
        </div>
        <div class="btns">
          <div @click="payPopupRef.close()" class="btn btn1">取消</div>
          <div @click="createRoom" class="btn btn2">确认支付</div>
        </div>
      </div>
    </div>
  </q-popup>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed, toRefs } from "vue";
import MinesweepingService from "@/services/MinesweepingService";
import { BackpackService } from "@/services/BackpackService";
import QPopup from "@/components/QPopup.vue";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import { toast } from "@/composables/util.js";
import { processImageUrl } from "@/utils";
const isMobile = computed(() => window.innerWidth < 600);

const soundSuccess = new Audio("/media/mine-sweeping_success.mp3");
const soundFail = new Audio("/media/mine-sweeping_fail.mp3");

const store = useStore();
// 每层各分布数
const layerData = computed(() => {
  let arr = [
    { skin: 1, bomb: 1, layer: 6 },
    { skin: 1, bomb: 2, layer: 5 },
    { skin: 2, bomb: 2, layer: 4 },
    { skin: 2, bomb: 3, layer: 3 },
    { skin: 3, bomb: 3, layer: 2 },
    { skin: 3, bomb: 4, layer: 1 },
  ];
  const tempList = state.reverseCurrentGroupSkinList;
  arr = arr.map((v, index) => {
    v.skin_image = tempList[v.layer - 1]?.skin_image;
    return v;
  });

  return arr;
});
const state = reactive({
  recordList: [],
  tabs: [
    { value: "all", label: "扫雷战场" },
    { value: "new_user", label: "扫雷记录" },
  ],
  params: {
    page: 1,
    page_size: 12,
  },
  tabIndex: 0,
  groupList: [],
  currentGroupIndex: 0,
  currentGroupSkinList: [],
  reverseCurrentGroupSkinList: [],
  currentLayer: -1,
  gameResult: "",
  endAward: {},
  openedDist: [],
  popupTitle: "",
  pyramid3: [
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
      ],
      opened: false,
      layer: 6,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
      ],
      opened: false,
      layer: 5,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
      ],
      opened: false,
      layer: 4,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
      ],
      opened: false,
      layer: 3,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
        { position: 6, opened: false, active: false },
      ],
      opened: false,
      layer: 2,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
        { position: 6, opened: false, active: false },
        { position: 7, opened: false, active: false },
      ],
      opened: false,
      layer: 1,
    },
  ],
});

const total = ref(0);

const {
  groupList,
  currentLayer,
  pyramid3,
  gameResult,
  currentGroupSkinList,
  endAward,
  popupTitle,
  tabs,
  tabIndex,
  recordList,
  params,
} = toRefs(state);
const gzPopupRef = ref(null);
const resultPopupRef = ref(null);
const successPopupRef = ref(null);
const payPopupRef = ref(null);

const onChangeTab = (index) => {
  state.tabIndex = index;
};

const getRecordList = () => {
  MinesweepingService.getRecord(state.params).then((res) => {
    total.value = res.data.data.total;
    state.recordList = res.data.data.list;
  });
};

const onPageChange = (e) => {
  state.params.page = e;
  getRecordList();
};

// 刷新战战场组
const nextGroup = () => {
  if (roomId.value > 0) {
    toast("游戏进行中");
    return;
  }
  if (state.currentGroupIndex < state.groupList.length - 1) {
    state.currentGroupIndex++;
    getCurrentGroupSkinList();
  } else if (state.currentGroupIndex == state.groupList.length - 1) {
    state.currentGroupIndex = 0;
    getCurrentGroupSkinList();
  }
};

// 复位战场
const resetRoom = () => {
  state.currentLayer = -1;
  state.gameResult = "";
  roomId.value = 0;
  state.endAward = {};
  state.pyramid3 = [
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
      ],
      opened: false,
      layer: 6,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
      ],
      opened: false,
      layer: 5,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
      ],
      opened: false,
      layer: 4,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
      ],
      opened: false,
      layer: 3,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
        { position: 6, opened: false, active: false },
      ],
      opened: false,
      layer: 2,
    },
    {
      col: [
        { position: 1, opened: false, active: false },
        { position: 2, opened: false, active: false },
        { position: 3, opened: false, active: false },
        { position: 4, opened: false, active: false },
        { position: 5, opened: false, active: false },
        { position: 6, opened: false, active: false },
        { position: 7, opened: false, active: false },
      ],
      opened: false,
      layer: 1,
    },
  ];
};

// 构造数组结构
const makeArr = () => {
  console.log("asd");
  let arr = [];
  for (let i = 0; i < 6; i++) {}

  return arr;
};

// 关闭结果弹框回调
const resultClose = () => {
  roomId.value = 0;
  resetRoom();
};

// 放入背包
const putBackpack = () => {
  roomId.value = 0;
  resultPopupRef.value.close();
  resetRoom();
};

// 放弃扫雷
const closeRoom = () => {
  state.popupTitle = "恭喜获得";

  giveUp();

  setTimeout(() => {
    resultPopupRef.value.open();
  }, 700);
};
// 中途放弃扫雷
const giveUp = () => {
  MinesweepingService.end({ room_id: roomId.value }).then((res) => {
    let dataReverse = res.data.data.list.reverse();
    state.endAward = res.data.data.backpack;

    // 开中炸弹
    dataReverse.forEach((item, index) => {
      let colb = state.pyramid3[index].col.map((v, idx) => {
        v.dist = item.distribution?.split(",")[idx];
        return v;
      });
      state.pyramid3[index].opened = true;
      state.pyramid3[index].col = colb;
    });
  });
};
// 反转数组方法
function reverseArray(arr) {
  return arr.reduce((reversed, current) => {
    reversed.unshift(current);
    return reversed;
  }, []);
}
// 开始扫雷
const playing = (layer, position, item) => {
  let data = {
    room_id: roomId.value,
    layer,
    position,
  };
  item.opened = true;
  item.active = true;

  var layerIndex = state.pyramid3.length - layer;

  setTimeout(() => {
    state.pyramid3[layerIndex].opened = true;
  }, 600);

  MinesweepingService.start(data).then((res) => {
    let dataReverse = res.data.data.list.reverse();
    // let groupSkin = state.reverseCurrentGroupSkinList.reverse();
    let groupSkin = reverseArray(state.reverseCurrentGroupSkinList);

    // console.log('groupSkin', groupSkin)
    // console.log('dataReverse', dataReverse)

    state.pyramid3 = state.pyramid3.map((v, index) => {
      return {
        opened: v.opened,
        ...dataReverse[index],
        skin_image: groupSkin[index].skin_image,
        skin_name: groupSkin[index].skin_name,
        skin_price: groupSkin[index].skin_price,
        col: v.col,
      };
    });

    if (dataReverse.length == 1) {
      // 中奖了
      let cola = state.pyramid3[layerIndex].col.map((v, idx) => {
        v.dist = dataReverse[0].distribution?.split(",")[idx];
        return v;
      });

      // let image = new Image();
      // image.onload = () => { };
      // image.src = dataReverse[0]?.skin_image;
      state.pyramid3[layerIndex].col = cola;
      soundSuccess.currentTime = 0;
      soundSuccess.play();
    } else {
      // 开中炸弹
      dataReverse.forEach((item, index) => {
        let colb = state.pyramid3[index].col.map((v, idx) => {
          v.dist = item.distribution?.split(",")[idx];
          return v;
        });
        state.pyramid3[index].col = colb;
      });
      soundFail.currentTime = 0;
      soundFail.play();
    }

    let currentLayerData = dataReverse.find((item) => item.layer == layer);

    state.gameResult = currentLayerData.success == true ? "success" : "fail";

    state.endAward = res.data.data.backpack;

    if (state.gameResult == "success") {
      state.popupTitle = "恭喜闯关成功！";
      if (state.currentLayer == 6) {
        setTimeout(() => {
          resultPopupRef.value.open();
        }, 700);
        return;
      }
      state.currentLayer = layer + 1;
    } else {
      state.popupTitle = "失败了！";
      setTimeout(() => {
        state.pyramid3 = state.pyramid3.map((v) => {
          v.opened = true;
          return v;
        });
        setTimeout(() => {
          resultPopupRef.value.open();
        }, 700);
      }, 500);
    }
  });
};

const createRoomBefore = () => {
  payPopupRef.value.open();
};

const roomId = ref(0);
const createRoom = async () => {
  payPopupRef.value.close();
  let id = currentGroup.value.id;
  const res = await MinesweepingService.createRoom({ group_id: id });
  state.currentLayer = 1;
  roomId.value = res.data.data.room_id;
  // MinesweepingService.createRoom({ group_id: id }).then(res => {
  //     console.log(res.code)
  //     store.dispatch("getUserInfo");
  //     roomId.value = res.data.data.room_id;
  // });
  store.dispatch("getUserInfo");
};

const getGroupList = () => {
  MinesweepingService.getGroup({ status: 0 }).then((res) => {
    state.groupList = res.data.data.list;
    getCurrentGroupSkinList();
  });
};
const currentGroup = computed(() => {
  return state.groupList[state.currentGroupIndex];
});
// 计算本层奖励饰品
const topLevelReward = computed(() => {
  let res = {};
  if (state.currentLayer == -1) {
    res = state.currentGroupSkinList.find((item) => item.layer == 1);
  } else {
    res = state.currentGroupSkinList.find(
      (item) => item.layer == state.currentLayer
    );
  }

  return res;
});

const getCurrentGroupSkinList = () => {
  let id = state.groupList[state.currentGroupIndex].id;
  MinesweepingService.getGroupSkin(id).then((res) => {
    let temp = JSON.parse(JSON.stringify(res.data.data.list));
    state.currentGroupSkinList = temp;
    state.reverseCurrentGroupSkinList = res.data.data.list;
  });
};
const loading = ref(false);
const sell = (convert) => {
  loading.value = true;
  roomId.value = 0;
  BackpackService.sell({
    id: state.endAward.id,
    convert: convert,
  })
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success("已出售");
        store.dispatch("getUserInfo");
        close();
      }
    })
    .finally(() => {
      loading.value = false;
      resultPopupRef.value.close();
      resetRoom();
    });
};

const sellAll = async (convert) => {
  const ids = [state.endAward.id];
  if (!ids.length) {
    toast("没有可出售的饰品", "warning");
    return;
  }
  await BackpackService.batchSell({
    ids: ids,
    all_sell: false,
    convert: convert,
  });
  store.dispatch("getUserInfo");
  toast("出售成功");

  resultPopupRef.value.close();
  resetRoom();
};

onMounted(() => {
  getGroupList();
  getRecordList();
});
</script>

<style lang="scss" scoped>
.record-list {
  padding: 0 20px;

  .list-header {
    display: flex;
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.2);
    height: 40px;
    align-items: center;
    font-size: 14px;
    font-weight: bold;

    & > div {
      flex: 1;
      padding: 10px;
    }
  }

  .record-item {
    font-size: 12px;
    color: #ffffff;
    display: flex;
    align-items: center;

    & > div {
      flex: 1;
      padding: 10px;
    }

    // &:nth-child(2n-1) {
    //     background-color: rgba(255, 255, 255, 0.1);
    // }

    &.bg1 {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.bg2 {
      background-color: rgba(255, 255, 255, 0);
    }
  }

  .userinfo {
    display: flex;
    align-items: center;
  }

  .layernum {
    width: 16px;
    height: 20px;
    background-image: url("@/assets/img/bos/numbg.png");
    background-size: contain;
    text-align: center;
    color: #99a5b7;
    font-size: 12px;
  }

  .layernum2 {
    position: relative;
    width: 16px;
    height: 20px;
    background-image: url("@/assets/img/bos/numbg2.png");
    background-size: contain;
    text-align: center;
    color: #ffb300;
    font-size: 12px;

    span {
      white-space: nowrap;
      position: absolute;
      left: 100%;
      margin-left: 4px;
    }
  }

  .price {
    display: flex;
    align-items: center;

    img {
      width: 11px;
      margin-right: 6px;
    }
  }

  .avatar-box {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #eee;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
}

.mine-tabs {
  position: relative;
  display: flex;
  height: 58px;
  padding: 0 15px;
  background-color: #11151b;
  align-items: center;
  margin-top: 20px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: #27272f;
    left: 20px;
    right: 20px;
    bottom: 0px;
  }

  .game-rules-btn {
    position: absolute;
    padding-left: 16px;
    font-size: 14px;
    color: #99a5b7;
    background-image: url("@/assets/img/bos/icon_help.png");
    background-size: 13px;
    background-position: center left;
    right: 20px;
    top: 15px;
    cursor: pointer;
  }

  .tab-item {
    position: relative;
    color: #99a5b7;
    padding: 0 30px;
    height: 58px;
    line-height: 56px;
    cursor: pointer;
    z-index: 9;

    &.active {
      color: #e69c5c;

      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: 0px;
        left: 0px;
        right: 0px;
        height: 3px;
        width: 100%;
        z-index: 9;
        background-color: #e69c5c;
      }
    }
  }
}

.mine-sweeping-wrap {
  width: 1200px;
  height: 1042px;
  background: #11151b;
  margin: 0 auto;
}

.mine-sweeping-title {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 30px 0;

  .tit-text {
    font-size: 24px;
    color: #ffb300;
    font-weight: 500;
  }

  .game-rules-btn {
    position: absolute;
    padding-left: 16px;
    font-size: 14px;
    color: #99a5b7;
    background-image: url("@/assets/img/bos/icon_help.png");
    background-size: 13px;
    background-position: center left;
    right: 30px;
    cursor: pointer;
  }
}

.mine-sweeping-body {
  padding: 0px 20px 30px 20px;
  display: flex;

  .left {
    width: 280px;
    margin-right: 22px;
    color: #ffffff;

    .week-reward {
      height: 282px;
      background: linear-gradient(360deg, #354369 0%, #343945 100%);
      border-radius: 2px 2px 2px 2px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 20px;

      .sink-img {
        width: 130px;
        height: 130px;
        background-image: url("@/assets/img/bos/skin-img-bg.png");
        background-size: 80%;
        background-position: center center;
        position: relative;

        img {
          width: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .tit {
        font-size: 16px;
        font-weight: 500;
      }

      .skin-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .reset-btn {
      width: 100%;
      height: 90px;
      background-color: #555a68;
      display: flex;
      align-items: center;
      margin-top: 20px;
      padding-left: 37px;
      border-radius: 10px;
      cursor: pointer;

      img {
        width: 54px;
        margin-right: 10px;
      }
    }

    .data-list {
      background: #182033;
      padding: 20px 10px 20px 10px;
      margin-top: 20px;

      .title {
        width: 260px;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px auto;
        background: linear-gradient(
          90deg,
          rgba(71, 130, 245, 0),
          rgba(71, 130, 245, 0.19),
          rgba(71, 130, 245, 0)
        );
      }

      .list {
        display: flex;
        flex-direction: column;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          background-color: #27324b;
          padding: 0 20px;
          margin-bottom: 5px;

          .num {
            width: 16px;
            height: 20px;
            background-image: url("@/assets/img/bos/numbg.png");
            background-size: contain;
            text-align: center;
            color: #99a5b7;
            font-size: 12px;
          }

          img {
            margin-right: 4px;
          }

          .price {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }

  .right {
    flex: 1;
    overflow: hidden;

    .slider-box {
      display: flex;
      align-items: center;

      .btn_arrow {
        width: 28px;
        height: 40px;
        display: flex;
        align-items: center;
        cursor: pointer;

        &::after {
          opacity: 0.6;
          content: "";
          width: 12px;
          height: 20px;
          display: inline-block;
          background-image: url("@/assets/img/bos/arrow.png");
          background-size: contain;
        }
      }

      .right_arrow {
        justify-content: flex-end;

        &::after {
          transform: scaleX(-1);
        }
      }

      .skin-list-wrap {
        flex: 1;
        overflow: hidden;
        width: 100%;
      }

      .skin-list {
        display: flex;

        .skin-list-item {
          width: 123px;
          height: 125px;
          flex-shrink: 0;

          .imgbox {
            position: relative;
            width: 80px;
            height: 80px;
            background-image: url("@/assets/img/bos/skin-img-bg.png");
            background-size: 80%;
            background-position: center center;
            margin: 0 auto;

            img {
              width: 70%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) scale(1.2);
            }
          }

          text-align: center;

          // 自定义颜色
          &.bg_ff8789 {
            background: linear-gradient(360deg, #8a353c 0%, #46373b 100%);
            border-bottom: 4px solid #eb323f;
          }

          &.bg_bdc2c2 {
            background: linear-gradient(360deg, #99a5b7 0%, #384657 100%);
            border-bottom: 4px solid #b1bed2;
          }

          &.bg_4d82da {
            background: linear-gradient(360deg, #354369 0%, #343945 100%);
            border-bottom: 4px solid #3c57b4;
          }

          &.bg_e448e2 {
            background: linear-gradient(360deg, #b860bc 0%, #612c64 100%);
            border-bottom: 4px solid #f861ff;
          }

          &.bg_d6b45b {
            background: linear-gradient(360deg, #957c1e 0%, #4d4831 100%);
            border-bottom: 4px solid #fec900;
          }

          .skin-name {
            color: #ffffff;
            padding: 0 10px;
            font-size: 14px;
          }

          .skin-price {
            font-size: 12px;
            color: #ffb300;
          }
        }
      }
    }
  }
}

.pyramids {
  color: #fff;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  position: relative;

  .pyramid-row {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;
    pointer-events: none;

    &.activeLayer {
      opacity: 1;
      pointer-events: auto;
    }

    .item {
      position: relative;
      cursor: pointer;
      width: 106px;
      height: 97px;
      margin: 5px 4px;
      border-radius: 4px;
      box-sizing: border-box;

      .card-front,
      .card-back {
        left: 0;
        top: 0;
        position: absolute;
        transition: transform 500ms;
        backface-visibility: hidden;
      }

      .card-front {
        width: 106px;
        height: 98px;
        background-image: url("@/assets/img/bos/card-front.png");
        background-size: contain;
        border-radius: 4px;
        -webkit-transform: perspective(300) rotateY(0);
        z-index: 900;
      }

      .card-back {
        border-radius: 4px;
        width: 106px;
        height: 97px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(0deg, #957c1e, #4d4831);
        transform: rotateY(-180deg);
        z-index: 100;
        border: 4px;

        img {
          width: 80%;
        }

        &::after {
          position: absolute;
          display: inline-block;
          content: "";
          width: 70px;
          height: 70px;
          background-image: url("@/assets/img/bos/skin-img-bg.png");
          background-size: 100%;
          background-position: center center;
        }
      }

      .card-back.active {
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 5px rgba(255, 255, 255, 1);
      }
    }
  }

  .open .item .card-front {
    -webkit-transform: perspective(300) rotateY(180deg);
  }

  .open .item .card-back {
    z-index: 150;
    -webkit-transform: perspective(300) rotateY(0deg);
  }

  .opened.item .card-front {
    -webkit-transform: perspective(300) rotateY(180deg);
  }

  .opened.item .card-back {
    z-index: 150;
    -webkit-transform: perspective(300) rotateY(0deg);
  }
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 399;
  display: flex;
  align-items: center;
  justify-content: center;

  .start-btn {
    width: 130px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3a55e;
    color: #443d2b;
    cursor: pointer;
  }
}

.end-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 120px;
  height: 40px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3a55e;
  color: #443d2b;
  cursor: pointer;
}

.result-popup-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .skin-img {
    img {
      width: 120px;
    }
  }

  .skin-name {
    font-size: 14px;
  }

  .skin-price {
    color: #ffb300;

    span {
      margin-left: 4px;
    }
  }

  .btns {
    display: flex;

    .btn {
      width: 100px;
      height: 30px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      margin-top: 20px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn1 {
      background-color: #ffb300;
      margin-right: 10px;
    }

    .btn2 {
      background-color: #f3a55e;
    }
  }
}
</style>

<style lang="scss">
.popup-offset {
  margin-left: 340px;
}

.bombb {
  width: 50px !important;
}

@media screen and (max-width: 768px) {
  .popup-offset {
    margin-left: 0px;
  }

  .bombb {
    width: 30px !important;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .mine-sweeping-wrap {
    width: 100%;
    height: auto;
  }

  .mine-sweeping-body {
    flex-direction: column-reverse;
    padding: 0px 10px 10px 10px;

    .left {
      width: 100%;
      margin-right: 0;

      .week-reward {
        flex: 1;

        .skin-info {
          .fs14 {
            font-size: 12px !important;
          }
        }
      }

      .m-reward-resetbtn {
        display: flex;

        .reset-btn {
          width: 104px;
          height: auto;
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-left: 5px;
          padding-left: 0;
          justify-content: center;
          align-items: center;
          text-align: center;

          img {
            margin-right: 0;
            margin-bottom: 26px;
          }

          .fs14 {
            font-size: 12px !important;
          }
        }
      }
    }

    .right {
      width: 100%;
      flex: auto;

      .slider-box {
        .btn_arrow {
          width: 20px;
        }

        .skin-list-wrap {
          overflow: auto;
        }

        .skin-list {
          .skin-list-item {
            padding-top: 5px;
            width: 83px;
            height: 84px;

            .imgbox {
              width: 60px;
              height: 60%;
              background-size: 70%;

              img {
                width: 80%;
              }
            }

            .skin-name {
              font-size: 11px;
            }
          }
        }
      }
    }
  }

  .pyramids {
    margin-bottom: 20px;

    .pyramid-row {
      .item {
        width: 45px;
        height: 41px;
        margin: 3px 3px;

        .card-front {
          width: 45px;
          height: 41px;
        }

        .card-back {
          width: 45px;
          height: 41px;
        }
      }
    }
  }
}
</style>
