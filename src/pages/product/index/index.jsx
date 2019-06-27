import React, { Component } from 'react';
import { Card, Table, Select, Input, Button, Icon } from 'antd'

import { reqCategoryPageList } from '../../../api/index'
import ConmonButton            from '../../../components/conmon-button'
import './index.less'

const { Option } = Select;

export default class Index extends Component {
  state = {
    products: [],//初始化商品数据
    total   : 0,
    loading : true
  };

  async componentDidMount(){
    this.fetchPage( 1,4 );
  }

  /**
   * 请求分页数据
   */
  fetchPage = async ( pageNum, pageSize ) => {
    this.setState({
      loading: true
    })
    //发送请求，获取商品列表
    const result = await reqCategoryPageList( pageNum, pageSize );
    if (result) {
      this.setState({
        products: result.list,
        total   : result.total,
        loading : false
      })
    }
  };
  /**
   * 跳转到添加产品界面
   * @returns {*}
   */
  showAddProduct = () => {
    this.props.history.push('/product/saveupdate')
  }
  render() {
    const { products, total,loading } = this.state;
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
      extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}>
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
        rowKey  ="_id"
        total   ={total}
        loading ={loading}
        onChange={this.fetchPage}
        onShowSizeChange={this.fetchPage}
      />
    </Card>;
  }
}