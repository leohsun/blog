import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../../util'
import 'stylus/blog/top-nav'
import Fade from './fade'
export default class Nav extends Component {
    state = {
        modalVisible: false,
        showMenu: false,
        list: []
    }
    menuItemAnimateEnd(tar) {
        console.log(this.state.showMenu, 'end')
        if (!this.state.showMenu) {
            tar.style.display = 'none'
        }
    }
    menuItemAnimateStart(tar) {
        console.log(this.state.showMenu, 'start')
        if (this.state.showMenu) {
            tar.style.display = ''
        }
    }

    fetchData(keywords){
        http().get(`article/search?keywords=${keywords}&page=1&size=5`)
        .then(res => {
            if (res.code === 200) {
                console.log(this)
                this.setState({
                    list: res.data.data
                })
            }
        })
    }
  
    timer = null
    onChange = (val) => {
        const keywords = val.target.value
        if(!keywords) return
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>this.fetchData(keywords),1000)
    }
    render() {
        const view = (<div className='searchBox'>
            <div className="inputBox">
                <input type="text" onChange={this.onChange} placeholder="this is a window of the blog..." />
                <h3 onClick={() => this.setState({ modalVisible: !this.state.modalVisible })} className="blog-iconfont serch-btn">&#xe6b1;</h3>
            </div>
            {this.state.list.length > 0 && <ul className="result-list">
                {this.state.list.map(item => <li key={item._id}><a className="hoveLine" href={'/blog/article/' + item._id}>{item.title}</a></li>)}
            </ul>}
        </div>)
        return (
            <div className="top-nav">
                <h3 onClick={() => this.setState({ modalVisible: !this.state.modalVisible })} className="blog-iconfont serch-btn">&#xe623;</h3>
                <Fade
                    view={view}
                    animate={this.state.modalVisible}
                    duration={.25}
                />
                <div className={this.state.showMenu ? 'right-menu show' : 'right-menu'}>
                    <ul ref={'menuItem'} className="menu">
                        <li className="category">
                            <h2><Link to="/">主页</Link></h2>
                            <ul className="dropDown"></ul>
                        </li>
                        <li className="category">
                            <h2><Link to="/blog/category/all">分类</Link></h2>

                            <ul className="dropDown">
                                <li><a href="/blog/category/diary">日记</a></li>
                                <li><a href="/blog/category/media">媒体</a></li>
                                <li><a href="/blog/category/code">代码</a></li>
                            </ul>
                        </li>
                        <li className="category">
                            <h2><Link to="links">链接</Link></h2>
                            <ul className="dropDown">
                                <li><a href="#/">链接01</a></li>
                                <li><a href="#/">链接02</a></li>
                                <li><a href="#/">链接03</a></li>
                            </ul>
                        </li>
                        <li className="category">
                            <h2><Link to="/blog/message">留言</Link></h2>
                            <ul className="dropDown"></ul>
                        </li>
                        <li className="category">
                            <h2>关于</h2>
                            <ul className="dropDown">
                                <li><a href="/blog/about">关于</a></li>
                                <li><a href="/admin/home">后台</a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul className={this.state.showMenu ? 'btn show' : 'btn'} onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
                        <li className="line line1"></li>
                        <li className="line line2"></li>
                        <li className="line line3"></li>
                    </ul>

                </div>
                <div className="logo">
                    <h1 className="logo-box">
                        <img src={require('../../image/avatar.jpg')} alt="logo" />
                    </h1>
                    <h2>welcome to my blog</h2>
                </div>
            </div>
        )
    }
}