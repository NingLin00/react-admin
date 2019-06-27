import React, { Component } from 'react';
import { Card,Form,Button,Input,Cascader,InputNumber,Icon } from 'antd'

import { reqCategories } from '../../../api'
import RichTextEditor from './rich-text-editor'
import './index.less'

const { Item } = Form;

export default class SaveUpdate extends Component {

  state = {
    options: []
  };

  async componentDidMount(){
    const result = await reqCategories('0');
    if (result) {
      //console.log(result)//返回result是一个数组，里面包含了多个一级品类对象
      this.setState({
        options: result.map(item => {
          return {
            value: item.value,
            label: item.name,
            isLeaf: false,
          }
        })
      })
    }
  }
  /**
   * 提交表单
   * @param e
   */
  addProduct = (e) => {
    e.preventDefault();
  }

  /**
   * 商品分类的级联选择
   */
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    console.log(targetOption);
    const result = await reqCategories(targetOption.value)
    if (result) {
      console.log(result)
    }
  }

  /**
   * 返回商品列表页
   * @returns {*}
   */
  returnProductList = () => {
    this.props.history.goBack()
  }
  render() {
    const { options } = this.state;
    //配置表单的基本样式
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    return <Card title={
      <div className="card-title"><Icon type="arrow-left" onClick={this.returnProductList} className="arrow-icon"/><span>添加商品</span></div>
    }>
      <Form {...formItemLayout} onSubmit={this.addProduct}>
        <Item label="商品名称" required={true}>
          <Input placeholder="请输入商品名称" allowClear={true}/>
        </Item>
        <Item label="商品描述">
          <Input placeholder="请输入商品描述" allowClear={true}/>
        </Item>
        <Item label="选择分类" wrapperCol={{span: 5}}>
          <Cascader
            options={options}
            loadData={this.loadData}
            changeOnSelect
            allowClear={false}
            placeholder="请选择"
            defaultValue={['']}
          />
        </Item>
        <Item label="商品价格" >
          <InputNumber
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
            className="input-price"
          />
        </Item>
        <Item　label="商品详情" wrapperCol={{span: 20}}>
          <RichTextEditor/>
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" className="submit-btn">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}