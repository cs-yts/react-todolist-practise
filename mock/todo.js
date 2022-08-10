let list = [
  { id: '1', title: '小一', status: '0' },
  { id: '2', title: '小二', status: '1' },
  { id: '3', title: '小三', status: '2' },
  { id: '4', title: '小四', status: '0' },
  { id: '5', title: '小伍', status: '0' },
  { id: '6', title: '小六', status: '1' },
  { id: '7', title: '小七', status: '0' },
  { id: '8', title: '小八', status: '2' },
];

export default {
  //获取todo
  'GET /api/todolists': list,

  //req 请求返回的数据
  //res 是接口返回的数据
  //增加todo
  'POST /api/todo': (req, res) => {
    //添加todu
    // res.end(JSON.stringify(req.body))
    //通过 req.body 可以获取传递过来的数据
    //接口官方文档:https://www.expressjs.com.cn/4x/api.html#req.stale
    //定义数组数据
    const item = {
      id: list.length + 1,
      title: req.body.todo,
      status: 0,
    };
    //添加数据
    list.unshift(item);
    //返回添加结果
    res.send({
      code: 0,
      message: '添加代表事项成功',
    });
  },

  //编辑todo
  'PUT /api/edit': (req, res) => {
    //筛选todo
    //send可以根据的要求返回特定的数据,这里是返回传过来的body参数
    // res.send(req.body)
    //解构传过来的参数
    const { id, status } = req.body;
    //根据id筛选我们要找的数据,然后进行状态修改,数组支持直接map的
    //第一种办法直接修改原数组,根据索引进行修改,每给出一个item,就会携带对应的索引id
    list.map((item, index) => {
      if (item.id == id) {
        list[index].status = status;
      }
    });
    //第二种办法,通过item进行修改,生成新的数组,然后替代旧的数组
    // list = list.map((item)=>{
    //   if(item.id == id){
    //     item.status = status
    //     return item
    //   }
    // })

    //返回添加结果
    res.send({
      code: 0,
      message: '修改成功',
    });
  },
};
