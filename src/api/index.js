
import jsonp from 'jsonp';
import { message } from 'antd'

import ajax from './ajax';

//请求登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'post');
//请求验证用户信息
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');
//请求天气功能
export const reqWeather = function () {
  return new Promise((resolve, reject) => {
    //使用jsonp解决跨域问题
    jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, ( err, data ) => {
      //err：有错返回错误对象，没错返回null
      if (!err) {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({
          weatherImg: dayPictureUrl,
          weather
        })
      }else {
        message.error('请求天气信息失败,请刷新试试~',1);
        reject()
      }
    })
  })
}