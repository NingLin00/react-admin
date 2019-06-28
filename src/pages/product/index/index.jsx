import React, { Component } from 'react';
import { Card, Table, Select, Input, Button, Icon, message } from 'antd'

import { reqCategoryPageList,reqUpdateProductStatus, reqSearchProduct } from '../../../api/index'
import ConmonButton            from '../../../components/conmon-button'
import './index.less'

const { Option } = Select;

export default class Index extends Component {
  state = {
    products: [],//初始化商品数据
    total   : 0,
    loading : true,
    searchType: 'productName',
    searchContent: '',
    pageSize: 3,
    pageNum: 1
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
    const { searchType, searchContent } = this.state;
    let promise = null;
    //this.isSearch 当点击搜索时 则发请求查询，否则不发请求、定义在122行
    if (this.isSearch && searchContent) {
      promise = reqSearchProduct({searchType, searchContent, pageSize, pageNum})
    }else {
      promise = reqCategoryPageList( pageNum, pageSize );
    }
    //发送请求，获取商品列表
    const result = await promise;
    if (result) {
      this.setState({
        products: result.list,
        total   : result.total,
        loading : false,
        pageSize,
        pageNum
      })
    }
  };
  /**
   * 跳转到添加产品界面
   * @returns {*}
   */
  showAddProduct = () => {
    this.props.history.push('/product/saveupdate')
  };
  /**
   * 修改产品,跳转到修改产品页面
   * @param product
   * @returns {Function}
   */
  modifyProduct = ( product ) => {
    return () => {
      //跳转到修改产品页面，并传选中的修改对象的信息
      // console.log(product);//信息存放在跳转后页面组件的props.location.state内
      this.props.history.push( '/product/saveupdate', product )
    }
  };
  /**
   * 更新产品状态，上下架
   * @param product
   * @returns {Function}
   */
  updateStatus = (product) => {
    return async () => {
      const productId = product._id;
      const status = 3 - product.status;
      const result = await reqUpdateProductStatus( productId, status );
      if (result) {
        message.success('操作成功~');
        this.setState({
          products: this.state.products.map(item => {
            if (item._id === productId) {
              return {...item, status}
            }
            return item
          })
        })
      }
    }
  }
  /**
   * 配置条件进行搜索
   * @param stateName
   * @returns {Function}
   */
  handleSelect = (stateName) => {
    return (e) => {

      let value = '';
      if (stateName === 'searchType') {
        value = e
      }else {
        value = e.target.value;
        if (!value) this.isSearch = false;
      }
      this.setState({
        [stateName]: value
      })
    }
  }
  /**
   * 根据搜索条件搜索
   */
  search = () => {
    // 收集数据
    const { searchContent, pageSize, pageNum } = this.state;
    if (searchContent) {
      // 发送请求，请求数据
      this.isSearch = true;
      this.fetchPage(pageNum, pageSize);
    } else {
      message.warn('请输入搜索内容~', 1);
    }
  }
  render() {
    const { products, total, loading } = this.state;
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
        //dataIndex: 'status',//对应数据的status字段
        render: (product) => {
          return product.status === 1
            ? <div><Button type="primary" onClick={this.updateStatus(product)}>上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary" onClick={this.updateStatus(product)}>下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        title: '操作',
        className: 'product-status',
        render: (product) => {
          return <div>
            <ConmonButton>商品详情</ConmonButton>
            <ConmonButton onClick={this.modifyProduct(product)}>修改</ConmonButton>
          </div>
        }
      }
    ]

    return <Card
      title={
        <div>
          <Select defaultValue="productName" onChange={this.handleSelect('searchType')} className="search-config" >
            <Option value="productName" key={0}>根据商品名称</Option>
            <Option value="productDesc" key={1}>根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" onChange={this.handleSelect('searchContent')} className="search-input"/>
          <Button type="primary" onClick={this.search}>搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}>
      <Table
        columns={columns}
        dataSource={ products }
        bordered
        pagination={{
          showSizeChanger : true,
          showQuickJumper : true,
          defaultPageSize : 3,
          pageSizeOptions : ['3','6','9','12'],
          onChange        : this.fetchPage,
          onShowSizeChange: this.fetchPage,
          total
        }}
        rowKey  ="_id"
        loading ={loading}

      />
    </Card>;
  }
}