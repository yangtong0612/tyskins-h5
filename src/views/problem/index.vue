<template>
    <div class="problem-wrap">
        <v-container>
            <div class="problem-tabs">
                <div class="tab-item" @click="changeIndex(index)" v-for="(title, index) in titles" :key="index"
                    :class="{ active: index == titleIndex }">
                    {{ title.label }}
                </div>
            </div>
            <div class="problem">
                <div v-if="titleIndex == 0" class="tab1">
                    <div class="step">
                        <h3>我拒绝/忽略了机器人发送的报价，会导致我无法取回ooskins库存饰品吗?</h3>
                        <p>对于超过一定时间未接受的交易报价,系统会自动重置库存奖品的状态,当“取回”按钮再次亮起的时候,您可以重新操作取回饰品。
                            请注意，请勿频繁的拒绝Steam交易报价，这会导致交易双方账号被风控，因此造成的账号损失，我方概不负责。</p>
                    </div>
                    <div class="step">
                        <h3>我的充值没有到账，我该怎么办?</h3>
                        <p>请等候5-10分钟。如果还是没有到账,请联系在线客服或发送邮件至 3789944296@qq.com 联系我们,并提供您的SteamlD、支付宝付款
                            详情截图和ooskins账户ID</p>
                    </div>

                    <div class="step">
                        <h3>我收到一个来自ooskins管理员的朋友请求。我可以相信他吗?</h3>
                        <p>如果有人以ooskins管理员、调解员或机器人为昵称添加您,并声称他是我们团队的成员,请记住:他们不是。这是一个诈骗。请举报和拉黑该用户。我们从来不会向您发送我们的控制面板截图。ooskins不会从Steam用户那直接购买任何皮肤,我们从来不会在Steam上添加您，也从来不会向您发送任何文件
                        </p>
                    </div>

                    <div class="step">
                        <h3>如下图所示的交易限制该如何解除?</h3>
                        <p><img src="/novice-1.jpg" alt=""></p>
                        <p class="mt-2">
                            如上图所示可判断此用户为Steam新注册的账户，新注册的Steam账户在完成绑定Steam令牌的同时还需要在Steam商店中消费超过5美元才可解除交易限制，该规定为Steam强制硬性规定，新注册用户均需要完成此操作，消费超过5美元之后在打开社区市场就可以看到详细的解除交易限制的时间了
                        </p>
                        <p class="mt-2">请注意，若账户一年之内未在Steam产生任何一笔消费同样也会触发交易限制，若打开交易市场出现以下提示</p>
                        <p class="mt-2"><img src="/novice-2.jpg" alt=""></p>
                        <p class="mt-2">
                            此时，只需要前往Steam商店购买任意一款游戏，任何金额的都可以，就可触发解除并查看详细的解除交易的时间了以上所有的交易限制的解除时间是可以叠加的，等待账户的交易限制解除之后就可畅游无阻的进行Steam的游戏交易了！若在解除限制的过程中遇到任何问题请联系超级客服协助您进行查询处理
                        </p>
                    </div>
                </div>
                <div v-if="titleIndex == 1" class="tab1">
                    <div class="step">
                        <h3>如果没有Steam令牌？</h3>
                        <p>1. 点击查看令牌绑定教程</p>
                        <p>2. 令牌绑定14后才可交易，届时请访问 ooskins.com 登录并取回您的饰品</p>
                    </div>
                    <div class="step">
                        <h3>操作步骤：</h3>
                        <p>1. 启动加速器，加速Steam社区/商店(推荐使用UU加速器免费加速“Steam社区/商店”)</p>
                        <p>2. 在我的仓库界面，点击“获取交易链接”的文字，跳转Steam网页查看交易链接并复制</p>
                        <p class="mt-2">
                            <img src="/bind-1.jpg" alt="">
                        </p>
                        <p class="mt-2">3. 将复制的交易链接粘贴至“我的库存-交易连接”处并保存 </p>
                        <p class="mt-2">
                            <img src="/bind-2.png" alt="">
                        </p>
                    </div>

                </div>
                <div v-if="titleIndex == 2" class="tab1">
                    <div class="mb-5">
                       <h3> 温馨提示：<br /></h3>
                        1. 所有饰品0冷却，秒取回 <br />
                        2. 此平台需与您的Steam账号绑定 <br />
                        3. 在“正在取回”状态下，请您尽快前往Steam接受报价如果错过时间，您可以重新取回 <br />
                        4. 所有饰品以Steam市场价为基准，回收价格为市场价 <br />
                        5. 如遇暂时缺货的情况，请您稍后再尝试取回或者联系客服。饰品30天后未取回将会被系统全价回收 <br />
                        6. 如果有其他问题请联系客服
                    </div>
                    <div class="step">
                        <h3>如果没有Steam令牌？</h3>
                        <p>1. 在进行以下操作前，请保证您的Steam社区访问已经被成功加速(推荐使用UU加速器免费加速“Steam社区/商店”)</p>
                        <p>2. 在游戏活动中心的“我的库存”点击饰品提取，过几分钟会在Steam界面上您的头像框左边出现一个绿色的新消息图标，点击这个图标</p>
                        <p class="mt-2">
                            <img style="width: 87%;" src="/PC-1.png" alt="">
                        </p>
                        <p class="mt-2">
                            <img src="/PC-2.jpg" alt="">
                        </p>
                        <p class="mt-2">3. 在弹出的菜单中选择“待处理的交易报价”</p>
                        <p class="mt-2">
                            <img src="/PC-3.jpg" alt="">
                        </p>
                        <p class="mt-2">4. 找到您需要取回的物品，然后点击“回应报价”按钮</p>
                        <p class="mt-2">
                            <img src="/PC-4.jpg" alt="">
                        </p>
                        <p class="mt-2">5. 在弹出的窗口中，先选中“准备好交易”按钮，然后点击“接受交易”按钮。</p>
                        <p class="mt-2">
                            <img src="/PC-5.jpg" alt="">
                        </p>
                        <p class="mt-2">6. 完成以上步骤即可成功取回饰品，你学会了吗？</p>
                    </div>
                </div>
            </div>
        </v-container>
    </div>
