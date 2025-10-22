import http from "@/utils/http/http";

export default class WelfareBoxService {
  static rechargeWelfareBoxList(params) {
    return http.get("/api/rechargeWelfareBox/list", { params });
  }
}