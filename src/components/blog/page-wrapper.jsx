import React from 'react'
import 'stylus/blog/page-wrapper'

import { observer, inject } from 'mobx-react'
@inject('commonStore')
@observer
export default class PageWrapper extends React.Component {
  elsLimits = []
  scrollFn(_this,e) {
    //context 为 null
    let { scrollTop } = e.target.scrollingElement
    //save scrollTop 2 commonStore
    _this.props.commonStore.setScrollTop(scrollTop)
    let maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
 
    // 1.上下箭头动画
    if (scrollTop > 40) {
      _this.topArrow.classList.add('animation')
    } else {
      _this.topArrow.classList.remove('animation')
    }
    if (scrollTop < maxHeight) {
      _this.bottomArrow.classList.add('animation')
    } else {
      _this.bottomArrow.classList.remove('animation')
    }
  
}
proxFN = this.scrollFn.bind(null,this)  //中转 方便移出事件
componentDidMount() {
  this.topArrow = this.refs['top-arrow']
  this.bottomArrow = this.refs['bottom-arrow']
  // this.getElsLimits()
  document.addEventListener('scroll', this.proxFN,{passive: false})
}
componentWillUnmount(){
  document.removeEventListener('scroll', this.proxFN)
}
shouldComponentUpdate (nextProps, nextState) {
  return nextProps.children!==this.props.children.length;
}

render() {
  return (<div ref='page-wrapper' className="page-wrapper">
    <span ref='top-arrow' className="top-arrow">
      <span className="left-white"></span>
      <span className="center-transprent"></span>
      <span className="right-white"></span>
    </span>

    {React.Children.map(this.props.children, child => {
      return child
    })}
    <span ref='bottom-arrow' className="bottom-arrow">
      <span className="left-white"></span>
      <span className="center-transprent"></span>
      <span className="right-white"></span>
    </span>
  </div>)
}
}