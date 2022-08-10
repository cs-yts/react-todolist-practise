import { outLogin } from '@/services/ant-design-pro/api';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin, Badge } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { getTodoLists1 } from '@/services/todu';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  //获取数据
  const [todoNum, setTodoNum] = useState([]);
  useEffect(async () => {
    const result = await getTodoLists1();
    const len = result.filter((item) => item.status == 0).length;
    setTodoNum(len);
    console.log(len);
  }, []);

  //设置点击跳转
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;

      if (key === 'todo') {
        history.push(`/todo`);
        return;
      }

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  // const menuItems: ItemType[] = [
  //   ...(menu
  //     ? [
  //         {
  //           key: 'center',
  //           icon: <UserOutlined />,
  //           label: '个人中心',
  //         },
  //         {
  //           key: 'settings',
  //           icon: <SettingOutlined />,
  //           label: '个人设置',
  //         },
  //         {
  //           type: 'divider' as const,
  //         },
  //       ]
  //     : []),
  //   {
  //     key: 'todo1',
  //     icon: <UnorderedListOutlined />,
  //     label: '代办事项',
  //   },
  //   {
  //     key: 'logout',
  //     icon: <LogoutOutlined />,
  //     label: '退出登录',
  //   },
  // ];

  // const menuHeaderDropdown = (
  //   <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  // );
  // 定义下拉菜单列表项
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <UserOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="todo">
        <UnorderedListOutlined />
        代办事项
        {/* offset 是设置偏移量,在api里面有这个参数 */}
        <Badge count={todoNum} offset={[10, 0]} />
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <Badge count={todoNum} offset={[70, 5]} dot={true} />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
