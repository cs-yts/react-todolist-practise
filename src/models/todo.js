import { getTodoLists1 } from '@/services/todu';

export default {
  //命名空间
  namespace: 'todoL',
  //状态
  state: {
    todoList: [],
  },
  //调用接口后期数据
  effects: {
    *getTodoList(_, { call, put }) {
      //调用方法获取数据
      const resData = yield call(getTodoLists1);
      yield put({
        type: 'setTodoList',
        payload: resData,
      });
    },
  },
  //更新state
  reducers: {
    setTodoList(state, action) {
      return {
        ...state,
        todoList: action.payload,
      };
    },
  },
};
