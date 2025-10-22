import { BackpackSkinItem, ResponseData } from "@/types";
import http from "@/utils/http/http";
import { IHttpResponse } from "@/utils/http/IHttpResponse";

interface listParam {
  page?: number;
  page_size?: number;
}

interface sellParams {
  id: number;
}

interface batchSellParams {
  ids?: any;
  all_sell?: boolean;
}

export class BackpackService {
  static async sellRecord(params: listParam): Promise<IHttpResponse> {
    return http("/api/backpack/sellRecord", {
      method: "get",
      params: {
        ...params,
      },
    });
  }

  static async batchSell(params: batchSellParams): Promise<IHttpResponse> {
    if (Array.isArray(params?.ids)) {
      params.ids = Array.from(new Set(params.ids.filter(Boolean)));
    }
    return http("/api/backpack/batchSell", {
      method: "post",
      data: {
        ...params,
      },
    });
  }

  static async sell(params: sellParams): Promise<IHttpResponse> {
    return http("/api/backpack/sell", {
      method: "post",
      data: {
        ...params,
      },
    });
  }

  static async retrieveSkin(params: sellParams): Promise<IHttpResponse> {
    return http("/api/backpack/retrieve", {
      method: "post",
      data: {
        ...params,
      },
    });
  }

  static async retrieveSkin2(params): Promise<IHttpResponse> {
    return http("/api/order/create", {
      method: "post",
      data: {
        ...params,
      },
    });
  }

  static async list(params: listParam) {
    return http.get<
      ResponseData<{
        list: BackpackSkinItem[];
        total: number;
      }>
    >("/api/backpack/list", {
      params: {
        page_size: 12,
        ...params,
      },
    });
  }
}
