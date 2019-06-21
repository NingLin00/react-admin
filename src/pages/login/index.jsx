import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';

import logo from './logo.png';
import './index.less'

 class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {
              getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                  {min: 4, message: '用户名必须大于4位'},
                  {max: 15, message: '用户名必须小于15位'},
                  {pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  className="login-input"/>
              )
            }

          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
              type="password"
              className="login-input"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Form.Item>
        </Form>
      </section>
    </div>;
  }
}
export default Form.create()(Login)