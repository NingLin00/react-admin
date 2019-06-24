
// 右侧头部组件
import React, { Component }    from 'react';
import { Modal }               from 'antd';
import { withRouter }          from 'react-router-dom';
import dayjs                   from 'dayjs';

import ConmonButton            from "../conmon-button";
import { getItem, removeItem } from '../../until/storage-tool';
import { reqWeather }          from '../../api'
import menuList                from '../../config/menu-config'

import './index.less'

const { confirm } = Modal;

//RightHeader组件
class RightHeader extends Component {
  state = {
    //初始化时间数据
    sysTime   : Date.now(),
    //初始化天气图片
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png',
    weather   : '晴'
  };
  componentWillReceiveProps(nextProps){
    this.title    = this.getTitle(nextProps)
  }
  componentWillMount(){
    //从localStorage获取用户名
    this.username = getItem().username;
    this.title    = this.getTitle(this.props)
  }
  async componentDidMount(){
    //更新时间
    setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    },1000)
    //更新天气
    const result = await reqWeather();
    if (result) {
      this.setState(result)
    }
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
  //获取title的方法
  getTitle = (props) => {
    const { pathname } = props.location;
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      if (menu.children) {
        //二级菜单,判断是否和pathname相等后返回title
        for (let j = 0; j < menu.children.length; j++) {
          const subMenu = menu.children[j];
          if (subMenu.key === pathname) {
            return subMenu.title;
          }
        }
      }else {
        //一级菜单，直接返回title
        if (menu.key === pathname) {
          return menu.title;
        }
      }
    }
  };
  render() {
    const { sysTime,weatherImg, weather } = this.state;
    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <ConmonButton onClick={this.logout}>退出</ConmonButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt="weatherImg"/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}
//向组件传递三大属性
export default withRouter(RightHeader);