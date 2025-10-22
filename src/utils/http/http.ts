// http.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { store } from "@/store";
const isDev = process.env.NODE_ENV === 'development' 
const baseUrl = isDev?'/':import.meta.env.VITE_BASE_URL as string;
const service = axios.create({
  headers: {
    get: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    post: {
      "Content-Type": "application/json;charset=utf-8",
    },
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  transformRequest: [
    (data) => {
      data = JSON.stringify(data);
      return data;
    },
  ],
  //   validateStatus() {
  //     // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
  //     return true;
  //   },
  transformResponse: [
    (data) => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    },
  ],
});

// 请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig) => {
  //获取token，并将其添加至请求头中
  const token = store.state.token || localStorage.getItem("token");
  if (config.headers.Authorization === 'none') {
    config.headers.Authorization = "";
  } else {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

const exclude = ["/user/seed", "/user/details", "/user/inviterInfo", "/freeRoom/addSkin", "/recharge/details"].map(item => '/api' + item);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, } = response;
    const { msg, code } = data;
    if (code !== 0) {
      onResponseError(response);
	  if(code == '20014') {
		  
	  } else {
		  return Promise.reject(data);
	  }
      
    }
    return response;
  },
  (error) => {
    console.log("error", error);
    console.dir(error);
    if (axios.isCancel(error)) {
      console.log("repeated request: " + error.message);
    } else {
      const url = error?.config?.url;
      if (url) {
        const reg = new RegExp(`(${exclude.join("|")})`);
        const isExclude = reg.test(url)
        if (isExclude) return;
      }
      // handle error code
      // 错误抛到业务代码
      error.data = {};
      // error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
      const message = navigator.onLine ? error.message : "您的网络异常，请检查后重试";
      ElMessage.error(message);
    }
    return Promise.reject(error);
  }
);

function onResponseError(response: AxiosResponse) {

  const { data, request } = response;
  
    
  const { msg, code } = data;
  const { responseURL } = request;
  const reg = new RegExp(`(${exclude.join("|")})`);
  const isExclude = reg.test(responseURL)

  if (responseURL.indexOf("/api/backpack/retrieve") > -1) {
    if (code === 20011 || code === 1454 || msg.indexOf("商品价格大于购买最大价格") > -1) {
      ElMessage.error("该饰品缺货，请兑换T币在商城中购买");
      return;
    }

    if (code === 70001) {
      ElMessage.error("提取列表正在排队，请稍后提取");
      return;
    }
    
    if (code === 141005) {
      ElMessage.error("交易链接错误，请重新绑定")
      return;
    }
  }

  if (!isExclude) {
    ElMessage.error(code===401 ? '请先登录' : msg);
  }
}

export default service;
