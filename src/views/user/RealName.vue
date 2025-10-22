<template>
    <q-popup wrapClass="reanlname_popup" :width="isMobile ? '94vw' : '400px'" bg=''  title="实名认证" ref="popupRef">
        <div class="pt-2">
            <div class="mt-4">
                <el-input v-model="form.real_name" style="text-align: center;" size="large" placeholder="请输入真实姓名" />
            </div>
            <div class="mt-4">
                <el-input v-model="form.id_card" style="text-align: center;" size="large" placeholder="请输入身份证号"></el-input>
            </div>
            <div class="text-yellow tc py-3 fs12">一张身份证最多可以绑定5个账户</div>
        </div>
        <template #footer>
            <v-btn class="mt-2" @click="submit" block height="40" color="primary" elevation="0">提交</v-btn>
        </template>
    </q-popup>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue';
import QPopup from '@/components/QPopup.vue'
import { UserService } from "@/services/UserService";
import { ElMessage } from "element-plus";
const popupRef = ref(null);
import { useStore } from '@/store'
const store = useStore();
const isMobile = computed(() => window.innerWidth < 600)
const state = reactive({
    form: {
        real_name: '',
        id_card: '',
    }
})
const { form } = toRefs(state);

const submit = () => {
    if (!state.form.real_name.length) {
        ElMessage.error("真实姓名不能为空");
        return;
    }
    if (!state.form.id_card.length) {
        ElMessage.error("身份证号不能为空");
        return;
    }
    UserService.realName({
        real_name: state.form.real_name,
        id_card: state.form.id_card,
    })
        .then(() => {
            ElMessage.success("实名认证成功")
            store.dispatch("getUserInfo")
            close();
        });
}

const open = () => {
    popupRef.value.open();
}

const close = () => {
    popupRef.value.close();
}

defineExpose({
    open,
    close,
})
</script>

<style lang="scss">
.reanlname_popup {
    background-image: url("@/assets/img/bos/popup_bg1.png");
    background-size: 100% 100%;
    .header {
        color: #ffffff !important;
    }
}
</style>