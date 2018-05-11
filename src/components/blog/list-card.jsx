import React from 'react'
import { Link } from 'react-router-dom'
import { formattedTime } from '../../util'

const PlainText = (props) => {
  const { data } = props
  return (
    <div className="content-item item-plain-text hide" style={{ backgroundImage: 'url( ' + data.cover + ')' }}>
      <div className="content">
        <h3 className="title"><Link to={'/blog/article/' + data._id}>{data.title}</Link></h3>
        <p className="summary">{data.summary}</p>
      </div>
    </div>
  )
}
const TextTitle = (props) => {
  const { data } = props
  return (
    <div className="content-item item-plain-text-with-title hide">
      <div className="content">
        <h3 className="title"><Link to={'/blog/article/' + data._id}>{data.title}</Link></h3>
        <p className="summary"><span>{data.summary}</span></p>
      </div>
    </div>
  )
}
const TextImage = (props) => {
  const { data } = props
  return (
    <div className="content-item item-image-text hide" style={{ backgroundImage: `url(${data.cover})` }}>
      <div className="content">
        <div className="post-header">
          <div className="post-cover" style={{ backgroundImage: `url(${data.cover})` }}></div>
          <div className="post-title">
            <h3 className="title"><Link to={'/blog/article/' + data._id}>{data.title}</Link></h3>
            <p className="post-date">发布日期:{formattedTime(data.meta.createdAt)}</p>
            <p className="read-count">总阅读量:{data.readCount}</p>
          </div>
        </div>
        <p className="summary">{data.summary}</p>
        <div className="post-footer">
          <Link to={"/blog/article/" + data._id} className="read-more">READ MORE</Link>
          <a href="#/" className="comments-count">{data.comments.length} Comments</a>
        </div>
      </div>
    </div>
  )
}
const Album = (props) => {
  const { data } = props

  const rawImgArr = data.HTML.match(/\<img[^>]+>/g)
  const imgArr = rawImgArr && rawImgArr.map(item => {
    const rawColletion = item.match(/"[^'"]+"/g)
    return {
      url: rawColletion[0].replace(/^['"]+|['"]+$/g, ''),
      title: rawColletion[1].replace(/^['"]+|['"]+$/g, ''),
    }
  })
  const imageCount = imgArr ? imgArr.length : 0
  return (
    <div className="content-item item-image-album-text hide" style={{ backgroundImage: `url(${data.cover})` }}>
      <div className="content clear-fixed">
        <div className="post-header">
          <h3 className="title"><Link to={'/blog/article/' + data._id}>{data.title}</Link></h3>
          <p className="post-date">发布日期:{formattedTime(data.meta.createdAt)}</p>
          <p className="summary">{data.summary}</p>
        </div>
        <div className="post-imageList">
          {imgArr && imgArr.map(item => {
            return <div key={item.url} title={item.title} style={{ backgroundImage: `url(${item.url})` }}></div>
          })}
          <Link className="image-count" to={'/blog/article/' + data._id}>{imageCount}&nbsp;PICS</Link>
        </div>
      </div>
    </div>
  )
}
export default class Card extends React.Component {

  render() {
    const { type, data } = this.props
    let dom = ''
    switch (type) {
      case "plain-text":
        dom = <PlainText data={this.props.data}></PlainText>
        break
      case "text-title":
        dom = <TextTitle data={this.props.data}></TextTitle>
        break
      case "text-image":
        dom = <TextImage data={this.props.data}></TextImage>
        break
      default:
        dom = <Album data={this.props.data}></Album>
    }
    return dom
  }
}