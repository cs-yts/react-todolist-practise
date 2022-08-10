import request from 'umi-request';
import { message } from 'antd';

//请求拦截器
request.interceptors.request.use((url, options) => {
  return {
    // url: `${url}&interceptors=yes`,
    url: `${url}`,
    //支持在请求拦截器中的 options 中添加请求头
    options: { ...options, interceptors: true, headers: { Hello: 'hello' } },
  };
});

//响应拦截器,可以在拦截器里面定义状态返回
request.interceptors.response.use((response) => {
  if (response.status > 400) {
    const codeMaps = {
      404: '未找到',
      502: '网关错误。',
      503: '服务不可用，服务器暂时过载或维护。',
      504: '网关超时。',
    };
    message.error(codeMaps[response.status]);
  }
  return response;
});

// clone response in response interceptor
// request.interceptors.response.use(async response => {
//   const data = await response.clone().json();
//   if (data && data.NOT_LOGIN) {
//     location.href = '登录url';
//   }
//   return response;
// });

export default request;
