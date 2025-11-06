import { IHttpResponse } from "@/utils/http/IHttpResponse";
import http from "@/utils/http/http";

export class CdkService {
	// 获取CDK列表
	static async list(params: {
		page?: number;
		page_size?: number;
	}): Promise<IHttpResponse> {
		return http('/api/cdk/list', {
			method: 'get',
			params
		});
	}

	// 生成CDK
	static async generate(params: {
		name: string;
		value: number;
		quantity: number;
	}): Promise<IHttpResponse> {
		return http('/api/cdk/generate', {
			method: 'post',
			data: params
		});
	}

	// 删除CDK
	static async delete(id: number): Promise<IHttpResponse> {
		return http(`/api/cdk/${id}`, {
			method: 'delete'
		});
	}
}

