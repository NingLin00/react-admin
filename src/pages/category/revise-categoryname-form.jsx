import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input} from "antd";

const {Item } = Form;

class ReviseCategoryNameForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  };

  validator = (rule, value, callback) => {
    if (!value){
      callback('输入不能为空~')
    }else if (value === this.props.categoryName) {
      //console.log(value,this.props.categoryName);//输入值'string'  当前品类name
      callback('此品类已存在,请勿重复添加~')
    }else {
      callback()
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return <Form>
      <Item>
        {
          getFieldDecorator('categoryName',{
            rules: [{
              validator: this.validator
            }]
          })(
            <Input/>
          )
        }
      </Item>
    </Form>;
  }
}
export default Form.create()(ReviseCategoryNameForm)