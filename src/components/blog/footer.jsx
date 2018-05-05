import React, { Component } from 'react'

import 'stylus/blog/footer'
export default class Nav extends Component {


  render() {
    return (
      <div className="footer">
        <p>Copyright (C) <a href="http://topdiantop.top/">TopDianTop.top</a>, All Rights Reserved.</p>
        <p>leohsun@qq.com 版权所有&emsp;<a href="http://www.miitbeian.gov.cn/">蜀ICP备18011588号-1</a>
        &emsp;<a target="_blank" href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51138102000074">川公网安备 51138102000074号</a>
        </p>
      </div >
    )
  }
}