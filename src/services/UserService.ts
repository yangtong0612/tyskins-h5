import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";
import { useStore } from "@/store";
import { ResponseData, UserRetrievRecordResponse, UserSeedResponse } from "@/types";

interface LoginParams {
  mobile: string;
  code?: string;
  invite_code?: string;
  password?: string;
}

interface PhoneCodeParams {
  mobile: string;
}

interface bindSteamParams {
  trade_url: string;
}

interface exchangeParams {
  num: number | unknown;
}

interface bindInviterParams {
  invite_code: string;
}

interface avatarParams {
  trade_url: string;
  avatar: string;
  nickname: string;
}

interface listParam {
  page?: number;
  page_size?: number;
}

interface myOpenBoxParam {
  page?: number;
  page_size?: number;
}

//封装User类型的接口方法
export class UserService {
  static async inviterInfo(): Promise<IHttpResponse> {
    return http("/api/user/inviterInfo", {
      method: "get",
      responseType: "json",
    });
  }

  static async rechargeRecord(params: listParam): Promise<IHttpResponse> {
    return http("/api/recharge/record", {
      method: "get",
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async myOpenBoxRecord(
    params?: myOpenBoxParam
  ): Promise<IHttpResponse> {
    return http.get("/api/box/myOpenRecord", {
      responseType: "json",
      params: {
        ...params,
      },
    });
  }

  static async login(params: LoginParams): Promise<IHttpResponse> {
    return http("/api/user/login", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static async edit(params: avatarParams): Promise<IHttpResponse> {
    return http("/api/user/edit", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static async sendPhoneCode(params: PhoneCodeParams): Promise<IHttpResponse> {
    return http("/api/public/sendSms", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static async bindSteam(params: bindSteamParams): Promise<IHttpResponse> {
    return http("/api/user/bindSteam", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static async bindInviter(params: bindInviterParams): Promise<IHttpResponse> {
    return http("/api/user/bindInviter", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static async exchange(params: exchangeParams): Promise<IHttpResponse> {
    return http("/api/user/exchange", {
      method: "post",
      responseType: "json",
      data: {
        ...params,
      },
    });
  }

  static setToken(token: string) {
    const store = useStore();

    localStorage.setItem("token", token);
  }

  static logout() {
    localStorage.setItem("token", "");
  }

  static async info(): Promise<IHttpResponse> {
    return http("/api/user/details");
  }

  static seed() {
    return http.get<ResponseData<UserSeedResponse>>("/api/user/seed");
  }

  static changeSeed(seed: string) {
    return http.post("/api/user/seed/set", {
      user_seed: seed,
    });
  }

  static getRetrieveRecords(params: {
    page: number;
    page_size: number;
    status?: number;
    auto_delivery?: number;
    start_time?: string;
    end_time?: string;
  }) {
    return http.get<ResponseData<UserRetrievRecordResponse>>("/api/order/retrieveRecords", {
      params
    })
  }

  static getTodayRecharge(params?) {
    return http.get<ResponseData<{
      today_recharge: number
    }>>("/api/user/todayRecharge", {
      params
    })
  }

  static setPassword(params:{
    password: string
    code: string
  }) {
    return http.post<ResponseData>("/api/user/set/password", params)
  }
  
  static forgetPassword(params:{
    password: string
    code: string
	mobile: string
	type: string
  }) {
    return http.post<ResponseData>("/api/user/forget/password", params)
  }

  static bindMobile(params:{
    mobile: string
    code: string
  }) {
    return http.post<ResponseData>("/api/user/bind/mobile", params)
  }

  static realName(params:{
    real_name: string
    id_card: string
  }) {
    return http.post<ResponseData>("/api/user/auth/realName", params)
  }
  
  static getUserLevel() {
    return http.post("/api/userLevel/list")
  }
}
