import React from 'react'
import PageWrapper from 'components/blog/page-wrapper'
import 'stylus/blog/article'
import { Link } from 'react-router-dom'
import { http, formattedTime } from '../../util'
import { inject} from 'mobx-react'
@inject('commonStore')
export default class Article extends React.Component {
  state = {
    showPre: false,
    showNext: false,
    detail: [],
    preNav: null,
    nexNav: null,
  }
  componentDidMount() {
    this.fetchDetail(this.props.match.params.id)
    console.log(this.props.commonStore.tagMap)
  }
  fetchDetail(id) {
    http().get(`article/detail/${id}`)
      .then(data => {
        this.setState({
          detail: data.data,
          preNav: data.preData && {
            title: data.preData.title,
            id: data.preData._id,
            bgImage: data.preData.bgImage
          },
          nextNav: data.nextData && {
            title: data.nextData.title,
            id: data.nextData._id,
            bgImage: data.nextData.bgImage
          }
        })
      })
  }
  componentWillReceiveProps(nVal) {
    this.setState({
      showPre: false,
      showNext: false,
      preNav: null,
      nexNav: null
    })
    this.fetchDetail(nVal.match.params.id)
  }
  render() {
    return (
      <PageWrapper>
        <div className="article-switch">
          {this.state.preNav && (
            <div className={this.state.showPre ? 'previous switch show' : 'previous switch'} onMouseLeave={() => this.setState({ showPre: false })}>
              <div className="btn blog-iconfont" onMouseEnter={() => this.setState({ showPre: true })}>&#xe693;</div>
              <div className="widget">
                <div className="cover" style={{ backgroundImage: `url(${this.state.preNav.bgImage})` }}></div>
                <h3 className="title"><Link to={`/blog/article/${this.state.preNav.id}`}>{this.state.preNav.title}</Link></h3>
              </div>
            </div>
          )}
          {this.state.nextNav && (
            <div className={this.state.showNext ? 'next switch show' : 'next switch'} onMouseLeave={() => this.setState({ showNext: false })}>
              <div className="widget">
                <h3 className="title"><Link to={`/blog/article/${this.state.nextNav.id}`}>{this.state.nextNav.title}</Link></h3>
                <div className="cover" style={{ backgroundImage: `url(${this.state.nextNav.bgImage})` }}></div>
              </div>
              <div className="btn blog-iconfont" onMouseEnter={() => this.setState({ showNext: true })}>&#xe694;</div>
            </div>
          )}
        </div>

        <div className="content-wrapper" >
          <h2 className="main-title">{this.state.detail.title}</h2>
          <div className="html-Container" dangerouslySetInnerHTML={{ __html: this.state.detail.HTML }}></div>
          <div className="article-footer">
            <div className="tag">
              <span className="time">{this.state.detail.meta && formattedTime(this.state.detail.meta.createdAt)}&emsp;</span>
              {this.state.detail.categories && this.state.detail.categories.map(item =><Link className="cats" key={item} to={`/blog/category/${item}`}>{this.props.commonStore.tagMap[item]}</Link>)}
            </div>
            <div className="handleBtn"></div>
          </div>
        </div>
      </PageWrapper>
    )
  }
}



