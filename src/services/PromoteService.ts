import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";

export class PromoteService {
	static async levelSetting(): Promise<IHttpResponse> {
		return http('/api/promote/levelSetting', { method: 'get' })
	}

	static async stat(): Promise<IHttpResponse> {
		return http('/api/promote/stat', { method: 'get' })
	}
	// 获得推广记录的接口
	static async record(params: {
		page: number,
		page_size: number,
		start_time: number,
		end_time:number,

	}): Promise<IHttpResponse> {
		return http('/api/promote/record', {
			method: 'get',
			params
		})
	}

	static async userDetail(params: {
		page?: number,
		page_size?: number,
		keyword?: string,
		start_date?: string,
		end_date?: string
	}): Promise<IHttpResponse> {
		return http('/api/promote/userDetail', {
			method: 'get',
			params
		})
	}
}
