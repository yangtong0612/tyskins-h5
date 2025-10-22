<template>
    <div>asdf</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, reactive, nextTick, watchEffect, toRefs, computed } from 'vue';
// import SkinListDialog from "./components/SkinListDialog.vue";
import { BackpackService } from "@/services/BackpackService";
// import SkinList from "./components/SkinList.vue";
import BoxService from "@/services/BoxService";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
const store = useStore();
const boxs = ref<Box[]>([]);
import {
    processImageUrl
} from "@/utils";
const sellBoom = new Audio("/media/sell-boom.aac");
const wrapRef = ref(null);
const arrowVisible = reactive({
    showLeft: false,
    showRight: true,

});

const ruleShow = ref(false);

const state = reactive({
    currentBox: null,
    currentBoxId: 0,
    tempCurrentBox: null,
    lastUnboxRecordList: [],
    roundId: 0,
    position: 0,
    currentItem: {},
    currentIndex: 0,
    result: {},
    unOpenedList: [],
    showUnopen: false,
    discountConfig: [],
});

const { currentBoxId, lastUnboxRecordList, currentBox, result, unOpenedList, showUnopen, discountConfig } = toRefs(state);
watchEffect(() => {
    //   const { box } = props.detail;
    if (!boxs.length) return;

    nextTick(() => {
        if (!wrapRef.value) return;
        registeScrollEvent();
    });
});

const showSkin = ref(false);




const innerLeft = ref(0);
const itemWidth = 171;
const nextScroll = () => {
    innerLeft.value += itemWidth * 3
    registeScrollEvent();
}
const prevScroll = () => {
    innerLeft.value -= itemWidth * 3
    registeScrollEvent();
}

const PLAYNUMBER = 6;
const positionList = ref([
    { position: 1, opened: false, img: '', status: 0, },
    { position: 2, opened: false, img: '', status: 0, },
    { position: 3, opened: false, img: '', status: 0, },
    { position: 4, opened: false, img: '', status: 0, },
    { position: 5, opened: false, img: '', status: 0, },
    { position: 6, opened: false, img: '', status: 0, },
    { position: 7, opened: false, img: '', status: 0, },
    { position: 8, opened: false, img: '', status: 0, },
    { position: 9, opened: false, img: '', status: 0, },
    { position: 10, opened: false, img: '', status: 0, },
])


// 拆箱提示弹框
const showOpenTips = ref(false);
const startBeforClick = (item, index) => {
    state.currentItem = item;
    state.currentIndex = index;
    showOpenTips.value = true;
}
// 剩余开箱数量
const residueNum = computed(() => {
    return positionList.value.filter((item) => !item.opened).length - 4;
});
// 当前层折扣
const currentDiscount = computed(() => {
    let discount = 1;
    console.log('discountConfig', state.discountConfig)
    console.log('nnn', PLAYNUMBER - residueNum.value)
    console.log('剩余可拆数量', residueNum.value)
    if (state.discountConfig.length > 0 && PLAYNUMBER - residueNum.value < PLAYNUMBER) {
        discount = (state.discountConfig[PLAYNUMBER - residueNum.value].discount * 0.1).toFixed(2);
    }
    return discount;

})

// 拆箱状态 拆箱中or未开始
const isStarted = ref(false);
// 点开始拆箱按钮
const startOpenBox = async () => {
    if (!isStarted.value) {
        isStarted.value = true;
    } else {
        return;
    }


    createUnboxRound(state.currentBoxId);
}

const getUnboxDiscountConfigList = async () => {
    const res = await BoxService.getUnboxDiscountConfig();
    state.discountConfig = res.data.data.list
}

// 参与拆箱
const openUnboxRound = async (item, clickIndex) => {
    state.currentIndex = clickIndex;
    state.position = item.position;
    const res = await BoxService.openUnboxRound(state.roundId, state.position);
    const result = res.data.data;
    state.result = result;
    resultDialog.value = true;
    positionList.value[state.currentIndex].img = result.skin_image
    store.dispatch("getUserInfo")
}

// 查看未拆
const viewUnOpened = async () => {
    if (state.showUnopen) {
        return;
    }
    if (residueNum.value == 6) {
	        toast("You need to defuse one case fristly！", "error");
        return;
    }

    const res = await BoxService.closeUnboxRound(state.roundId);
    state.showUnopen = true;
    state.unOpenedList = res.data.data;
}

// 下一局
const nextRound = async () => {
    isStarted.value = false;
    state.showUnopen = false;
    state.result = {};
    if (state.roundId) {
        colseUnboxRound();
    }
}
// 主动结束
const colseUnboxRound = async () => {
    positionList.value = positionList.value.map(v => {
        v.opened = false;
        return v;
    })
    isStarted.value = false;
    if (state.unOpenedList.length > 0) {
        state.roundId = 0;
        return;
    } else {
        const res = await BoxService.closeUnboxRound(state.roundId);
        state.roundId = 0;
    }

}

