import { ref } from "vue";
import { ElMessage } from "element-plus";

export const useMetaData = () => {
  const agreementList = ref(
    [
      "1.我满18岁且具备完全行为能力。",
      "2.购买虚拟物品后不可退款或者换货。",
      "3.取回为第三方发货，通常12H以内发货。",
      "4.请在经济承受能力内进行消费。",
    ].map((title) => ({
      value: true,
      title,
    }))
  );

  // 是否显示协议
  const isShowAgreementList = ref(false);
  // 是否显示成功提示
  const isShowSuccessPrompt = ref(false);

  return {
    presetPaymentAmounts: [5, 25, 50, 100, 200, 300],

    agreementList,
    isShowAgreementList,
    isShowSuccessPrompt,
    handleClickTheAgreementBtn: () => {
      const list = agreementList.value;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].value) {
          ElMessage.warning("请先阅读以下协议并勾选同意");
          break;
        }
      }

      isShowAgreementList.value = false;
    },

    reset() {
      agreementList.value.forEach((item) => (item.value = true));
      isShowAgreementList.value = false;
      isShowSuccessPrompt.value = false;
    },

    // goodsIds: [32753, 32757, 32758, 32759, 32760, 32761, 32762],
  };
};
