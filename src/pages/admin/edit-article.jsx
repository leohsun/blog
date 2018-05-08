import React from 'react'
import { http } from '../../util'
import 'stylus/admin/publish'
import { Table, Icon, Divider } from 'antd';
const { Column, ColumnGroup } = Table


export default class Article extends React.Component {
  componentDidMount() {
    this.fetchData(1)
  }
  fetchData(page, size) {
    http('adminLoading').get(`article/list?page=${page || 1}&size=${size || this.state.size}`)
      .then(data => {
        data.data.map(item => item.key = item._id)
        this.setState({
          list: data.data,
          page: data.page,
          total: data.total
        })

      })
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    page: 0,
    total: 0,
    size: 5
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
  handleDel(id){
    if(!id) return
    http('adminLoading').get(`article/del/${id}`)
    .then((res)=>{
      if(res.code === 200){

        this.fetchData(this.state.page)
      }
    })
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
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
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <span>
              <Icon type="eye" />
              <Divider type="vertical" />
              <Icon type="edit" />
              <Divider type="vertical" />
              <Icon onClick={_=>this.handleDel(text._id)} type="delete" />

            </span>
          )}
        />
      </Table>
    );
  }
}