import React, { Component } from 'react';
import { Card, Table, Select, Input, Button, Icon } from 'antd'

import { reqCategoryPageList } from '../../../api/index'
import ConmonButton from '../../../components/conmon-button'
import './index.less'

const { Option } = Select;
export default class Index extends Component {
  state = {
    products: []
  };

  async componentDidMount(){
    const result = await reqCategoryPageList( 1, 4);
    console.log(result)
    if (result) {
      this.setState({
        products: result.list
      })
    }
  }

  render() {
    const { products } = this.state;
    //表头内容
    const columns = [
      {
        title: '商品名称',
        className: 'product-name',
        dataIndex: 'name',//对应数据的name字段
      },
      {
        title: '商品描述',
        dataIndex: 'desc',//对应数据的desc字段
      },
      {
        title: '价格(￥)',
        className: 'product-price',
        dataIndex: 'price',//对应数据的price字段
      },
      {
        title: '状态',
        className: 'product-status',
        dataIndex: 'status',//对应数据的status字段
        render: (status) => {
          return status === 1
            ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        title: '操作',
        className: 'product-status',
        render: (product) => {
          return <div>
            <ConmonButton>商品详情</ConmonButton>
            <ConmonButton>修改</ConmonButton>
          </div>
        }
      }
    ]

    return <Card
      title={
        <div>
          <Select defaultValue={0} className="search-config">
            <Option value={0} key={0}>根据商品名称</Option>
            <Option value={1} key={1}>根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="search-input"/>
          <Button type="primary">搜索</Button>
        </div>
      }
      extra={<Button type="primary"><Icon type="plus"/>添加产品</Button>}>
      <Table
        columns={columns}
        dataSource={ products }
        bordered
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 4,
          pageSizeOptions: ['4','8','12','16']
        }}
        rowKey="_id"
      />
    </Card>;
  }
}