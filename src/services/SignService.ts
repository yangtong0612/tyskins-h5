import http from "@/utils/http/http";

export default class SignService {
  static getSign() {
    return http.get("/api/user/sign")
  }


  static postSign() {
    return http.post("/api/user/sign");
  }
 
  static signinConfig() {
    return http.post("/api/signinConfig/list");
  }

}