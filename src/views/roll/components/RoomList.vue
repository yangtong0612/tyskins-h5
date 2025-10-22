<template>
	<div class="roomlist-box">
		
		<v-row class="room-list" :dense="isMobile?true:false">
			<v-col cols="12" lg="4" v-for="room in listData" :key="room.id" class="">
				<roll-item :rollItemData="room"></roll-item>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed
	} from "vue";
	import {
		useRouter
	} from "vue-router";
	import RollItem from '@/components/RollItem.vue'
const isMobile = computed(()=>window.innerWidth < 600)
	const props =  defineProps({
		 listData: {
		 	type: Array,
		 	default: () => [],
		 },
	 })
		
	const router = useRouter();

	const handleClick = (id: number) => {
		router.push(`/roll/${id}`);
	};
</script>

<style scoped lang="scss">
.roomlist-box{
	// background-color: #f9f9f9;
	padding: 20px;
	
}
	.room-detail-header,
	.room-detail-value {
		display: flex;
		text-align: center;

		span {
			flex: 1;
		}
	}

	.room-item {
		width: 100%;
		height: 100%;
		background-color: #2b2c37;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		border-radius: 6px;

		&:hover {
			background-color: #30313f;
		}

		&.is-official {
			.avatar-wrapper {
				img {
					border-color: #4f5175;
				}
			}
		}
	}

	.avatar-wrapper {
		width: 60px;
		height: 60px;
		position: relative;

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 1px solid transparent;
		}
	}

	.room-name {
		color: #c3c3e2;
		font-size: 15px;
	}

	.room-detail {
		margin-top: 1rem;
		font-size: 13.6px;
		color: #848492;
		width: 100%;

		span {
			line-height: 1.5;
		}
	}

	.room-button {
		width: 100%;
		color: #e9b10e;
		border: 1px solid rgba(233, 177, 14, 0.5);
		border-radius: 22px;
		font-size: 14px;
		padding: 5px 15px;
		text-align: center;
		font-weight: 500;
		cursor: pointer;
		max-width: 200px;
		margin: 0 auto;

		&:hover {
			border: 1px solid #e9b10e;
			background-color: rgba(233, 177, 14, 0.05);
		}
	}

	.room-skin-list {
		height: 60px;

		.room-skin-item {
			height: 100%;
		}
	}

	.lottery-time {
		font-size: 12px;
		width: 100%;
		text-align: center;
	}

	.room-background {
		top: -20%;
		left: 0;
		right: 0;
		width: 100%;
		filter: blur(2px);
		height: 200px;
		opacity: 0.3;
		position: absolute;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>


<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.roomlist-box{
		padding: 0px;
		
	}
}
</style>