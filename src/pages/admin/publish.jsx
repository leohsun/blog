import React from 'react'
import { http } from '../../util'
import 'stylus/admin/publish'
import Editor from 'components/admin/editor'
import { inject, observer } from 'mobx-react'
import { message } from 'antd'
@inject('adminStore')
@observer
export default class Article extends React.Component {

  publish2server = (e) => {
    // this.props.adminStore.setLoading(true)
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.md2html()
        await this.awaitFn()
        const { HTML, MD, listCardType, bgImage } = this.state
        const bg = bgImage || 'https://static.topdiantop.top/blog/images/default_bg.jpg'
        http(this.loading).post('admin/publish', {
          title: values.title,
          HTML,
          MD,
          listCardType,
          bgImage: bg,
          categories: values.categories,
          summary: MD.slice(0, 30)
        }).then(res => {
          // this.props.adminStore.setLoading(false)
          if (res.data.code === 200) {
            message.success(res.data.msg)
            this.props.form.resetFields()
            this.setState({
              HTML: '',
              MD: ''
            })
          }
        }).catch(err => {
          // this.props.adminStore.setLoading(false)
          console.log(err)
        })
      }
    });


  }
  handlePublish = (data) => {
    http('adminLoading').post('admin/publish', data).then(res => {
      if (res.code === 200) {
        message.success(res.data.msg)
      }
    }).catch(err => {
      // this.props.adminStore.setLoading(false)
      console.log(err)
    })
  }
  render() {

    return (
      <div className="publish">
        <Editor
          onExport={this.handlePublish}
          btnContext='发布文章'
        />
      </div >
    )
  }
}