
import React, { Component }       from 'react';
import { Layout }                 from 'antd';
import { Route, Switch, Redirect }from 'react-router-dom';

import Home                     from '../../pages/home/index';
import Category                 from '../../pages/category'
import Product                  from '../../pages/product'
import User                     from '../../pages/user'
import Role                     from '../../pages/role'
import Line                     from '../../pages/line'
import Bar                      from '../../pages/bar'
import Pie                      from '../../pages/pie'
import LeftNav                  from "../../components/left-nav";
import RightHeader              from "../../components/right-header";
import { getItem }              from '../../until/storage-tool'
import { reqValidateUserInfo }  from '../../api'


const { Header, Content, Footer,Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
    isLoading: true,
    success  : false
  };

  async componentWillMount(){
    //渲染之前判断用户是否登录成功
    const user = getItem();
    //刷新登录的
    if (user && user._id) {
      //给后台发请求验证此用户是否存在
      const result = await reqValidateUserInfo(user._id);
      if (result) {
        this.setState({
          isLoading: false,
          success  : true
        })
      }
    }
    this.setState({
      isLoading: false,
      success  : false
    })
  }
  //收缩、展开侧边导航
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed,isLoading, success } = this.state;
    if (isLoading) return null;
    return success ? <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <LeftNav collapsed={collapsed}/>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
          <RightHeader/>
        </Header>
        <Content style={{ margin: '25px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 500 }}>
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product}/>
              <Route path="/user" component={User}/>
              <Route path="/role" component={Role}/>
              <Route path="/charts/line" component={Line}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Redirect to="/home"/>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          use Ant Design ©2019 Created by Ning Lin
        </Footer>
      </Layout>
    </Layout> : <Redirect to='/login'/>;
  }
}