const sell = () => {

    BackpackService.sell({
        id: state.result.backpack_id,
        convert: 'coin',
    })
        .then((response) => {
            if (response.data.code === 0) {
                sellBoom.play();
                ElMessage.success("Sold");
                store.dispatch("getUserInfo")
                close();
                state.result = {}
            }
        })
        .finally(() => {
            resultDialog.value = false;
            
        });
}



// 创建开箱
const createUnboxRound = async (boxID: number) => {
    const res = await BoxService.createUnboxRound(boxID);
    state.roundId = res.data.data.id;
    showOpenTips.value = false;
}

// 确定创建开箱并参与拆箱
const confirmOpen = async () => {
    isStarted.value = true;
    await createUnboxRound(state.currentBoxId);
    await openUnboxRound(state.currentItem, state.currentIndex);
}

const resultDialog = ref(false);

// 入库
const bePut = () => {
    resultDialog.value = false;
    positionList.value[state.currentIndex].status = 1;
    positionList.value[state.currentIndex].opened = true;
    state.result = {};
}
// 放弃
const giveUp = () => {
    resultDialog.value = false;
    positionList.value[state.currentIndex].status = 2;
    positionList.value[state.currentIndex].opened = true;
    sell()
}
// 关闭 弹框
const closeResultDialog = () => {
    resultDialog.value = false;
    positionList.value[state.currentIndex].opened = true;
}
const showOpenChangeBoxTips = ref(false);
const activeIndex = ref(0);
const tempActiveIndex = ref(0);
const selectBox = (item, index) => {
    if(index === activeIndex.value) {
        return;
    }
    if(isStarted.value) {
        showOpenChangeBoxTips.value = true;
        tempActiveIndex.value = index;
        state.tempCurrentBox = item;
    } else {
        activeIndex.value = index;
        state.currentBox = item;
        state.currentBoxId = item.id;
        getLastUnboxRecord();
    }
}

const confirmSelectBox = (item, index) => {
    showOpenChangeBoxTips.value = false;
    nextRound();
    activeIndex.value = index;
    state.currentBox = item;
    state.currentBoxId = item.id;
    getLastUnboxRecord();
}

const registeScrollEvent = () => {
    // const { scrollLeft, scrollWidth, clientWidth } = wrapRef.value;
    arrowVisible.showLeft = innerLeft.value > 0;
    arrowVisible.showRight = innerLeft.value >= (boxs.value.length - 7) * itemWidth ? false : true;
};


const showPopup = ref(false);

const left = ref(0)
const bottomPopupRef = ref(null);

const skinListDialogRef = ref(null);
const skinListRef = ref(null);
const handleClickBox = (box: Box) => {
    skinListDialogRef.value.open(box);
};

const mouseoverItem = (event, item) => {
    showPopup.value = true;
    skinListRef.value.open(item);
    nextTick(() => {
        let divWidth = bottomPopupRef.value?.clientWidth;
        left.value = event.target?.getBoundingClientRect().left - wrapRef.value?.getBoundingClientRect().left - innerLeft.value + 200;
    })
}

const mouseoutItem = () => {
    showPopup.value = false;
    // left.value = 0;
}
const mouseoverPopup = () => {
    showPopup.value = true;
}
const mouseoutPopup = () => {
    showPopup.value = false;
}


const getBoxTypes = () => {
    return BoxService.allType({
        type: 0,
    }).then((response) => {
        const { data } = response;
        return data.data;
    });
};


const getBoxs = (id: number) => {
    return BoxService.list({
        type_id: id,
        page: 1,
        page_size: 999,
        box_type: 6,// 6 拆箱类型箱子
    }).then((response) => {
        const { list, total } = response.data.data;
        return list.map((item) => ({
            ...item,
            img: processImageUrl(item.img),
            cover: processImageUrl(item.cover),
        }));
    });
};

const getBoxList = () => {
    return getBoxTypes().then((response) => {
        return Promise.all(response.map((type) => getBoxs(type.id))).then(
            (res) => {

                boxs.value = res.flat()
                state.currentBox = boxs.value[0];
                state.currentBoxId = boxs.value[0].id;
            }
        );
    });
};

// 指定箱子最近开箱记录（拆箱欧皇）
const getLastUnboxRecord = async (id: number) => {
    const res = await BoxService.lastUnboxRecord({ box_id: state.currentBoxId, size: 20 });
    const { list } = res.data.data;
    var maxPrice = list[0].skin_price; // 假设第一个对象的分数是最大的

    for (var i = 1; i < list.length; i++) {
        if (list[i].skin_price > maxPrice) {
            maxPrice = list[i].skin_price;
        }
    }
    state.lastUnboxRecordList = list.map(v => {
        if (v.skin_price == maxPrice) {
            v.isCrown = true;
        } else {
            v.isCrown = false;
        }
        return v;
    });


}

onBeforeMount(async () => {
    await getBoxList();
    await getLastUnboxRecord();
});

onMounted(async () => {
    await getUnboxDiscountConfigList()

    // canvasInit('./box.pag', 1, 'boxpag')
})


</script>
