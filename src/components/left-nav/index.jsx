import React, { Component } from 'react';
import { Icon, Menu }       from "antd";
import { Link, withRouter } from 'react-router-dom';
import PropTypes            from 'prop-types';

import menuList             from '../../config/menu-config'

import logo                 from '../../assets/images/logo.png'
import './index.less'

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
  // 接收和约束collapsed(展开侧边导航的判定条件)
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  }
  //多次需要生成列表项，所以提取成createMenu方法，以便复用
  createMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon} />
        <span>{menu.title}</span>
      </Link>
    </Item>
  }
  //在渲染之前生成菜单列表
  componentWillMount(){
    //从三大属性之一的location中拿到pathname。
    const { pathname } = this.props.location;
    //接收展开的列表数据到组件的menus属性上，menus是自定义添加属性
    this.menus = menuList.map((menu) => {
      //判断菜单数据中的某项是否有二级菜单
      const children = menu.children;
      if (children) {
        //进入此项则说明是二级菜单列表
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            children.map(item => {
              if (item.key === pathname) {
                // 说明当前地址是一个二级菜单，需要展开一级菜单
                // 将父级一级菜单的key添加到组件的自定义属性openKey上
                this.openKey = menu.key;
              }
              return this.createMenu(item)
            })
          }
        </SubMenu>
      }else {
        //一级菜单
        return this.createMenu(menu)
      }
    });
    //将pathname添加到组件的selectedKey属性上，selectedKey是自定义添加属性
    this.selectedKey = pathname;
  }
  render() {
    const {collapsed} = this.props;
    return (
      <div>
        <Link className="left-nav-logo" to='/home' >
          <img src={logo} alt="logo"/>
          <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
        </Link>
        <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
          {
            this.menus
          }
        </Menu>
      </div>
    );
  }
}
// withRouter是一个高阶组件，向非路由组件传递三大属性：history、location、match
// withRouter(LeftNav)是向LeftNav组件传递三大属性
export default withRouter(LeftNav);
