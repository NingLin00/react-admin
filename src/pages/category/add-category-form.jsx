import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select,Input} from "antd";

const {Item } = Form;
const { Option } = Select;

class AddCategoryForm extends Component {
  static propTypes = {
    categoryData: PropTypes.array.isRequired
  };

  //表单校验规则
  validator = (rule, value, callback) =>{
    if (!value) return callback('请输入品类名称~');
    const result = this.props.categoryData.find(category => category.name === value);
    if (result) {
      callback('此品类名称已存在~')
    }else {
      callback()
    }
  };
  render() {
    const { categoryData, form } = this.props;
    const { getFieldDecorator } = form;
    return <Form>
      <Item lable="所属分类">
        {
          getFieldDecorator('parentId',{ initialValue: "0" }
          )(
            <Select style={{ width: '100%' }} onChange={this.handleChange}>
              <Option value="0" key="0">一级分类</Option>
              {
                categoryData.map((category) => {
                  return <Option value={category._id} key={category._id}>{category.name}</Option>
                })
              }
            </Select>
          )
        }
      </Item>
      <Item lable="分类名称">
        {
          getFieldDecorator( 'categoryName', {
            rule: [{
              validator: this.validator
            }]
          })(
            <Input placeholder="请输入分类名称"/>
          )
        }

      </Item>
    </Form>;
  }
}
export default Form.create()(AddCategoryForm)