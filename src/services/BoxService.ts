import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";
import { OpenBoxResponse, SkinListResponse } from "@/types/box";

interface IList {
    type_id?: number,
    rarity_id?: number,
    keyword?: string,
    page?: number,
    page_size?: number;
    box_type?: number;
}

interface IId {
    box_id: any,
    page?: number,
    page_size?: number,
    limit?: number
}

interface IOpen {
    box_id: any,
    num?: number
}

interface IBoxSkin {
    box_id: any,
    page_size: number,
    sort?: string,
    order?: string
}
interface IBoxSkin2 {
	room_id: any,
    box_id: any,
    page_size: number,
    sort?: string,
    order?: string
}

export default class BoxService {
    static async getKeyNumByBoxId(params = {}): Promise<IHttpResponse> {
        return http.get('/api/box/key/count', {
            params
        })
    }

    static async openRecord(params: IId): Promise<IHttpResponse> {
        return http.get('/api/box/openRecord', { params: { ...params } })
    }

    static async openRecord2(params: IId): Promise<IHttpResponse> {
        return http.get('/api/box/unpack/records', { params: { ...params } })
    }

    static async boxSkin(params: IBoxSkin) {
        return http.get<SkinListResponse>('/api/box/skin/list', { params: { ...params } })
    }
	static async battleBoxSkin(params: IBoxSkin2) {
	    return http.get('/api/battle/room/box/skins', { params: { ...params } })
	}

    static async boxsSkins(ids: number[]) {
        return http.post("/api/boxs/skins", {
            box_ids: ids
        });
    }

    static async list(params: IList): Promise<IHttpResponse> {
        return http.get('/api/box/list', {
            params: { ...params }
        })
    }

    static async id(params: IId): Promise<IHttpResponse> {
        return http.get('/api/box/details', { params: { ...params } })
    }

    static async open(params: IOpen) {
        return http.post<OpenBoxResponse>('/api/box/open', { ...params })
    }
    // 普通开箱新接口
    static async unpack(params: IOpen) {
        return http.post<OpenBoxResponse>('/api/box/unpack', { ...params })
    }
    static async tryUnpack(params: IOpen) {
        return http.post<OpenBoxResponse>('/api/box/try/unpack', { ...params })
    }
    static async keyUnpack(params: IOpen) {
        return http.post<OpenBoxResponse>('/api/box/key/unpack', { ...params })
    }
    static async allType(params = {}): Promise<IHttpResponse> {
        return http.get('/api/box/boxType/all', {
            params
        })
    }

    static async unpackRechargeWelfareBox(data) {
        return http.post('/api/rechargeWelfareBox/unpack', data)
    }
    static async boxKeyInfo(params = {}) {
        return http.get('/api/boxKey/info', {
            params
        })
    }


    
}
