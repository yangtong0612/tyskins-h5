<template>
	<Header />
	<Sidebar />
	<div class="tu_imgbox">
		<div class="pc">
			<img :src="imageUrl('/topic/open/01.jpg')" alt="">
			<img :src="imageUrl('/topic/open/02.jpg')" alt="">
			<img :src="imageUrl('/topic/open/03.jpg')" alt="">
     
			
		</div>
		<div class="mb">
			<img :src="imageUrl('/topic/open/mb/01.jpg')" alt="">
			<img :src="imageUrl('/topic/open/mb/02.jpg')" alt="">
			<img :src="imageUrl('/topic/open/mb/03.jpg')" alt="">
			<img :src="imageUrl('/topic/open/mb/04.jpg')" alt="">
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from 'vue'
	import Header from "../../layouts/components/Header.vue";
	import Sidebar from "../../layouts/components/sidebar/Index.vue";

	const imageUrl = (image: string) => {
	let baseUrl = import.meta.env.VITE_BASE_URL as string;
	// return baseUrl + '/' + image;
	return image;
}
</script>

<style scoped lang="scss" >
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
	
	
	.footerbg {
		background-color: #2B3340;
		color: #757D88;
		text-align: center;
	}
	
	.links {
		text-align: center;
	
		a {
			color: #757D88;
			padding: 0 5px;
			margin: 0 5px;
			text-decoration: none;
		}
	}
	
	.copyright {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 12px;
	
		a {
			color: #757D88;
			text-decoration: none;
			font-size: 12px;
		}
	}
	
	.banner-item {
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	
	.layout-main {
		margin-top: 80px;
	}
	
	@media screen and (max-width: 768px) {
		.layout-main {
			margin-top: 60px;
		}
		.copyright{
			display: block;
		}
	}
</style>