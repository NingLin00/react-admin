
// 右侧头部组件
import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';

import ConmonButton from "../conmon-button";
import { getItem, removeItem } from '../../until/storage-tool';

import logo from '../../assets/images/logo.png'
import './index.less'

const { confirm } = Modal;

class RightHeader extends Component {

  componentWillMount(){
    this.username = getItem().username
  }
  logout = () => {
    confirm({
      title: '您确认要退出登录吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        //确认则清除数据
        removeItem();
        // 退出登录
        this.props.history.replace('/login');
      }
    })
  }
  render() {
    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <ConmonButton onClick={this.logout}>退出</ConmonButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">用户管理</span>
        <div className="header-main-right">
          <span>{Date.now()}</span>
          <img src={logo} alt=""/>
          <span>晴</span>
        </div>
      </div>
    </div>;
  }
}
//向组件传递三大属性
export default withRouter(RightHeader);