import axios from 'axios';
import {message} from 'antd'



export default function ajax(url, data = {}, method = 'get') {
  let reqParams =  data;
  //大小写方法不一样，所以转化小写
  method = method.toLowerCase();
  //判断。get方法与post传数据方式不同
  if (method === 'get') {
    reqParams = {
      params:data
    }
  }
  return axios[method](url, reqParams)
    .then((res) => {
      const { data } = res;
      if (data.status === 0) {
        return data.data || {}
      }else {
        message.error(data.msg, 2)
      }
    })
    .catch((err) => {
      message.error('网络异常，请刷新', 2)
    })
}