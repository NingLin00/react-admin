
const USER_TIME   = 'USER_TIME';
const USER_KEY    = 'USER_KEY';
const EXPIRIES_IN = 1000 * 3600 * 24; //过期时间为七天

export const setItem = function (data) {
  localStorage.setItem(USER_TIME, Date.now());
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}
export const getItem = function () {
  const startTime = localStorage.getItem(USER_TIME);
  if (Date.now() - startTime < EXPIRIES_IN ) {
    return JSON.parse(localStorage.getItem(USER_KEY))
  }else {
    //过期，删除用户信息和时间
    removeItem();
    return {}
  }
}
export const removeItem = function () {
  localStorage.removeItem(USER_TIME);
  localStorage.removeItem(USER_KEY)
}
