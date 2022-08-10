import request from '@/utils/request';

//获取接口数据
export const getTodoLists1 = async () => {
  return request('/api/todolists');
};

//添加TodoList
export const addTodo = async (params) => {
  //(property) RequestMethod<false>.post: RequestMethod
  //<any>(url: string, options?: RequestOptionsInit | undefined) => Promise<any> (+2 overloads)
  const url = '/api/todo';
  const options = { data: params };
  return request.post(url, options);
};

//修改TodoList状态
export const editTodo = async (data) => {
  console.log('service-data=', data);
  const url = '/api/edit';
  const options = { data };
  return request.put(url, options);
};
