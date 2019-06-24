import ajax from './ajax';

//请求登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'post');
//请求验证用户信息
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');