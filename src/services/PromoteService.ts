import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";

export class PromoteService {
	static async levelSetting(): Promise<IHttpResponse> {
		return http('/api/promote/levelSetting', { method: 'get' })
	}

	static async stat(): Promise<IHttpResponse> {
		return http('/api/promote/stat', { method: 'get' })
	}

	static async record(params: {
		page: number,
		page_size: number
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
