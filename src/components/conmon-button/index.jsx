import React from 'react';

import './index.less'
export default function ConmonButton (props) {
  // 组件内包含的内容会挂载到组件的 props.children中
  //三目运算符用于收集传入的各项属性
  return <button className="my-button" {...props}/>
}