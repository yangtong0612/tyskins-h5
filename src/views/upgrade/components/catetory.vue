<template>
    <div class="com-tab-block">
        <div @click="getAllSkin" class="item" :class="activeIndex==-1?'active':''"><img style="width: 30px;" src="@/assets/img/bos/allCategory.png" />
            <p class="text">全部</p>
            <div class="sub-catetory"></div>
        </div>
        <div class="item" v-for="(item, index) in categoryList" :key="index" :class="activeIndex == index ? 'active' : ''">
            <div class="itembtn" @click="selectCate(item, index)">
                 <img :src="processImageUrl(item.icon)">
                 <p class="text"> {{ item.category_name }}</p>
            </div>
            <!-- <div class="sub-catetory">
                <a @click="selectCate(item2, index)" class="" v-for="(item2, index2) in item.children" :key="index2">{{ item2.category_name }}</a>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>

import { ref, reactive, onMounted, toRefs } from 'vue';
import ShopService from "@/services/ShopService";
import { parseSimpleTreeData, processImageUrl } from '@/utils'
const emit = defineEmits(['getAll', 'selectCate']);
const state = reactive({
    categoryList: [],
	activeIndex: -1,
})

const { categoryList, activeIndex } = toRefs(state);



const selectCate = (item, index) => {
	let ids = [];
	// if (item.children && item.children.length > 0) {
	// 	ids = item.children.map(v => {
	// 		return v.id
	// 	})
	// } else {
	// 	ids = [item.id]
	// }


	state.activeIndex = index;
	state.category_ids = item.id;

    emit('selectCate', state.category_ids);
};

const getSkinCategory = () => {
	ShopService.skinCategory().then(res => {

		let list = res.data.data.list;
		let obj = {
			id: 'id',
			pId: 'parent_id',
			rootPId: null
		}

		state.categoryList = parseSimpleTreeData(list, obj);
	})
};

onMounted(() => {
	getSkinCategory();
});



const getAllSkin = () => {
	state.activeIndex = -1;
    emit('getAllSkin');
};
</script>

<style scoped>


.com-tab-block {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    background-color: #17181c;
}

.com-tab-block .item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 150px;
    height: 100px;
    text-align: center;
    cursor: pointer;
    transition: all .2s linear 0s;
}

.com-tab-block .item img {
    width: 58px;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
}
.com-tab-block .item .sub-catetory {
    flex-flow: row wrap;
    position: absolute;
    top: 100%;
    left: 0;
    width: 280px;
    z-index: 1009;
    background-color: #121316;
    display: none;
}

.com-tab-block .item .text {
    margin-top: 10px;
    color: #969696;
    font-size: 14px;
}
.com-tab-block .item:hover {
    color: #fff;
    text-shadow: rgb(23 22 25 / 50%) 0 8px 5px;
    background: rgba(0,0,0,.2);
}
.com-tab-block .item.active img {
    filter: none;
}
.com-tab-block .item:hover .sub-catetory {
    display: flex;
}

.com-tab-block .item .sub-catetory a {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #969696;
    font-family: Microsoft YaHei;
    font-size: 12px;
    font-weight: 400;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 140px;
}

.com-tab-block .item .sub-catetory a:hover {
    background-color: #2a2c33;
}

.com-tab-block .item .sub-catetory a.sub_active {
    color: #ecc214;
}
.itembtn{
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px){
    .com-tab-block {
        // flex-wrap: wrap;
        overflow-x: auto;
        .item{
            flex-shrink: 0;
            width: 80px;
            .text{
                margin-top: 0;
            }
        }
    }
}

</style>