</template>


<script setup lang="ts">
import { toRefs, reactive, onMounted, watch, inject } from "vue";
const state = reactive({
    titles: [
        { value: '1', label: '常见问题' },
        { value: '2', label: '绑定教程' },
        { value: '3', label: '取回教程' },
    ],
    titleIndex: 0,
});

const { titles, titleIndex } = toRefs(state)

const changeIndex = (index) => {
    state.titleIndex = index;
}
</script>



<style lang="scss" scoped>
.problem {
    background-color: #11151b;
    color: #ffffff;
    font-size: 14px;
    padding: 30px;
    margin-top: 30px;
}

.problem-tabs {
    position: relative;
    display: flex;
    height: 58px;
    padding: 0 15px;
    background-color: #11151b;
    align-items: center;
    margin-top: 20px;

    .right {
        position: absolute;
        right: 10px;
        color: #fff;
        display: flex;
        align-items: center;
        margin-right: 10px;

        .btn {
            margin-left: 20px;
            height: 22px;
            line-height: 22px;
            border-radius: 15px;
            background-color: #FFB300;
            padding: 0 10px;
            font-size: 12px;
            cursor: pointer;
        }
    }

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: #292931;
        left: 20px;
        right: 20px;
        bottom: 0px;
    }

    .tab-item {
        position: relative;
        color: #99A5B7;
        padding: 0 30px;
        height: 58px;
        line-height: 55px;
        cursor: pointer;
        z-index: 9;

        &.active {
            color: #e79d5d;

            &::after {
                content: "";
                position: absolute;
                left: 0px;
                right: 0;
                height: 3px;
                bottom: 0px;
                width: 100%;
                z-index: 9;
                background-color: #e79d5d;
            }
        }
    }
}

.step {
    position: relative;
    margin-bottom: 30px;
    padding-left: 20px;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 4px;
        height: 20px;
        top: 3px;
        border-radius: 10px;
        background-color: #e79d5d;

    }

    h3 {
        font-size: 14px;
        margin-bottom: 10px;
    }

    p {
        font-size: 12px;
        img{
            width: 100%;
        }
    }
    
}</style>