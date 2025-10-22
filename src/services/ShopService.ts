import {IHttpResponse} from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";

interface skinListParam {
    app_id: number
    type: string
    keyword?: string
    order: string
}

interface buyParam {
    skin_id: number
}


export default class ShopService {
    static async buy(params: buyParam): Promise<IHttpResponse> {
        return http('/api/shop/buy', {
            method: 'post',
            data: {...params}
        })
    }

    static async skinList(params: skinListParam, query: {
        page: number;
        page_size: number;
    }): Promise<IHttpResponse> {
        return http('/api/shop/skinList', {
            method: 'post',
            data: {...params},
            params: query,
        })
    }
	
	static async skinCategory() {
	    return http('/api/skinCategory/all', {
	        method: 'post'
	    })
	}
	
	
}
