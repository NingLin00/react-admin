import React                         from 'react';
import { Form, Icon, Input, Button } from 'antd';

import { reqLogin } from '../../api';
import { setItem }  from '../../until/storage-tool'

import logo         from '../../assets/images/logo.png';
import './index.less'

 function Login (props) {

  const handleSubmit = (e) => {
    //阻止默认行为
    e.preventDefault();
    //校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    //['field1', 'field2'], options, (errors, values)
    props.form.validateFields(async (error, values) => {
      if (!error) {
        const { username, password} = values;
        const result = await reqLogin(username, password);
        if (result){
          //登录成功
          setItem(result);
          //跳转
          props.history.replace('/')
        }else {
          //登录失败,清空密码输入
          props.form.resetFields(['password'])
        }
      }
    })
  }
  //校验规则validator方法
   const validator = (rule, value, callback) => {
    //rule:当前输入域的对象，内有各种相关属性
     //value：当前输入域的值
     //callback：出现错误的回调函数
     const name = rule.fullField === "username" ? '用户名' : '密码';
     if(!value){
       callback(`必须输入${name}`)
     }else if (value.length < 4 ) {
       callback(`${name}不得少于4位`)
     }else if (value.length > 15 ){
       callback(`${name}不得超过15位`)
     }else if(!/^[a-zA-Z_0-9]+$/.test(value)){
       callback(`${name}只能包含英文字母、数字和下划线`)
     }else {
       callback()
     }
   }

    const { getFieldDecorator } = props.form;
    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {
              getFieldDecorator('username', {
                rules: [
                  {
                    validator: validator
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  className="login-input"/>
              )
            }

          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    validator: validator
                  }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
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
export default Form.create()(Login)