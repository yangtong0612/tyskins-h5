
<template>
    <div class="mall-filter-con">
        <div @click="sort" class="sort active">
            <p v-if="order == 'true'">↑ 价格从高到低</p>
            <p v-else>↓ 价格从低到高</p>
        </div>
       
        <div class="input">
            <form action="" auto-complete="off">
                <input v-model="keyword" type="text" placeholder="按名称搜索"></form>
            <div class="search_btn" @click="search">搜索</div>
        </div>
      
       
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

const keyword = ref('')
const exterior = ref('')

const state = reactive({
    exterior_name: ''
})

const options = [
    {
        value: '不艰外观',
        label: '不艰外观',
    },
    {
        value: '崭新出厂',
        label: '崭新出厂',
    },
    {
        value: '略有磨损',
        label: '略有磨损',
    },
    {
        value: '久经沙场',
        label: '久经沙场',
    },
    {
        value: '累痕累累',
        label: '累痕累累',
    },
    {
        value: '无涂装',
        label: '无涂装',
    },
    {
        value: '破损不堪',
        label: '破损不堪',
    },
]
defineProps({
    order: {
        type: String,
        default: 'true'
    },
})

const emit = defineEmits(['sort', 'search', 'change']);

const change = () => {
    if (exterior.value == '不艰外观') {
        state.exterior_name = '';
    } else {
        state.exterior_name = exterior.value;
    }
    emit('change', state.exterior_name);
}

const sort = () => {
    emit('sort');
}
const search = () => {
    emit('search', keyword.value);
}
</script>


<style>
 .mall-filter-con .el-input__wrapper{
    background-color: #18181c;
    box-shadow: none;

 }

 .mall-filter-con .el-select .el-input.is-focus .el-input__wrapper{
    box-shadow: none;
 }
 .mall-filter-con .el-input__wrapper:hover{
    box-shadow: none;
 }
</style>

<style lang="scss" scoped>
.mall-filter-con {
    
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    background-color: #17181c;
    border-top: 1px solid rgba(97,112,146,.5);
}
.mall-filter-con .balance {
    padding-bottom: 10px;
    width: 100%;

    display: flex;
}

.mall-filter-con .balance span {
    color: #efbb0a;
    margin: 0 5px;
}

.svg-icon.addclass svg {
    display: inline-block;
    fill: currentcolor;
    width: 16px;
    height: 16px;
}

.svg-icon.addclass svg path {
    fill: #efbb0a;
}

.mall-filter-con .input{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-left: 16px;
    max-width: 220px;
    height: 32px;
    line-height: 38px;
    font-size: 12px;
    color: #fff;
    background: #233132;
    border-radius: 2px;
    border: 1px solid #f3a55e;
}

 .mall-filter-con .input input{
    max-width: 170px;
    border: none;
    outline: none;
    line-height: 38px;
    background: none;
    color: #fff;
}
.mall-filter-con .input input::placeholder{
    color: #ffffff;
}
.mall-filter-con .input .search_btn {
    cursor: pointer;
    width: 52px;
    height: 32px;
    line-height: 32px;
    background: #f3a55e;
    border-radius: 2px 2px 2px 2px;
    color: #ffffff;
    text-align: center;
}
.ivu-select {
    max-width: 100px;
    margin-left: 5px;
    font-weight: 400!important;
    color: #777798;
}

.mall-filter-con .sort{
    cursor: pointer;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    margin-right: auto;
    text-align: center;
    font-size: 12px;
    color: #6b779b;
    width: 105px;
    height: 38px;
    line-height: 36px;
    border-radius: 6px;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .mall-filter-con {
        .sort{
            // display: none;
        }
        .input{
            position: relative;
            max-width: 100%;
            flex: 1;
            justify-content: flex-start;
            .search_btn{
                position: absolute;
                right: 0;
            }
        }
    }
}
</style>