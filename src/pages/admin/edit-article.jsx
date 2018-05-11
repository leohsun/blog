import React from 'react'
import { http } from '../../util'
import 'stylus/admin/publish'
import Editor from 'components/admin/editor'
import { Table, Icon, Divider, Modal, message, Popconfirm } from 'antd';
const { Column } = Table


export default class Article extends React.Component {
  componentDidMount() {
    this.fetchData(1)
  }
  fetchData(page, size) {
    http('adminLoading').get(`article/list?page=${page || 1}&size=${size || this.state.size}`)
      .then(data => {
        if (data.data.code === 200) {
          message.success(data.data.msg)
        }
        if (data.code !== 200) return
        const raw = data.data
        raw.data.map(item => item.key = item._id)
        this.setState({
          list: raw.data,
          page: raw.page,
          total: raw.total
        })

      })
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    page: 0,
    total: 0,
    size: 5,
    visilbe: false,
    modelTitle: '',
    HTML: '',
    idNow: 0,
    rawData: {}
  }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  pageChange = (page, size) => {
    this.fetchData(page)
  }
  handleDel(id) {
    if (!id) return
    http('adminLoading').get(`article/del/${id}`)
      .then((res) => {
        if (res.code === 200) {
          message.success(res.data.msg)
          this.fetchData(this.state.page)
        }
      })
  }
  handleView(id) {
    if (id !== this.state.idNow) {
      http('adminLoading').get(`/article/detail/${id}`)
        .then(res => {
          if (res.code === 200) {
            message.success(res.msg)
            this.setState({
              rawData: res.data.data,
              visible: true,
              modelTitle: '预览文章',
              idNow: res.data.data._id
            })
          }
        })
    } else {
      this.setState({
        visible: true,
        modelTitle: '预览文章'
      })
    }
  }
  handleEdit(id) {
    if (id !== this.state.idNow) {
      http('adminLoading').get(`/article/detail/${id}`)
        .then(res => {
          if (res.code === 200) {
            message.success(res.data.msg)
            this.setState({
              rawData: res.data.data,
              visible: true,
              modelTitle: '编辑文章',
              idNow: res.data.data._id
            })
          }
        })

    } else {
      this.setState({
        visible: true,
        modelTitle: '编辑文章'
      })
    }
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleUpdate = (data) => {
    http('adminLoading').post(`article/update/${this.state.idNow}`, data).then(res => {
      if (res.code === 200) {
        message.success(res.msg)
      }
    }).catch(err => {
      // this.props.adminStore.setLoading(false)
      console.log(err)
    })
  }
  render() {
    const viewHTML = <div dangerouslySetInnerHTML={{ __html: this.state.rawData.HTML }} />
    return (
      <div>
        <Table
          dataSource={this.state.list}
          pagination={{
            current: this.state.page,
            total: this.state.total,
            pageSize: this.state.size,
            onChange: this.pageChange
          }}
        >
          <Column
            title="标题"
            dataIndex="title"
            key='_id'
          />
          <Column
            title="简介"
            dataIndex="summary"
            key='summary'
            width={300}
            className="summary-col"
          />
          <Column
            title="发布者"
            dataIndex="poster"
            key='poster'
          />
          <Column
            title="编辑者"
            dataIndex="editor"
            key='editor'
          />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Icon type="eye" onClick={_ => this.handleView(text._id)} className="cur-pointer" />
                <Divider type="vertical" />
                <Icon type="edit" onClick={_ => this.handleEdit(text._id)} className="cur-pointer" />
                <Divider type="vertical" className="cur-pointer" />
                <Popconfirm placement="topRight" title="确认删除？" onConfirm={_ => this.handleDel(text._id)} okText="Yes" cancelText="No">
                  <Icon className="cur-pointer" type="delete" />
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <Modal
          style={{ top: '10px' }}
          title={this.state.modelTitle}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          width={1200}
        >
          {this.state.modelTitle === '预览文章' && viewHTML}
          {this.state.modelTitle === '编辑文章' && <Editor onExport={this.handleUpdate} data={this.state.rawData} btnContext='更新文章' />}
        </Modal>
      </div>
    );
  }
}