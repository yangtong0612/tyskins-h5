import { PaymentService } from "./../../../services/PaymentService";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

export const useCdk = () => {
  const form = reactive({
    card_no: "",
    card_secret: "",
  });

  const loading = ref(false);

  const reset = () => {
    form.card_no = "";
    form.card_secret = "";
    loading.value = false;
  };

  return {
    form,
    loading,

    submit: async () => {
      let { card_no, card_secret } = form;
      card_no = card_no.trim();
      card_secret = card_secret.trim();

      if (!card_no) {
        ElMessage.warning("请输入卡号");
        return;
      }
      if (!card_secret) {
        ElMessage.warning("请输入卡密");
        return;
      }
      loading.value = true;

      return PaymentService.cdkRecharge(form)
        .then(reset)
        .finally(() => {
          loading.value = false;
        });
    },

    reset,
  };
};
