import React, { Component } from 'react';
import { Layout } from 'antd';

import './index.less'
import LeftNav from "../../components/left-nav";
import RightHeader from "../../components/right-header";



const { Header, Content, Footer,Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <RightHeader/>
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div className="com-middle">
              <h3 style={{ fontSize: '20px',color: '#707070' }}>欢迎使用硅谷后台管理系统</h3>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            use Ant Design ©2019 Created by Ning Lin
          </Footer>
        </Layout>
      </Layout>
    );
  }
}