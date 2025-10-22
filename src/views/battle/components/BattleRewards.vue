<template>
    <v-dialog class="align-center" v-model="dialog" :showFooter="false" title="欧皇福利">
        <div class="rewards-popup">
            <div class="rewards-popup-header">欧皇福利
                <el-icon @click="dialog = false">
                    <Close />
                </el-icon>
            </div>
            <div class="rewards-popup-body">
                <div class="tipsbox">对战榜单每日凌晨00.00定榜，奖励00.05发放</div>
                <ul class="banlist">
                    <li v-for="(item, index) in texts" :key="index">
                        <p>{{ item.text }}</p>
                        <span>
                            <img class="jbimg" src="@/assets/img/bos/douzi.svg" alt="" />
                            {{ item.number }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import QPopup from "@/components/QPopup.vue";
const texts = ref([
    { text: '榜一', number: '888' },
    { text: '榜二', number: '288' },
    { text: '榜三', number: '128' },
    { text: '榜四', number: '66' },
    { text: '榜五', number: '56' },
    { text: '榜六', number: '36' },
    { text: '榜七', number: '26' },
    { text: '榜八', number: '16' },
    { text: '榜九', number: '10' },
    { text: '榜十', number: '8' },
]);

const dialog = ref(false);
const isMobile = computed(() => window.innerWidth < 600);
function open() {
    dialog.value = true;
}
function close() {
    dialog.value = false;
}

// 向父组件暴露以下方法
defineExpose({
    open,
    close,
});
</script>

<style lang="scss" scoped>
.rewards-popup {
    width: 460px;
    background: #1b1b1b;
    border-radius: 2px 2px 2px 2px;
    color: #ffffff;

    .rewards-popup-header {
        text-align: center;
        font-size: 20px;
        padding: 15px 30px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
            position: absolute;
            right: 30px;
            cursor: pointer;
        }
    }

    .rewards-popup-body {
        padding: 20px 30px;
    }

    .tipsbox {
        background-color: rgba(235, 75, 75, 0.1);
        color: #eb4b4b;
        padding: 10px;
    }
}

.battle-rule {
    width: 80vw;
    min-width: 600px;
    max-width: 1200px;
    color: #fff;
    background: #1c192a;

    .battle-rule-title {
        font-size: 24px;
        line-height: 64px;
        background: #28253b;
        text-indent: 32px;
        color: rgba(255, 255, 255, 0.56);
        position: relative;

        img {
            width: 19px;
            height: 19px;
            position: absolute;
            top: 50%;
            right: 32px;
            transform: translateY(-50%);
        }
    }

    .battle-rule-content {
        padding: 20px;
        font-size: 15px;
        line-height: 20px;

        p {
            margin-top: 10px;

            &:first-child {
                margin-top: 0;
            }
        }
    }
}

.banlist {
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        p {
            font-size: 16px;
        }

        span {
            font-size: 14px;
            color: #FFB300;
        }
    }
}

.jbimg {
    height: 11px;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 600px) {
    .battle-rule {
        width: 100vw;
        min-width: 100vw;
    }

    .rewards-popup {
        width: 90vw;
    }
}
</style>
