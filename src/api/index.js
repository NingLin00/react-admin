
import jsonp from 'jsonp';
import { message } from 'antd'

import ajax from './ajax';

//请求登录
export const reqLogin = ( username, password ) => ajax('/login', { username, password }, 'post');
//请求验证用户信息
export const reqValidateUserInfo = ( id ) => ajax('/validate/user', { id }, 'post');
//请求天气功能
export const reqWeather = function () {
  let cancel = null;
  const promise =  new Promise((resolve, reject) => {
    //使用jsonp解决跨域问题
    cancel = jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, ( err, data ) => {
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
    cancel()
  })
  return {
    promise,
    cancel
  }
};
//请求查询商品品类列表，parentId=‘0’则查询一级品类，parentId=_id则查询此品类的子品类
export const reqCategories = ( parentId ) => ajax('/manage/category/list', { parentId });
//请求添加商品品类
export const reqAddCategory = ( parentId, categoryName ) => ajax('/manage/category/add', { parentId, categoryName }, 'post');
//请求更新品类名称
export const reqUpdateCategoryName = ( categoryId, categoryName ) => ajax('/manage/category/update', { categoryId,categoryName }, 'post');
//请求商品分页列表
export const reqCategoryPageList = ( pageNum, pageSize ) => ajax('/manage/product/list', { pageNum, pageSize });
//请求添加商品
export const reqAddProduct = ({name, desc, price, categoryId, pCategoryId, detail}) => ajax('/manage/product/add', {name, desc, price, categoryId, pCategoryId, detail}, 'POST');
//请求更新商品数据（修改）
export const reqUpdateProduct = ({name, desc, price, categoryId, pCategoryId, detail, _id}) => ajax('/manage/product/update', {name, desc, price, categoryId, pCategoryId, detail, _id}, 'POST');
//请求删除商品图片
export const reqDeleteProductImg = (name, id) => ajax('/manage/img/delete', {name, id}, 'POST');