import React, { Component } from 'react';
import { Card, Icon, Button, Table } from 'antd';

import ConmonButton from '../../components/conmon-button';
import { reqCategories } from '../../api'

import './index.less';

export default class Category extends Component {
  state = {
    categoryData: []
  }

  async componentDidMount(){
    const result = await reqCategories('0');
    if (result) {
      this.setState({
        categoryData: result
      })
    }
  }
  render() {
    const { categoryData } = this.state;
    //表头内容
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',//对应数据的name字段
      },
      {
        title: '操作',
        className: 'category-operation',//自定义样式
        dataIndex: 'operation',
        render: text => {
          return <div>
            <ConmonButton>修改名称</ConmonButton>
            <ConmonButton>查看其子品类</ConmonButton>
          </div>
        },
      }
    ];
    return <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus"/>添加品类</Button>} >
      <Table
        columns={columns}
        dataSource={categoryData}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['4', '10', '15', '20'],
          defaultPageSize: 4,
          showQuickJumper: true,
          rowKey: '_id'
        }}
      />
    </Card>;
  }
}