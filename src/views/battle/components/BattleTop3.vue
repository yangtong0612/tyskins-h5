<template>
	<div @click="openRewards" class="flsm_btn">福利说明</div>
	<div v-if="topThreeScoresYesterday.length >= 3" class="top1-3">
		<!-- {{topThreeScoresYesterday}} -->

		<div class="tc fs18 mb-3 text-white" style="font-weight: bold;">昨日三甲</div>

		<div class="top1-3-list">
			<div class="item-box">
				<div class="tx">
					<div class="avatar-radius">
						<img :src="topThreeScoresYesterday[0]?.avatar" alt="">
					</div>
					<img class="txbg" src="@/assets/img/bos/tx_top2.png" alt="">
				</div>
				<div class="text-box">
					<div class="nickname line1">{{ topThreeScoresYesterday[0]?.nickname }}</div>
					<div class="score">{{ processScore(topThreeScoresYesterday[0]?.integral) }}</div>
				</div>
			</div>
			<div class="item-box">
				<div class="tx">
					<div class="avatar-radius">
						<img :src="topThreeScoresYesterday[1]?.avatar" alt="">
					</div>
					<img class="txbg" src="@/assets/img/bos/tx_top1.png" alt="">
				</div>
				<div class="text-box">
					<div class="nickname line1">{{ topThreeScoresYesterday[1]?.nickname }}</div>
					<div class="score">{{ processScore(topThreeScoresYesterday[1]?.integral) }}</div>
				</div>
			</div>
			<div class="item-box">
				<div class="tx">
					<div class="avatar-radius">
						<img :src="topThreeScoresYesterday[2]?.avatar" alt="">
					</div>
					<img class="txbg" src="@/assets/img/bos/tx_top3.png" alt="">
				</div>
				<div class="text-box">
					<div class="nickname line1">{{ topThreeScoresYesterday[2]?.nickname }}</div>
					<div class="score">{{ processScore(topThreeScoresYesterday[2]?.integral) }}</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, computed } from "vue";
import { processScore } from "../util";
import {  useBattleTop } from "../services";

const { topThreeScoresYesterday, runking } = useBattleTop();
const emit = defineEmits(['open'])
const openRewards = () => {
	emit('open')
}

</script>

<style scoped lang="scss">
.top1-3 {
	padding-bottom: 30px;
}

.top1-3-list {
	display: flex;
	height: 230px;
	justify-content: center;
	align-items: flex-end;

	.item-box {
		flex: 1;

		&:nth-child(2) {
			position: relative;
			top: -60px;
		}

		.tx {
			height: 0;
			overflow: hidden;
			padding-bottom: 100%;
			position: relative;

			img {
				width: 100%;
			}

			.txbg {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.avatar-radius {
				height: 0;
				overflow: hidden;
				padding-bottom: 100%;
				border-radius: 50%;
				overflow: hidden;
				position: relative;
				transform: scale(0.7);

				img {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}

	.text-box {
		text-align: center;

		.nickname {
			color: #84848d;
		}

		.score {
			font-size: 12px;
			color: #FFB300;
		}
	}
}

.flsm_btn {
	text-align: center;
	width: 268px;
	height: 32px;
	line-height: 32px;
	background: #e69d5d;
	border-radius: 10px;
	color: #ffffff;
	font-size: 14px;
	text-align: center;
	margin: 14px auto;
	cursor: pointer;
}</style>


