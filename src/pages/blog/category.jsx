import React from 'react'
import PageWrapper from 'components/blog/page-wrapper'
import 'stylus/blog/category'
import { Link } from 'react-router-dom'
import { http, formattedTime } from '../../util'
import { Pagination } from 'antd'
import { inject } from 'mobx-react'
import 'stylus/blog/category.styl'
@inject('commonStore')
export default class Category extends React.Component {
  state = {
    data: [],
    page: 1,
    size: 2,
    total: 0
  }
  componentDidMount() {
    this.fecthData(1)
  }
  componentWillReceiveProps(val){
    if(val.match.params.id === 'all'){
      this.fecthData(1)
    }
  }
  fecthData(page) {
    const cate = this.props.match.params.id
    const url = cate === 'all' ? `/article/list?page=${page}&size=${this.state.size}`
      : `/getListByCategory/${cate}?page=${page}&size=${this.state.size}`
    http().get(url)
      .then(data => {
        if (data.code === 200) {
          const raw = data.data
          this.setState({
            data: raw.data,
            page: raw.page,
            total: raw.total
          })
        }

      })
  }
  pageChange = (page, size) => {
    this.fecthData(page)
  }
  ListItem = (props) => {
    const { title, categories, meta, _id } = props.data
    const cates = props.map
    const time = formattedTime(meta.createdAt, { symbol: '/', dateOnly: true })
    return (
      <li key={_id} className="list-item">
        <h2 className="title">
          <a href={"/blog/article/" + _id}>{title}</a>
          <span className="line"></span>
          <span className="post-date">{time}</span>
        </h2>

        <div className="cates">
          {categories.map((item, idx) => (<a href={'/blog/category/' + item} key={item}>[&nbsp;{cates[item]}&nbsp;]{idx + 1 !== categories.length && ','}</a>))}
        </div>
      </li>
    )
  }
  render() {
    return (
      <PageWrapper>
        <div className="content-list">
          <h2>当前位置：<Link to="/">首页</Link>&gt;&gt;<Link to="/blog/category/all">分类</Link>&gt;&gt;{this.props.match.params.id}</h2>
          <ul className="list-wrap">
            {this.state.data && this.state.data.map(item => this.ListItem({ data: item, map: this.props.commonStore.tagMap }))}
          </ul>
          <div className="page-navigator">
            <Pagination size="small"
              current={this.state.page}
              total={this.state.total}
              pageSize={this.state.size}
              onChange={this.pageChange}
            />
          </div>

        </div>
      </PageWrapper>
    )
  }
} 