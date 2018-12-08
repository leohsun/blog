import React from 'react'
import PageWrapper from 'components/blog/page-wrapper'
import { observer, inject } from 'mobx-react'
import { http } from '../../util'
import Card from 'components/blog/list-card'
import 'stylus/blog/home'
@inject('commonStore')
@observer
export default class Home extends React.Component {
  state = {
    hasMore: false,
    limit: this.props.commonStore.scrollTop,
    isLoading: false,
    data: [],
  }
  elsLimits = []
  currentPage = 1
  size = 2


  getLimit(el) { //得到当前元素的极限值
    let halfHeight = el.offsetHeight / 2
    const elTop = this.getTop(el)
    return elTop + halfHeight
  }
  getTop(dom) {  //获取元素距body的top值
    let el = dom
    let top = 0
    while (el) {
      top += el.offsetTop
      el = el.offsetParent
    }
    return top
  }
  getElsLimits() { //设置动画 -> class 动画用Css3做
    const rowEls = this.refs['content-list'].children
    for (let i = 0; i < rowEls.length; i++) {
      let limit = this.getLimit(rowEls[i]) - document.documentElement.clientHeight
      this.elsLimits.push(limit)
    }
  }
  setAnimation(num) {
    for (let i = 0; i < this.elsLimits.length; i++) {
      if (this.elsLimits[i] < num) {
        this.refs['content-list'].children[i] && this.refs['content-list'].children[i].classList.remove('hide')
      } else {
        this.refs['content-list'].children[i] && this.refs['content-list'].children[i].classList.add('hide')
      }
    }
  }
  setloading = (bool) => {
    this.setState({ isLoading: bool })
  }
  loadMore = () => {
    http().get(`article/list?page=${++this.currentPage}&size=${this.size}`)
      .then(data => {
        if (data.code === 200) {
          const raw = data.data
          this.setState({
            data: this.state.data.concat(raw.data),
            hasMore: raw.hasMore,
            currentPage: raw.page
          })
        }
      })
  }
  fetchList() {
    http().get(`article/list?page=${this.currentPage}&size=${this.size}`)
      .then(data => {
        if (data.code === 200) {
          const raw = data.data
          this.setState({
            data: raw.data,
            hasMore: raw.hasMore,
            currentPage: raw.page
          })
        }
      })
  }
  componentDidMount() {
    this.fetchList()
  }
  componentDidUpdate() {
    
    this.getElsLimits()
  }


  render() {
    console.log(this.props.commonStore.scrollTop)
    this.setAnimation(this.props.commonStore.scrollTop)
    return (
      <PageWrapper>
        <div className="content-list" ref={"content-list"}>
          {this.state.data && this.state.data.map(item => <Card type={item.listCardType} data={item} key={item._id} />)}
        </div>
        {
          this.state.hasMore && <div className="loading-more" onClick={this.loadMore}>
            加载更多...
    {/* <div className={this.state.isLoading ? 'loading-animation isLoading' : 'loading-animation'}>
              <div className="line line1"></div>
              <div className="line line2"></div>
            </div> */}
          </div>
        }

      </PageWrapper>
    )
  }
}