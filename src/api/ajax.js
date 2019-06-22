import axios from 'axios';
import {message} from 'antd'



export default function ajax(url, data = {}, method = 'get') {
  let reqParams = data;
  //转化小写进行比较
  method = method.toLowerCase();
  if (method === 'post') {
    reqParams = {
      params: data
    }
  }
  return axios[method](url, reqParams)
    .then((res) => {
      const {data} = res;
      if (res.status === 0) {
        return data.data
      }else {
        message.error(data.msg, 2)
      }
    })
    .catch((err) => {
      message.error('网络出现异常，请刷新重试~', 2)
    })
}