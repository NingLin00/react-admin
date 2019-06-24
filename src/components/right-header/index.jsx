
// 右侧头部组件
import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import ConmonButton from "../conmon-button";
import { getItem, removeItem } from '../../until/storage-tool';

import logo from '../../assets/images/logo.png'
import './index.less'

const { confirm } = Modal;

//RightHeader组件
class RightHeader extends Component {
  state = {
    //初始化时间数据
    sysTime : Date.now(),
  }

  componentWillMount(){
    //从localstorage获取用户名
    this.username = getItem().username
  }
  componentDidMount(){
    setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    },1000)
  }
  //退出登录
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
    const { sysTime } = this.state;
    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <ConmonButton onClick={this.logout}>退出</ConmonButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">用户管理</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={logo} alt=""/>
          <span>晴</span>
        </div>
      </div>
    </div>;
  }
}
//向组件传递三大属性
export default withRouter(RightHeader);