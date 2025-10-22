<template>
	<div class="battel-item" :class="setItemBg(detail.status)">
		<!-- {{detail}} -->
		<div class="item-header">
			<div class="d-flex a-center">
				<template v-if="detail.status == 0">
					<i class="status-dot"></i>
					<span class="ml-2">{{ status2str(detail.status) }}</span>
				</template>
				<template v-if="detail.status == 1">
					<i class="status-dot"></i>
					<span class="ml-2">{{ status2str(detail.status) }}</span>
				</template>
				<template v-if="detail.status == 2">
					<i class="status-dot"></i>
					<span class="ml-2">{{ status2str(detail.status) }}</span>
				</template>
			</div>
			<span class="">{{ detail.rounds }}回合</span>
		</div>
		<div class="d-flex aj-center box-h" style="width: 100%;">
			<!-- {{seats}} -->
			<div class="d-flex flex-1 space-between aj-center flex-wrap">
				<div v-for="(user, i) in seats" class="d-flex aj-center flex-1 my-1 battle_users"
					:style="(seats.length == 2 || seats.length == 3) && i == 0 ? 'min-width: 100%;' : 'min-width: 50%;'">
					<template v-if="user.anyone">
						<div v-if="user.winner" class="user-winner">
							<img :src="user.avatar" alt="" />
						</div>
						<img v-else :src="user.avatar" alt="" />
					</template>
					<template v-else>
						<v-avatar size="54">
							<img @click="handleClickButton(user.senoNumber)" style="width: 100%;" src="@/assets/img/bos/add.png" alt="">
						</v-avatar>
					</template>
				</div>

			</div>
		</div>

		<div class="d-flex aj-center">
			<img style="width: 11px;" src="@/assets/img/bos/douzi.svg" alt="">
			<span class="text-yellow fs14 ml-3">{{ detail.price.toFixed(2) }}</span>
		</div>
		<div class="d-flex aj-center mt-2">
			<v-btn style="border-radius: 6px;" @click="handleToBattleDetail(detail)" v-if="detail.status == 1" elevation="0" width="87" height="32" color="#409363">
				<span class="text-white">{{ buttonText }}</span>
			</v-btn>
			<v-btn style="border-radius: 6px;" @click="handleToBattleDetail(detail)" v-else-if="detail.status == 2" elevation="0" width="87" height="32"
				color="#99A5B7">
				<span class="text-white">{{ buttonText }}</span>
			</v-btn>
			<v-btn style="border-radius: 6px;" @click="handleToBattleDetail(detail)" v-else elevation="0" width="87" height="32" color="#4782F5">
				<span class="text-white">{{ buttonText }}</span>
			</v-btn>
		</div>
		<div class="d-flex mt-3 skin-items">
			<!-- {{detail.box}} -->
			<div style="position: relative;" v-for="skin in detail.box">
				<img class="cover" :src="processImageUrl(skin.box_cover)" alt="">
				<img class="img" :src="skin.box_img" alt="">
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	ref,
	toRefs,
	reactive,
	onMounted,
	computed
} from 'vue'
import BattleService from "@/services/BattleService";
import {
	processImageUrl
} from "@/utils";
import {
	processRobot,
	status2str,
	processScore
} from "@/views/battle/util";
import {
	useRouter
} from "vue-router";
import {
	useStore
} from "@/store";
import { emitter } from "@/libs";
import { useJoinRoom } from "../services";


const joinRoom = useJoinRoom();
const router = useRouter();
const store = useStore();
const props = defineProps({
	detail: {
		type: Object,
	}
})

const handleToBattleDetail = (row) => {
	router.push(`/battle-detail/${row.id}`);
};

