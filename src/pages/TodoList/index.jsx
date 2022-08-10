import React, { useState, useEffect } from 'react';
//继承头部
import { PageContainer } from '@ant-design/pro-layout';

import { Button, Alert, Modal, message } from 'antd';
import ProTable from '@ant-design/pro-table';
//图标引入
import { PlusOutlined } from '@ant-design/icons';
//引入请求方法
import { connect, useSelector, useDispatch } from 'umi';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { addTodo, getTodoLists1, editTodo } from '@/services/todu';

//通过 dva model方式实现数据传输
const Todo = (props) => {
  //刷新todoList(通过models来完成数据共享)
  const getData = () => {
    props.dispatch({
      type: 'todoL/getTodoList',
      payload: null,
    });
  };

  let [isModalVisible, setIsModalVisible] = useState(false);
  ///点击对话框关闭事件(点击X触发的属性)
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  ///打开添加表单事件(为true则弹出对话框)
  const showForm = () => {
    setIsModalVisible(true);
  };

  ///提交表单并表单验证通过后执行的方法
  const handleForm = async (value) => {
    //添加表单
    const res = await addTodo(value);

    if (res.code === 0) {
      //添加成功后则刷新列表
      getData();
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  //首次获取后端数据(但是也是通过models来实现,不过需要生命周期进行管理)
  useEffect(() => {
    getData();
  }, []);
  const { todoList: data } = props;

  //添加状态修改功能(点击修改状态下面的待办,完成,取消就会触发此方法)
  const changsStatus = async (id, status) => {
    console.log(id, status);
    //调用server里面的todo.js中
    const res = await editTodo({ id, status });
    //获取回调结果,并处理
    if (res.code === 0) {
      //添加成功后则刷新列表
      getData();
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  //添加状态栏组件
  const status = [
    <Alert message="待办" type="info" showIcon />,
    <Alert message="已完成" type="success" showIcon />,
    <Alert message="已取消" type="error" showIcon />,
  ];

  //表单字段
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        // console.log('rerecord=', record);
        // return [<Alert message="Success Tips" type="success" showIcon />];.
        // 通过 status 属性完成取值渲染,其中 record.status 就是 data中的 status
        //status 是数组,默认从0开始,0=待办,1=已完成,2=已取消,当传进2时自动匹配已取消
        return status[record.status];
      },
    },
    {
      title: '修改状态',
      //render属性是指定函数
      // render: () => [<a key={0}> 待办 </a>, <a key={1}> 完成 </a>, <a key={2}> 取消 </a>],
      //每个数据只能有2状态,当本身为待办时,后面修改状态就不能出现待办,依次类推
      render: (_, record) => {
        let editOperation = [];
        //分别添加点击事件,changeStatus方法
        //点击按钮后,我们需要提交2个参数,分别是当前条数的id,及当前状态,比如我在第二条点击完成,则传递第二条的id及完成对应的值给后端
        if (record.status != 0) {
          editOperation.push(
            <a onClick={() => changsStatus(record.id, 0)} key={0}>
              {' '}
              待办{' '}
            </a>,
          );
        }
        if (record.status != 1) {
          editOperation.push(
            <a onClick={() => changsStatus(record.id, 1)} key={1}>
              {' '}
              完成{' '}
            </a>,
          );
        }
        if (record.status != 2) {
          editOperation.push(
            <a onClick={() => changsStatus(record.id, 2)} key={2}>
              {' '}
              取消{' '}
            </a>,
          );
        }
        return editOperation;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        //具体字段意思参考官方
        rowKey="id"
        //表单字段
        columns={columns}
        search={false}
        dateFormatter="string"
        //获取数据(直接获取数据)
        dataSource={data}
        //获取数据精简写法(通过请求获取数据)
        // request={async () => ({ data: await getTodoLists1() })}
        //标题
        headerTitle="代办事项列表"
        toolBarRender={() => [
          // 新建按钮  添加点击事件
          <Button type="primary" key="primary" onClick={showForm}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />

      {/* 添加对话框组件*/}
      <Modal title="添加待办事项" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {/* 添加高级表单}
        {/* 点击提交后,我们通过回调函数形式将表单里面的值 value 传递给 handleForm 方法 */}
        <ProForm onFinish={(value) => handleForm(value)}>
          {/* ProFormText等同于 Form.Item + input 结合体 */}
          <ProFormText name="todo" label="待办事项" rules={[{ required: true }]} />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

//获取dva models数据
function mapStateToProps(state) {
  return {
    //todoL 是你命名空间
    todoList: state.todoL.todoList,
  };
}

// export default connect(({ todoL }) => ({ todoL }))(Todo);
export default connect(mapStateToProps)(Todo);
