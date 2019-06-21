import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';

import logo from './logo.png';
import './index.less'

 class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
  }
  //校验规则validator方法
   validator = (rule, value, callback) => {

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
                  {
                    validator: this.validator
                  }
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
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password"
                  type="password"
                  className="login-input"/>
              )
            }
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