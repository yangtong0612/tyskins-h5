import http from "@/utils/http/http";

export default class TopService {
  static getConfig(key: string) {
    return http.get("/api/setting/get", {
      params: {
        key
      }
    })
  }
  static getConfigAll() {
    return http.get("/api/setting/public")
  }

  static getUpgradeSkinList(params) {
    return http.get("/api/upgrade/skinList", {
      params
    })
  }

  static upgrade(data) {
    return http.post("/api/upgrade", data);
  }

  static getUpgradeRecord(params) {
    return http.get("/api/upgrade/record", {
      params
    })
  }

  static getSkinDetail(skin_id) {
    return http.get("/api/skin/details", {
      params: {
        skin_id
      }
    })
  }
}