const seats = computed(() => {
	const {
		detail
	} = props;
	const {
		users,
		num
	} = detail;

	const n = detail.num;
	const seats = [];

	let index = 0;

	for (let i = 0; i < n; i++) {
		index++;
		const user = users.find((user) => user.seat_no === index);
		seats.push({
			anyone: !!user,
			avatar: user?.avatar,
			senoNumber: index,
			winner: user?.winner === 1,
		});
	}
	return seats;
});

const buttonText = computed(() => {
	const {
		status,
		users
	} = props.detail;
	if (status === -1 || status === 2) return "查看";
	if (status === 1) return "观战";

	const userInfo = store.getters.userInfo;
	if (!userInfo) {
		return "挑战";
	}

	const user = users.find((user) => user.user_id === userInfo.user_id);

	if (user) {
		return "查看";
	}
	return "挑战";
});

const loading = ref(false);
const handleClickButton = (senoNumber) => {


	if (loading.value) return;



	const { detail } = props;
	const { id } = detail;
	const { status, users, price } = detail;

	const goto = () => {
		router.push(`/battle-detail/${id}`);
	};

	if (status !== 0) {
		goto();
		return;
	}

	const userInfo = store.getters.userInfo;
	if (!userInfo) {
		emitter.emit("login");
		return;
	}

	const user = users.find((user) => user.user_id === userInfo.user_id);
	console.log(user)
	if (user) {
		goto();
		return;
	}

	if (isNaN(Number(senoNumber))) {
		const targetSeat = seats.value.flat().find((seat) => !seat.anyone);
		if (!targetSeat) {
			console.warn("未找到空座位");
			return;
		}

		senoNumber = targetSeat.senoNumber;
	}

	loading.value = true;
	joinRoom(id, senoNumber!, price)
		.then(goto)
		.finally(() => (loading.value = false));
};

function setItemBg(status) {
	let className = '';
	if (status == 2) {
		className = 'statusbg2'
	} else if (status == 1) {
		className = 'statusbg1'
	}
	return className
}
</script>

<style lang="scss" scoped>
.battel-item {
	background-color: #1f1f29;
	border-radius: 10px;
	padding: 16px;
	.item-header{
		border-radius: 6px;
		height: 40px;
		background: linear-gradient(273deg, #435C88 0%, #5578B3 100%);

		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ffffff;
		padding: 0 10px;
		font-size: 12px;
		.status-dot {
			display: inline-block;
			width: 6px;
            height: 6px;
			background: #73DC2D;
			border-radius: 50%;
			outline: 3px solid rgba(115, 220, 45, 0.2);
		}
	}
}

.statusbg2 {
	// background: linear-gradient(180deg, #FFFFFF 0%, #DBDBDB 100%);
	.item-header{
		background: #363643;
	}
}

.statusbg1 {
	// background: linear-gradient(180deg, #FFFFFF 0%, #FFF6E8 100%);
	.item-header{
		background: #409363;
	}
}

.battle_users {
	img {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		display: block;
		background-color: #eee;
	}
}

.user-winner {
	position: relative;
	// border: 2px solid rgba(255, 170, 0, 1);
	border-radius: 50%;

	&::before {
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		bottom: -15px;
		background: url('@/assets/img/bos/win.png');
		background-size: 100%;
		background-size: 100%;
	}
}

.skin-items {
	height: 40px;
	overflow-x: auto;
	overflow-y: hidden;
	&::-webkit-scrollbar {
		display: none;
		height: 0;
		border-radius: 8px;
		background: #99a5b7;
	}
	&>div{
		width: 45px;
		flex-shrink: 0;
		.cover{
			width: 45px;
		}
		.img{
			width: 40px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}

.skin-items:hover {
	&::-webkit-scrollbar {
		height: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background: #f5f5f5;
		border-radius: 8px;
	}
}


.box-h{
	height: 140px;
}
@media screen and (max-width: 600px) {
	.box-h{
		height: 110px;
	}
	.battel-item {
		padding: 0px;
	}
	.battle_users{
		img{
			width: 37px;
			height: 37px;
		}
	}

}
</style>
