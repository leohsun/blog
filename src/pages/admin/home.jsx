import React from 'react'
import Publish from './publish'
import adminStore from '../../stores/admin'
import EditArticle from './edit-article'
import {inject,observer} from 'mobx-react'
import { Link, Route } from 'react-router-dom'
import { Layout, Menu, Icon, Spin } from 'antd'
const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout



const Analysis = () => <h1>analysis</h1>


const RouterView = () => {
  return (
    <div>
      <Route path="/admin/home/publish" component={Publish}></Route>
      <Route path="/admin/home/edit-article" component={EditArticle}></Route>
    </div>
  )
}

@inject('adminStore')
@observer
export default class Home extends React.Component {
  state = {
    collapsed: false
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentDidMount() {
    console.log(this.props.adminStore.loading);
  }
  componentWillReceiveProps(){
    console.log(arguments)
  }
  render() {
    return (
        <Spin spinning={this.props.adminStore.loading} wrapperClassName="layout-wrapper">
          <Layout style={{ height: "100%" }} className="layout">
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <SubMenu
                  key="sub1"
                  title={<span><Icon type="code" /><span>内容管理</span></span>}
                >
                  <Menu.Item key="3">
                    <Link to="/admin/home/publish">发表文章</Link>
                  </Menu.Item>
                  <Menu.Item key="4"><Link to="/admin/home/edit-article">管理文章</Link></Menu.Item>
                </SubMenu>

              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', paddingLeft: 0, fontSize: '30px' }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 'ß' }}>
                <RouterView></RouterView>
              </Content>
            </Layout>
          </Layout>
        </Spin>
    )
  }
}