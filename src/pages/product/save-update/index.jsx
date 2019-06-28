import React, { Component } from 'react';
import { Card,Form,Button,Input,Cascader,InputNumber,Icon, message } from 'antd'
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js'

import { reqCategories,reqAddProduct,reqUpdateProduct } from '../../../api'
import RichTextEditor from './rich-text-editor'
import PictureUpload  from './picture-upload'
import './index.less'

const { Item } = Form;

class SaveUpdate extends Component {

  state = {
    options: []
  };
  richTextEditorRef = React.createRef();
  fetchCategories = async ( parentId ) => {
    //根据ID请求商品品类
    const result = await reqCategories(parentId);
    if (result) {
      //console.log(result)//返回result是一个数组，里面包含了多个一级品类对象,result._id代表每个一级品类
      if (parentId === '0') {
        this.setState({
          options: result.map(item => {
            return {
              value: item._id,
              label: item.name,
              isLeaf: false,
            }
          })
        })
      }else {
        this.setState({
          options: this.state.options.map(item => {
            //item是一级品类的每个对象，item.value是options里一级品类自身的_id
            //parentId是你点击的二级分类的所属的一级分类id
            if (item.value === parentId) {
              // console.log(item,item.value)
              item.children = result.map((item) => {
                return {
                  value: item._id,
                  label: item.name
                }
              })
            }
            return item
          })
        })
      }
    }
  }
  async componentDidMount(){
   this.fetchCategories('0')//一级品类


    const product = this.props.location.state;
    let categoriesId = [];
    if (product) {
      if (product.pCategoryId !== '0') {
        categoriesId.push(product.pCategoryId);
        // 请求二级分类数据
        this.fetchCategories(product.pCategoryId);
      }
      categoriesId.push(product.categoryId);
    }
    //挂载到组件上
    this.categoriesId = categoriesId;
  }
  /**
   * 提交表单
   * @param e
   */
  addProduct = (e) => {
    //阻止默认行为
    e.preventDefault();
    //表单验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {editorState} = this.richTextEditorRef.current.state;
        //得到富文本输入框的值detail
        const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const { name, desc, price, categoriesId } = values;

        let pCategoryId = '0';
        let categoryId  = '';
        let promise     = null;
        if (categoriesId.length === 1) {
          categoryId = categoriesId[0];
        } else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }
        const product = this.props.location.state;//拿到的目标对象
        const opations = {name, desc, price, categoryId, pCategoryId, detail};
        if (product) {
          //说明是修改商品数据请求更新
          opations._id = product._id;
          //发送请求更新
          promise = reqUpdateProduct(opations)
        }else {
          //说明是添加商品数据，发送请求添加
          promise = reqAddProduct(opations);
        }

        const result = await promise;
        if (result) {
          message.success('商品添加成功~');
          this.props.history.push('/product/index')
        }

      }
    })
  }

  /**
   * 商品分类的级联选择
   */
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //转圈圈
    targetOption.loading = true;
    //console.log(targetOption);//下拉选中的对象
    //targetOption.value是一级品类的_id，根据id再发请求查找并判断是否有子品类
    const result = await reqCategories(targetOption.value);
    if (result) {
      //console.log(result)//请求回来的是一个数组，包含了多个子品类对象
      //请求回来数据了就不转圈圈了
      targetOption.loading = false;
      targetOption.children = result.map(item => {
        return {
          label: item.name,
          value: item._id,
        }
      });
      //更新状态
      this.setState({
        options: [...this.state.options]
      })
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
    const { options }            = this.state;
    const { getFieldDecorator  } = this.props.form;
    const  product               = this.props.location.state;
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
          {
            getFieldDecorator(
              'name',
              {
                rules:[{required: true, message: '请输入商品名称'}],
                initialValue: product ? product.name : ''
              }
            )(
              <Input placeholder="请输入商品名称" allowClear={true}/>
            )
          }

        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc',
              {
                rules: [{required: true, message: '请输入商品描述'}],
                initialValue: product ? product.desc : ''
              }
            )(
              <Input placeholder="请输入商品描述" allowClear={true}/>
            )
          }
        </Item>
        <Item label="选择分类" wrapperCol={{span: 5}}>
          {
            getFieldDecorator('categoriesId',{
              rules: [{required: true, message: '请选择商品分类'}],
              initialValue: this.categoriesId
            })(
              <Cascader
                options={options}
                loadData={this.loadData}
                changeOnSelect
                allowClear={false}
                placeholder="请选择"
              />
            )
          }
        </Item>
        <Item label="商品价格" >
          {
            getFieldDecorator(
              'price',
              {
                rules: [{required: true, message: '请输入价格'}],
                initialValue: product ? product.price : ''
              }
            )(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                className="input-price"
              />
            )
          }
        </Item>
        <Item label="商品图片">
          <PictureUpload imgs={product ? product.imgs : []} id={product ? product._id : ''}/>
        </Item>
        <Item　label="商品详情" wrapperCol={{span: 20}}>
          <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''}/>
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" className="submit-btn">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}
export default Form.create()(SaveUpdate);