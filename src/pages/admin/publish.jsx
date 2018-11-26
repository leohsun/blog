import React from 'react'
import { http } from '../../util'
import 'stylus/admin/publish'
import Editor from 'components/admin/editor'
import { inject, observer } from 'mobx-react'
import { message } from 'antd'
@inject('adminStore')
@observer
export default class Article extends React.Component {

 
  handlePublish = (data) => {
    http('adminLoading').post('admin/publish', data).then(res => {
      if (res.code === 200) {
        message.success(res.msg)
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