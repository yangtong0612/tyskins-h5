import { ref, onUnmounted } from "vue";
import { PaymentService } from "@/services/PaymentService";
import TopService from "@/services/TopService";

interface Recharge {
  qrcode: string;
  order_no: string;
}

// 获取汇率
const getRechargeRage = () => {
  return TopService.getConfig("recharge_rate").then((response) => {
    if (response.data.code === 0) {
      return Number(response.data.data.value);
    }
    throw new Error(response.data.msg);
  });
};

// 金额转换
const currencyConversion = async (n: number) => {
  const rechargeRate = await getRechargeRage();
  return n * rechargeRate;
};

let qrcCache: Record<string, Recharge> = {};

// 获取支付宝渠道充值二维码
const getAlipayRecharge = (amount: number) => {
  return PaymentService.getWqkejiRecharge(amount);
};

// 获取其它渠道充值二维码
const getOtherRecharge = (amount: number, method: string) => {
  return PaymentService.recharge({
    pay_method: method,
    amount: amount,
  });
};

// 获取二维码
const getRecharge = (amount: number, method: string) => {
  const task =
    method === "alipay2"
      ? getAlipayRecharge(amount)
      : getOtherRecharge(amount, method);

  return task.then((response) => {
    if (response.data.code === 0) {
      const { qrcode = "", order_no } = response.data.data;
      return {
        qrcode,
        order_no,
      };
    }

    throw new Error(response.data.msg);
  });
};

// 生成二维码
const genQRC = async (amount: number, method: string) => {
  // 缓存
  const key = `${method}_${amount}`;
  if (qrcCache[key]) return qrcCache[key];

  // 调用接口
  return getRecharge(amount, method).then((response) => {
    qrcCache[key] = response;
    return response;
  });
};

// 检测订单状态
const checkOrder = (order_no: string) => {
  return PaymentService.getOrderDetail(order_no).then((res) => {
    if (res.data.code === 0) {
      const { pay_status } = res.data.data;
      return pay_status === 1;
    }
    throw new Error(res.data.msg);
  });
};

export const useRecharge = (config: { onPaymentSuccess: () => void }) => {
  let orderTimer: any = -1;
  //   记录开始时间
  let startTime = -1;
  const { onPaymentSuccess } = config;

  const stopCheckOrder = () => clearInterval(orderTimer);

  onUnmounted(() => {
    stopCheckOrder();
  });

  return {
    handlePayment: async (amount: number, method: string) => {
      const newAmount = await currencyConversion(amount);
      const { qrcode, order_no } = await genQRC(newAmount, method);

      return {
        amount: newAmount,
        qrcode: qrcode,
        order_no,
      };
    },

    checkOrder: (order_no: string) => {
      startTime = Date.now();
      stopCheckOrder();

      orderTimer = setInterval(() => {
        checkOrder(order_no)
          .then((result) => {
            if (result) {
              // 清空二维码的缓存
              qrcCache = {};
              // 停止检查订单
              stopCheckOrder();
              // 回调
              onPaymentSuccess();
              return;
            }
          })
          .finally(() => {
            if (Date.now() - startTime > 1000 * 60 * 6) {
              // 超出六分钟 停止检查订单
              stopCheckOrder();
            }
          });
      }, 2000);
    },

    reset() {
      stopCheckOrder();
    },
  };
};
