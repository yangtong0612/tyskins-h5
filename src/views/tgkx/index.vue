<template>
	<Header />
	<Sidebar />
	<div class="tu_imgbox">
		<div class="pc">
			<img :src="processImageUrl('/tgkx/2023_pc_01.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_pc_02.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_pc_03.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_pc_04.jpg')" alt="">
		</div>
		<div class="mb">
			<img :src="processImageUrl('/tgkx/2023_mb_01.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_mb_02.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_mb_03.jpg')" alt="">
			<img :src="processImageUrl('/tgkx/2023_mb_04.jpg')" alt="">
		</div>
	</div>
	
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue'
	import Header from "../../layouts/components/Header.vue";
	import Sidebar from "../../layouts/components/sidebar/Index.vue";
	import { processImageUrl } from "@/utils";
</script>

<style scoped>
	.tu_imgbox{
		padding-top: 80px;
	}
	.tu_imgbox img{
		width: 100%;
		display: block;
	}
	.mb{
		display: none;
	}
	@media screen and (max-width: 768px) {
		.tu_imgbox{
			padding-top: 60px;
		}
		.mb{
			display: block;
		}
		.pc{
			display: none;
		}
	}
</style>