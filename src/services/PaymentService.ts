import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";
import { ResponseData } from "@/types";

interface IRecharge {
  amount: number;
  pay_method: string;
}

interface IPayment {
  channel:string;
  method: string;
  amount: number;
  subject: string;
  body: string;
}

export class PaymentService {
  static async recharge(params: IRecharge): Promise<IHttpResponse> {
    return http("/api/recharge", {
      method: "post",
      responseType: "json",
      data: { ...params },
    });
  }
  
  static async payment(params: IPayment): Promise<IHttpResponse> {
    return http("/api/payment", {
      method: "post",
      responseType: "json",
      data: { ...params },
    });
  }

  // static async getAlipay2Recharge(data: {
  //   amount: number;
  // }): Promise<IHttpResponse> {
  //   return http.post("/api/somisspay/pay", data);
  // }

  static async getAlipay2Recharge(data: {
    amount: number;
    pay_type: string;
  }): Promise<IHttpResponse> {
    return http.post("/api/pay/fuxinka", data);
  }

  static async getAlipayRecharge(data: {
    amount: number;
    goods_id: number;
    is_mobile: boolean;
  }): Promise<IHttpResponse> {
    return http.post("/api/cxka/pay", data);
  }

  static getOrderDetail(order_no: string) {
    return http.get<ResponseData>("/api/recharge/details", {
      params: {
        order_no,
      },
    });
  }

  static cdkRecharge(data: {
    card_no: string;
    card_secret: string;
  }) {
    return http.post<ResponseData>("/api/v2/cdkey/exchange", data);
  }
  static getRechargePackage() {
    return http.get<ResponseData>("/api/rechargePackage/all");
  }
}
