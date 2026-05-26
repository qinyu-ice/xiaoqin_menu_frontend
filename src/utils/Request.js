import axios from "axios";

// 创建并配置 axios 实例
const Request = axios.create({
    baseURL: 'http://localhost:8101',
    timeout: 5000,
});

// 请求拦截器：动态添加 token
Request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器：统一处理响应数据与错误
Request.interceptors.response.use(
    (response) => {
        const {data} = response;
        // 根据后端约定的业务状态码判断
        if (data.code === 200) {
            return data;
        } else {
            const error = new Error(data.msg || '请求失败');
            error.code = data.code;
            return Promise.reject(error);
        }
    },
    (error) => {
        // HTTP 状态码处理（网络错误、超时、4xx/5xx）
        if (error.response) {
            const {status} = error.response;
            if (status === 401) {
                // token 过期或未登录，清除本地 token 并跳转登录页
                localStorage.removeItem('token');
            } else if (status === 403) {
                console.error('无权限访问');
            } else if (status === 500) {
                console.error('服务器错误');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('请求超时');
        } else {
            console.error('网络异常', error.message);
        }
        return Promise.reject(error);
    }
);

export default Request;