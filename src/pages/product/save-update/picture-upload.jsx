import React, { Component } from 'react';
import { Upload, Icon, Modal,message } from 'antd';

import { reqDeleteProductImg } from '../../../api'
export default class PictureUpload extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.imgs.map((img, index) => {
      return {
        uid: -index,
        name: img,
        status: 'done',
        url: `http://localhost:5000/upload/${img}`,
      }
    })
  };
  //取消预览图片
  handleCancel = () => this.setState({ previewVisible: false });
  //点击眼睛预览图片
  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  //编辑图片时的各种状态，根据状态操作
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'uploading') {
      // 上传中
    } else if (file.status === 'done') {
      // 上传成功~
      message.success('上传图片成功~', 1);
    } else if (file.status === 'error') {
      // 上传失败
      message.error('上传图片失败！', 1);
    } else{
      //从saveupdate传过来的你选中的那个产品的id（有就是id，没有就是‘ ’）
      const id     = this.props.id;
      const name   = file.name;
      const result = await reqDeleteProductImg(name, id);
      if (result) {
        message.success('删除图片成功~', 1);
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          //上传到服务器的对应地址
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          //处理各种变化，如删除，上传
          onChange={this.handleChange}
          // 请求参数
          data={{
            id: this.props.id
          }}
          name="image"
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}