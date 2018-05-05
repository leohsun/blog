import React from 'react'
import { http } from '../../util'
import 'stylus/admin/publish'
import { Table, Icon, Divider } from 'antd';

const { Column, ColumnGroup } = Table


export default class Article extends React.Component {
  componentDidMount() {
    http.get('/article/all')
      .then(data => {
        data.map(item => item.key = item._id)
        console.log(data)
        this.setState({ list: data })
      })
  }
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: []
  };
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Table dataSource={this.state.list}>
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
              <a href="javascript:;" title="查看"><Icon type="eye" /></a>
              <Divider type="vertical" />
              <a href="javascript:;" title="编辑"><Icon type="edit" /></a>
              <Divider type="vertical" />
              <a href="javascript:;" title="删除">
                <Icon type="delete" />
              </a>
            </span>
          )}
        />
      </Table>
    );
  }
}