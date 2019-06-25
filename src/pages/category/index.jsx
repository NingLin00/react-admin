import React, { Component } from 'react';
import { Card, Icon, Button, Table, Modal,message } from 'antd';

import { reqCategories, reqAddCategory, reqUpdateCategoryName } from '../../api'
import ConmonButton                      from '../../components/conmon-button';
import AddCategoryForm                   from './add-category-form'
import ReviseCategoryNameForm            from './revise-categoryname-form'

import './index.less';



export default class Category extends Component {
  state = {
    categoryData        : [],   //初始化数据
    isShowAddCategory   : false,//显示添加分类的状态
    isReviseCategoryName: false //显示修改名称的状态
  };
  category = {};
  async componentDidMount(){
    const result = await reqCategories('0');
    if (result) {
      this.setState({
        categoryData: result
      })
    }
  }

  /**
   * 切换显示/隐藏添加分类窗口
   */
  toggleDisplay = ( stateName, boolen ) => {
    return () => {
      this.setState({
        [stateName]: boolen,
      })
    };
  };
  /**
   *添加商品分类
   * @returns {*}
   */
  AddCategory = () => {
    //wrappedComponentRef方法拿到AddCategoryForm的form并将其挂载到category组件的AddCategoryForm上
    const { form } = this.AddCategoryForm.props;
    form.validateFields( async (err, value) => {
      if (!err) {
        //校验通过则拿到数据value
        const { parentId, categoryName } = value;
        //发送请求
        const result = await reqAddCategory( parentId, categoryName );
        if (result) {
          message.success('添加成功~');
          //清空输入框
          form.resetFields(['parentId','categoryName']);
          //统一更新的对象
          const options = {
            isShowAddCategory:false
          };
          //判断是否为一级菜单
          if (result.parentId === '0') {
            options.categoryData = [...this.state.categoryData,result]
          }
          //统一更新
          this.setState(options);
        }
      }
    });
  };

  /**
   * 修改名称
   * category是从操作表头的render方法中传给标签得到的
   * @returns {*}
   */
  reviseCategoryName = (category) => {
    return () => {
      this.category = category;
      //console.log(this.category)//当前点击的商品品类对象
      this.setState({
        isReviseCategoryName:true
      })
    }
  }
  /**
   * 保存名称
   */
  saveCategoryName = () => {
    const { form } = this.updateCategoryForm.props;
    form.validateFields(async ( err,value ) => {
      if (!err) {
        //获取的表单得输入值
        //console.log(value)//拿到的是一个对象，要解构
        const { categoryName } = value;
        //console.log(categoryName)//表单的输入值
        const categoryId   = this.category._id;
        //console.log(this.category)//当前点击的品类对象
        const result = await reqUpdateCategoryName( categoryId,categoryName );
        if (result) {
          const categoryData = this.state.categoryData.map(category => {
            //解构每一个category
            let { _id, name,parentId } = category;
            //根据_id找到要修改的项
            if ( _id === categoryId ) {
              //修改名称
              name = categoryName;
              //返出修改好的对象
              return {
                _id,
                name,
                parentId
              }
            }
            //不需要修改的对象直接返回
            return category
          });
          //清空输入框
          form.resetFields(['categoryName']);
          message.success('更新分类名称成功~', 1);
          //更新状态
          this.setState({
            isReviseCategoryName: false,//隐藏修改名称的模态框
            categoryData //更新品类类别
          })
        }
      }
    })
  }
  /**
   * 隐藏修改名称模态框
   */
  hideReviseCategory = () => {
    this.setState({
      isReviseCategoryName: false
    })
  }
  render() {
    const { categoryData,isShowAddCategory, isReviseCategoryName } = this.state;
    //表头内容
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',//对应数据的name字段
      },
      {
        title: '操作',
        className: 'category-operation',//自定义样式
        //dataIndex: 'operation',
        render: category => {
          //console.log(category)//当前页所有品类对象
          return <div>
            <ConmonButton onClick={this.reviseCategoryName(category)}>修改名称</ConmonButton>
            <ConmonButton>查看其子品类</ConmonButton>
          </div>
        },
      }
    ];
    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.toggleDisplay('isShowAddCategory', true)}><Icon type="plus"/>添加品类</Button>} >
      <Table
        columns={columns}
        dataSource={categoryData}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['4', '10', '15', '20'],
          defaultPageSize: 4,
          showQuickJumper: true,
        }}
        rowKey= '_id'
      />
      <Modal
        title="添加商品分类"
        visible={isShowAddCategory}
        onOk={this.AddCategory}
        onCancel={this.toggleDisplay('isShowAddCategory',false)}
        okText="确认"
        cancelText="取消"
      >
        <AddCategoryForm categoryData={categoryData} wrappedComponentRef={(form) => this.AddCategoryForm = form}/>
      </Modal>
      <Modal
        title="修改名称"
        visible={isReviseCategoryName}
        onOk={this.saveCategoryName}
        onCancel={this.hideReviseCategory}
        okText="确认"
        cancelText="取消"
        width={400}
      >
        <ReviseCategoryNameForm categoryName={this.category.name} wrappedComponentRef={(form) => this.updateCategoryForm = form}/>
      </Modal>
    </Card>;
  }
}