import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";

export class CdkService {
	// 获取CDK列表
	static async list(params: {
		page?: number;
		page_size?: number;
	}): Promise<IHttpResponse> {
		return http('/api/v2/cdkey/list', {
			method: 'get',
			params
		});
	}

	// 生成CDK
	static async generate(params: {
		name: string;
		value: number;
		quantity: number;
	}, token?: string ): Promise<IHttpResponse> {
		return http('/api/v2/cdkey/generate', {
			method: 'post',
			data: params,
			headers:{
				'Authorization': `Bearer ${token}`,
			}
		});
	}

	// 删除CDK
	static async delete(id: number): Promise<IHttpResponse> {
		return http(`/api/cdk/${id}`, {
			method: 'delete'
		});
	}

	//CDK详情
	static getDetail(params: {
		page?: number;
		page_size?: number;
		cdkey_id?:number;
	}): Promise<IHttpResponse> {
		return http(`/api/v2/cdkey/details`, { 
			method: 'get',
			params,
			headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
	});
	}
	//导出cdk
	static exportCdK(params:{
		cdkey_id?:number;
		separator?:'|'
	}):Promise<IHttpResponse>{
		return http(`/api/v2/cdkey/export`,{
			method:'get',
			params,
			headers:{Authorization:`Bearer ${localStorage.getItem('token') || ''}`}
		})
	}
}

