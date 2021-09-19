import { Layout, Menu, Breadcrumb } from 'antd';
import {
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

type Props = {}

export const MainLayout: React.FC<Props> = props => {
  const [collapsed, setCollapse] = useState(true);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapse(!collapsed)}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="dashboard" icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item>
          <SubMenu key="organisations-and-users" icon={<TeamOutlined />} title="Organisations and users">
            <Menu.Item key="organisations"><Link to="/backoffice/organisations">Organisations</Link></Menu.Item>
            <Menu.Item key="users"><Link to="/backoffice/users">Users</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Clug Backoffice</Footer>
      </Layout>
    </Layout>
  );
}
