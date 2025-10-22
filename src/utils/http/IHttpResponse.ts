// 接口响应通过格式
export interface IHttpResponse {
  status: number;
  statusText: string;
  data: {
    code: number;
    desc: string;
    [key: string]: any;
  };
}
