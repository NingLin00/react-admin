
// 右侧头部组件
import React, { Component } from 'react';

import ConmonButton from "../conmon-button";
import { getItem } from '../../until/storage-tool'

import logo from '../../assets/images/logo.png'
import './index.less'


export default class RightHeader extends Component {

  componentWillMount(){
    this.username = getItem().username
  }
  render() {
    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <ConmonButton>退出</ConmonButton>
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