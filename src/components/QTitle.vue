<template>
	<div class="d-flex a-center qtitle">
		<div class="title-text">
			<!-- <span class="mask"></span> -->
			 <span class="left_line"></span>
			 <img class="left_arrow" src="@/assets/img/title-arrows.svg"/>
			 <span class="name">{{title}}</span>
			 <img class="right_arrow" src="@/assets/img/title-arrows.svg"/>
			 <span class="right_line"></span>
		</div>
		<span class="desc"><slot name="desc"></slot></span>
	</div>
</template>

<script  setup>
	import { ref, computed,onMounted } from 'vue';
	import bg from '@/assets/img/qtitlebg.png'
	import bg2 from '@/assets/img/qtitlebg2.png'
	const isMobile = ref(false);
	const onResize = () => {
	        isMobile.value = window.innerWidth < 600
	};
	defineProps({
	    title:{
	        type:String,
	        default:''
	    }
	})
	onMounted(() => {
	  onResize();
	  window.addEventListener('resize', onResize, { passive: true });
	});
	// defineEmits(["edit","delete"])
</script>

<style lang="scss" scoped>
	
	.flex-1{
		flex: 1;
	}
	.qtitle{
		position: relative;
		height: 37px;
		width: 100%;
		flex: 1;
		justify-content: center;
		align-items: center;
		
		.desc{
			position: absolute;
			right: 0;
		}
		
	}
	.qtitle.bg1 {
		color: #BA943B;
		/* background-image: url('@/assets/img/bos/bt1.png'); */
	}
	.qtitle.bg2 {
		color: #3D547D;
		// background-image: url('@/assets/img/bos/bt2.png');
	}
	.titlbg{
		height: 16px;
		// background-image: url('@/assets/img/qtitlebg.png');
		background-repeat: no-repeat;
		background-size: auto 100%;
		flex: 1;
		width: 100%;
	}
	.title-text{
		
		color: #ffffff;
		padding-left: 15px;
		padding-right: 10px;
		display: inline-flex;
		text-align: center;
		position: relative;
		height: 50px;
		line-height: 50px;
		align-items: center;
		.mask{
			// background-color: #e4ae39;
			display: block;
			height: 100%;
			mask: url('@/assets/img/tit_mid.svg') repeat-x 50% 50%;
			position: absolute;
			left: 0;
			width: 100%;
		}
		.left_arrow{
			width: 24px;
		}
		.right_arrow{
			width: 24px;
			transform: scale(-1)
		}
		.left_line {
			flex-grow: 1;
			height: 2px;
			background: linear-gradient(270deg, #fbc300, transparent);
			width: 220px;
			display: inline-block;
		}
		.right_line {
			flex-grow: 1;
			height: 2px;
			background: linear-gradient(270deg,transparent, #fbc300);
			width: 220px;
			display: inline-block;
		}
		.name{
			color: #ffffff;
			position: relative;
			z-index: 9;
			font-size: 26px;
			font-weight: bold;
			padding:0 20px;
		}
		// &::before, &::after{
		// 	background-color: #e4ae39;
		// 	content: "";
		// 	display: block;
		// 	height: 50px;
		// 	left: -46px;
		// 	mask: url('@/assets/img/tit_before.svg') no-repeat 100% 50%;
		// 	position: absolute;
		// 	top: 0;
		// 	width: 47px;
		// 	z-index: 1;
		// }
		// &::after{
		// 	left: auto;
		// 	right: -43px;
		// 	mask: url('@/assets/img/tit_after.svg') no-repeat 100% 50%;
		// }

	}
	@media screen and (max-width: 600px) { 
	        .title-text{
	            font-size: 16px;
				position: absolute;
				left: 50%;
				transform: translate(-50%);
				.name{
					font-size: 16px;
					white-space: nowrap;
					padding: 0 10px;
				}
				.right_line{
					width: 100px;
				}
				.left_line{
					width: 100px;
				}
	        }
			.qtitle.bg1, .qtitle.bg2 {
				background-position: center center;
			}
			.qtitle::before{
				display: none;
			}
			.qtitle.bg1 {
				color: #BA943B;
				// background-image: url('@/assets/img/bos/mbt1.png');
				background-size: 200px 39px;
			}
			.qtitle.bg2 {
				color: #3D547D;
				// background-image: url('@/assets/img/bos/mbt2.png');
				background-size: 200px 39px;
			}
	    }

</style>