import http from "@/utils/http/http";
import { IHttpResponse } from "@/utils/http/IHttpResponse";

export default class PublicService {
  static async getBanners(): Promise<IHttpResponse> {
    return http("/api/public/banners", {
      method: "get",
      responseType: "json",
    });
  }
  static async getLuckyWheelConfigs() {
    return http("/api/luckyWheelConfigs", {
      method: "get",
      responseType: "json",
    });
  }
  static async startLuckyWheel() {
    return http("/api/luckyWheel", {
      method: "post",
      responseType: "json",
    });
  }

  static async getNotice(): Promise<IHttpResponse> {
    return http("/api/public/getNotice", {
      method: "get",
      responseType: "json",
    });
  }
}
