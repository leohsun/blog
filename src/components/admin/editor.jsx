import React from 'react'
import { http } from '../../util'
import 'stylus/admin/editor'
import { Input, Upload, Icon, Modal, Select, Form, Button, Radio, Popover } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
const FormItem = Form.Item
const PropTypes = require('prop-types')
@Form.create()
export default class Edior extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    onExport: PropTypes.func

  }
  componentDidMount() {
    const { data } = this.props
    if (data && data !== {}) {
      for (let k in data) {
        if (this.state.hasOwnProperty(k)) {
          this.setState({ [k]: data[k] })
        }
      }
    }
  }

  state = {
    loading: false,
    toolBarModalTips: '',
    toolBarModalVisible: false,
    showCarModal: false,
    toolBarModalTitle: '',
    toolBarModalLink: '',
    cover: '',
    listCardType: 'text-image', //plain-text album text-title text-image
    bgList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://topdiantop.top/assets/images/default_bg.jpg',
    }],
    previewImage: '',
    previewVisible: false,
    HTML: '',
    MD: '',
    card_title: '',
    card_cover: '',
    card_summary: '',
    categories: [],
    title: '',
    card_link: 'http://www.topdiantop.top/',
    showWebPreview: false,
    tagMap: [
      { value: "media", label: "媒体" },
      { value: "music", label: "音乐" },
      { value: "video", label: "视频" },
      { value: "image", label: "图片" },
      { value: "code", label: "代码" },
      { value: "diary", label: "日记" },
      { value: "js", label: "JavaScript" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "linux", label: "Linux" }
    ]
  }
  starIdx = 0
  endIdx = 0
  selectedVal = ''
  typeofTextFormattedByToolsbarWidthUrl = ''
  saveVal2State(key, _) {
    this.setState({ [key]: _.target.value })
  }
  categoryChange = (val) => {
    this.setState({ categories: val })
  }
  imageCancel = () => this.setState({ previewVisible: false })

  imagePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  imageRemove = () => {
    this.setState({
      bgList: []
    })
  }
  listCardTypeonChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      listCardType: e.target.value,
    });
  }
  // handle editor

  //md2html
  symbol2el(str) {
    let rawStr = str
    const regExp = [
      {
        title: '分割线',
        reg: /^(?<!\\|\s+)---(\s)*$/,
        preFix: '<span class="split-line">',
        nextFix: '</span>'
      },
      {
        title: '加粗',
        reg: /(?<!\\)\*\*([^\s\*]+)\*\*/g,
        preFix: '<span class="text-bold">',
        nextFix: '</span>'
      },
      {
        title: '斜体',
        reg: /(?<!\\)\*([^\s\*]+)\*/g,
        preFix: '<span class="text-italic">',
        nextFix: '</span>'
      },
      {
        title: '行内code',
        reg: /(?<!\\)`(.+)`/g,
        preFix: '<span class="inline-code">',
        nextFix: '</span>'
      },
      {
        title: '删除线',
        reg: /(?<!\\)~~(.+)~~/g,
        preFix: '<span class="text-delline">',
        nextFix: '</span>'
      },
      {
        title: '下划线',
        reg: /(?<!\\)__(.+)__/g,
        preFix: '<span class="text-underline">',
        nextFix: '</span>'
      },
      {
        title: '标题',
        reg: /(?<!\\)##(.+)/g,
        preFix: '<h2 class="text-title">',
        nextFix: '</h2>'
      },
      {
        title: '引用',
        reg: /(?<!\\|[^<]+)>(.+)/g,
        preFix: '<blockquote><p>',
        nextFix: '</p></blockquote>'
      },
      {
        title: '链接',
        reg: /(?<!\\)!\[([^\s(!\[)]+)\]\(([^\s\(]+)\)/g,
        fix: '<a class="editor-link" href="LINK" alt="TITLE">TITLE</a>'
      },
      {
        title: '标签文本', //#this#
        reg: /(?<!\\)\?\[([^\s(\[]+)\]\(([^\s\(]+)\)/g,
        fix: '<a class="editor-tag" href="LINK">TITLE</a>'
      },
      {
        title: '图片',
        reg: /(?<!\\)\*\[([^\s(\[]+)\]\(([^\s\(]+)\)/g,
        fix: '<div class="editor-image"><img src="LINK" alt="TITLE"/><h2 class="image-title">TITLE</h2></div>'
      },
      {
        title: '音乐',
        reg: /(?<!\\)@\[([^\s]\[]+)\]\(([^\s\(]+)\)/g,
        fix: '<div class="editor-music"><audio src="LINK"/><h2 class="music-title">TITLE</h2></div>'
      },
      {
        title: '视频',
        reg: /(?<!\\)#\[([^\s\])]+)\]\(([^\s\)]+)\)/g,
        fix: '<div class="editor-video"><video src="LINK"/><h2 class="vedio-title">TITLE</h2></div>'
      },
      {
        title: '卡片',
        reg: /(?<!\\)\$\$([^\s\$)]+)\$\$\[([^\s\[]+)\]{([^\s}]+)}\(([^\s)]+)\)/g,
        fix: '<div class="editor-card"><a href="$4"><div class="lfet-image-cover"><img src="$2" alt="$1"/></div><div class="right-content"> <h2>$1</h2><p>$3</p></div></div></a> '
      },
    ]
    for (let i = 0; i < regExp.length; i++) {
      console.log('rawStr:',rawStr)
      rawStr = rawStr.replace(regExp[i].reg, (m, $1, $2, $3, $4, $5) => {

        if (typeof $3 === 'number') { //说明是图片等
          return regExp[i].fix.replace('LINK', $2).replace(/TITLE/g, $1)
        } else if (typeof $5 === 'number') { //卡片
          return regExp[i].fix.replace(/\$1/g, $1).replace('$2', $2).replace('$3', $3).replace('$4', $4)
        }
        const key = $1 || ''
        return regExp[i].preFix + key + regExp[i].nextFix
      })
    }

    return rawStr
  }
  code2el(str) {
    const regArr = [ //关键字满足 $1-$3-$4
      {
        type: '关键字',
        reg: /(?<=>\.|[^<>\w'"`]|\s)(return|document|window|true|false|null|export|import|break|case|catch|continue|default|delete|do|else|finally|for|function|if|instanceof|in|new|return|switch|this|throw|try|typeof|var|let|const|void|while|with)(?=\.|[^<>\w]|\s<)/g,
        cls: 'code-keyword'
      },
      {
        type: '字符串',
        reg: /(?<=>[^<]*|\s)((`[^`]*`)|('[^']*')|("[^"]*"))(?=[^<]*<)/g,
        cls: 'code-string'
      },
      {
        type: '数字',
        reg: /(?<=>[^<>'"`]*|\s)(\d+)(?=[^<>\w'"`]*<)/g,
        cls: 'code-number'
      },
      {
        type: '注释',
        reg: /(?<=>[^<>'"`]*|\s)(\/\/[^<]+)(?=\s*[^<>]*<)/g,
        cls: 'code-comment'
      },
      {
        type: '变量',
        reg: /(?<=>[^<>'"`]*|\s)([a-zA-Z]\w*)(?=\s+|=[^<>]*<)/g,
        cls: 'code-varialbe'
      },

    ]
    let rawStr = str
    for (let i = 0; i < regArr.length; i++) {
      console.log('rawStr:' + rawStr)
      rawStr = rawStr.replace(regArr[i].reg, (m, $1, $2) => {
        console.log('$2:', $2, '$1:', $1)
        return `<span class="${regArr[i].cls}">${$1}</span>`
      })
    }
    return rawStr
  }
  md2html = () => {
    let html = ''
    const rawStr = this.state.MD
    //先处理 多行code 及 card 
    // const codeWrapStr = rawStr.replace(/[\s\S]*(```\n[^```]+```.*\n?)[\s\S]*/,(m,$1)=>{
    //   console.log($1,'code')
    // })
    let lineOne = ''
    // console.log(JSON.stringify(rawStr))
    let mdArr = rawStr.split('\n')
    for (let i = 0; i < mdArr.length; i++) {
      if (!mdArr[i].trim()) continue
      if (mdArr[i].trim().match(/^```/)) {  //code 开始
        lineOne = '' //清空一下
        while (!mdArr[++i].trim().match(/^```/)) { //取下一项 不为``` 
          //处理code
          //转义特殊字符
          const ripeStr = mdArr[i].replace(/</g, '&lt')
          const codeWrapStr = '<code>' + ripeStr + '</code>'
          const codeEl = this.code2el(codeWrapStr)
          lineOne += '<li>' + codeEl + '</li>'
        }
        html += '<ul class="code-section">' + lineOne + '</ul>'
      } else if (mdArr[i].trim().match(/^\d\..+/)) { //ol
        lineOne = '' //清空一下
        while (mdArr[i] && mdArr[i].match(/^\d\..+/)) { //
          //处理ol
          lineOne += '<li>' + mdArr[i++].replace(/^(\d\.)/, '<span class="list-prefix">$1</span>') + '</li>'
        }
        html += '<ol class="editor-list">' + lineOne + '</ol>'
      } else if (mdArr[i].match(/^\s*-(?!--)/)) { //ul
        lineOne = '' //清空一下
        while (mdArr[i] && mdArr[i].trim().match(/^-(?!--)/)) { //取下一项 不为-
          const item = this.symbol2el(mdArr[i])
          //处理ol
          lineOne += '<li>' + item.replace(/^(\s*-)/, '<span class="list-prefix">&weierp;</span>') + '</li>'
          i++
        }
        html += '<ul class="editor-list">' + lineOne + '</ul>'
        i--
      } else {
        // 转< > &
        const encodeStr = mdArr[i].replace(/((<([^<>])+>)|&)/g, (m, $1) => {
          if ($1 === '&') return '&amp;'
          return '&lt' + $1 + '&gt'
        })
        html += "<div class='editor-row'>" + this.symbol2el(encodeStr) + "</div>"
      }
    }
    this.setState({ HTML: `<div class="editor-style clearfix">${html}</div>` })
  }
  handleInputChange = (e) => {
    let MD = e.target.value
    this.setState({ MD })
  }
  slectedValFormattedInline(symbol) {
    if (!this.selectedVal || typeof symbol === 'undefined') return
    const strArr = this.strSlice() //拿到首末字符串
    // 对比symbol是否存在
    let sCharacter = strArr[0].slice(symbol.length * -1)
    let eCharacter = strArr[1].slice(0, symbol.length)
    if (sCharacter === symbol && eCharacter === symbol) { //存在标记 删除
      console.log('del: ' + symbol)
      this.starIdx -= symbol.length //staridx 
      this.endIdx -= symbol.length
      return strArr[0].slice(0, strArr[0].length - symbol.length) + this.selectedVal + strArr[1].slice(symbol.length, strArr[1].length)
    } else {
      console.log('add: ' + symbol)
      this.starIdx += symbol.length
      this.endIdx = this.starIdx + this.selectedVal.length //统一设置
      return strArr[0] + symbol + this.selectedVal + symbol + strArr[1]
    }
  }
  textFormattedByToolsbarInline(type) { //行内样式 
    if (typeof type === 'undefined') return console.warn(type, '未定义!')
    const limitStr = this.strSlice() //array
    let resultStr = ''
    let symbol = ''
    let tips = ''
    switch (type) {
      case 'bold':
        symbol = '**'
        tips = '加粗文字'
        break
      case 'italic':
        symbol = '*'
        tips = '斜体文字'
        break
      case 'underline':
        symbol = '__'
        tips = '文字下划线'
        break
      case 'delline':
        symbol = '~~'
        tips = '文字删除线'
        break
    }
    if (!this.selectedVal) { //选中文本不存在
      resultStr = limitStr[0] + `${symbol}${tips}${symbol}` + limitStr[1]
      this.starIdx += symbol.length
      this.endIdx = this.starIdx + tips.length
    } else { //文本存在
      resultStr = this.slectedValFormattedInline(symbol)
    }

    this.setState({ MD: resultStr })
    setTimeout(() => {  // setState 异步 so ...
      this.textArea.focus()
      this.textArea.setSelectionRange(this.starIdx, this.endIdx)
    }, 0)

  }

  sortIdxByOlorUl(rawStr, type) { //ol 与 ul 互转的foucs selectionRange 不准确 to-do...
    // 重排序号
    console.log('开始' + type + '序号的重排...')
    let arr = rawStr.split('\n')
    let ripeStr = ''
    let idx = 0
    for (let i = 0; i < arr.length; i++) {
      if ((!arr[i - 1] || !arr[i - 1].match(/^(\d\.)|-[^-]*/)) && !!arr[i].match(/^(\d\.)|-[^-]*/)) { //前一个不存在或者正则不通过，则当前为1
        ripeStr += arr[i].replace(/^(\d\.)|-/, type === 'ol' ? '1.' : '-') + '\n'
        idx = 1
      } else if ((arr[i - 1] && !!arr[i - 1].match(/^(\d\.)|-[^-]*/)) && !!arr[i].match(/^(\d\.)|-[^-]*/)) { //前一下有序号 当前过正则 则...
        ripeStr += arr[i].replace(/^(\d\.)|-/, type === 'ol' ? ++idx + '.' : '-') + '\n'
      } else {
        idx = 0
        ripeStr += arr[i] + '\n'
      }

    }
    return ripeStr
  }
  slectedValFormattedNewline(type, inline) {
    if (typeof type === 'undefined') return console.warn('symbol未定义!')
    const strArr = this.strSlice() //array
    let resultStr = ''
    let symbol = ''
    let tips = ''
    switch (type) {
      case 'blockquote':
        symbol = '>'
        tips = '引用文本'
        break
      case 'code':
        symbol = '`'
        tips = '请输入代码'
        break
      case 'title':
        symbol = '##'
        tips = '标题文字'
        break
      case 'ol':
        symbol = '1.'
        tips = '列表项'
        break
      case 'ul':
        symbol = '-'
        tips = '列表项'
        break
      case 'hr':
        symbol = '---'
        break
    }
    // 对比symbol是否存在
    let sCharacter = strArr[0].slice(symbol.length * -1)
    let eCharacter = strArr[1].slice(0, symbol.length)
    const focusText = this.selectedVal || tips
    if (inline) { //e.g:文本`code`文本
      if (symbol === '`') { //行内code不换行
        if (sCharacter === symbol && eCharacter === symbol) { //code 存在symbol 
          console.log('del: ' + symbol)
          resultStr = strArr[0].slice(0, strArr[0].length - 1) + this.selectedVal + strArr[1].slice(1, strArr[1].length)
          this.starIdx -= 1
          this.endIdx -= 1
        } else {
          resultStr = strArr[0] + '`' + this.selectedVal + '`' + strArr[1]
          this.starIdx += 1
          this.endIdx += 1
          console.log('add: ' + symbol)
        }
      } else if (strArr[0].slice(symbol.length * -1) === symbol) { // 存在symbol
        console.log('del: ' + symbol)
        resultStr = strArr[0].slice(0, strArr[0].length - symbol.length) + this.selectedVal + strArr[1]
        this.starIdx -= symbol.length
        this.endIdx -= symbol.length
      } else {
        console.log('add: ' + symbol)
        const focusText = this.selectedVal || tips
        resultStr = strArr[0] + '\n' + symbol + focusText + '\n' + strArr[1]
        this.starIdx += symbol.length + 1
        this.endIdx += symbol.length + 1
      }
    } else if (symbol === '`') { //e.g ``` \n code \n ``` //new line
      console.log('add: ' + symbol)
      const tripleSymbol = symbol + symbol + symbol + '\n'
      const sStr = strArr[0].replace(/\n+$/, '') //处理换行符
      const dealedStr = sStr ? sStr + '\n' : ''
      resultStr = dealedStr + tripleSymbol + focusText + '\n' + tripleSymbol + strArr[1]
      this.starIdx = dealedStr.length + tripleSymbol.length
      this.endIdx = this.starIdx + tripleSymbol.length + 1
    } else { //整行 
      console.log('add: ' + symbol)
      const sStr = strArr[0].replace(/\n+$/, '') //处理换行符
      const dealedStr = sStr ? sStr + '\n' : ''
      if (type === 'ol') { //ol 有序号  检测相邻元素并重排序号
        const rawStr = dealedStr + symbol + focusText + '\n' + strArr[1].replace(/^\n|\n$/, '')
        resultStr = this.sortIdxByOlorUl(rawStr, 'ol') //重排序
        // 暂不设定setSelectionRange
        this.starIdx = dealedStr.length + symbol.length
        this.endIdx = this.starIdx + focusText.length
      } else if (type === 'ul') { //ol 有序号  检测相邻元素并重排序号
        const rawStr = dealedStr + symbol + focusText + '\n' + strArr[1].replace(/^\n|\n$/, '')
        resultStr = this.sortIdxByOlorUl(rawStr, 'ul') //重排序
        // 暂不设定setSelectionRange
        this.starIdx = dealedStr.length + symbol.length
        this.endIdx = this.starIdx + focusText.length
      } else if (type === 'card') {
        resultStr = dealedStr + `$$${this.state.card_title}$$[${this.state.card_cover}]{${this.state.card_summary}}(${this.state.card_link})` + '\n' + strArr[1].replace(/^\n|\n$/, '')

      } else {
        resultStr = dealedStr + symbol + focusText + '\n' + strArr[1].replace(/^\n|\n$/, '')
        this.starIdx = dealedStr.length + symbol.length + (type === 'hr' ? 1 : 0)
        this.endIdx = this.starIdx + focusText.length
      }

    }
    //选中文本
    this.setState({ MD: resultStr })
    setTimeout(() => {  // setState 异步 so ...
      this.textArea.focus()
      this.textArea.setSelectionRange(this.starIdx, this.endIdx)
    }, 0)
  }
  textFormattedByToolsbarNewline(type) { //换行
    if (this.selectedVal && !this.compareRowAndSelectVal()) { //有选中且选中了当前行的一部分，按行内处理
      console.log('part')
      this.slectedValFormattedNewline(type, true)
    } else { //另起一行并添加符号及提示文本
      console.log('whole')
      this.slectedValFormattedNewline(type, false)
    }
  }
  compareRowAndSelectVal() { //判断是否选中当前行的所有 
    const strArr = this.strSlice()
    // if(this.selectedVal){ //未选择 默认换行
    //   return false
    // }
    if (this.state.MD.trim() === this.selectedVal) { //当前选择为所有，前后字符都为空
      return true
    }
    //当前选择前后字符为'\n'或前字符为'\n'后字符不存在
    if (strArr[0].match(/(\n)+$/) && (strArr[1].match(/^(\n)+/) || !strArr[1])) {
      return true
    }
    //当前选择前为空，后字符有'\n',前后字符都为空的第一条已判断 trim()
    if (!strArr[0] && strArr[1].match(/^(\n)+/)) {
      return true
    }
    return false


  }
  formattedToolbar(type, tips) { //textFormattedByToolsbarWidthUrl
    let prefix = ''
    let nextfix = ''
    const wrap = this.strSlice()[0].trim() ? '\n' : ''
    switch (type) {
      case 'link':
        prefix = '!['
        break
      case 'tag':
        prefix = '?['
        break
      case 'image':
        prefix = wrap + '*['
        nextfix = '\n'
        break
      case 'music':
        prefix = wrap + '@['
        nextfix = '\n'
        break
      case 'video':
        prefix = wrap + '#['
        nextfix = '\n'
        break
    }
    const selectedText = this.state.toolBarModalTitle || tips
    const linkUrl = this.state.toolBarModalLink || 'https://www.topdiantop.top/'
    this.starIdx += prefix.length
    this.endIdx = this.starIdx + selectedText.length
    return prefix + selectedText + ']' + '(' + linkUrl + ')' + nextfix
  }

  textFormattedByToolsbarWidthUrl(type) {
    if (typeof type === 'undefined') return console.warn('symbol未定义!')
    const strArr = this.strSlice() //array
    let resultStr = ''
    let tips = ''
    switch (type) {
      case 'link':
        tips = '链接文本'
        break
      case 'tag':
        tips = '标签文本'
        break
      case 'image':
        tips = '图片'
        break
      case 'music':
        tips = '音乐'
        break
      case 'video':
        tips = '视频'
        break
    }
    // 除了link及tag，其余都换行

    resultStr = strArr[0] + this.formattedToolbar(type, tips) + strArr[1]

    //选中文本
    this.setState({ MD: resultStr })
    setTimeout(() => {  // setState 异步 so ...
      this.textArea.focus()
      this.textArea.setSelectionRange(this.starIdx, this.endIdx)
    }, 0)
  }
  showToolBarModal(type) {
    this.setState({
      toolBarModalVisible: true,
      toolBarModalTitle: this.selectedVal,
      toolBarModalLink: ''
    })
    this.typeofTextFormattedByToolsbarWidthUrl = type
  }
  strSlice() { //via selectionStart and end to slice rawString return an arrary
    const rawStr = this.state.MD
    const s = rawStr.slice(0, this.starIdx)
    const e = rawStr.slice(this.endIdx, rawStr.length)
    return [s, e]
  }
  textAreaSlect(v) {
    this.starIdx = v.target.selectionStart
    this.endIdx = v.target.selectionEnd
    const rawVal = v.target.value
    this.selectedVal = rawVal.slice(this.starIdx, this.endIdx)
  }
  toolBarModalHandleCancle = () => {
    this.setState({ toolBarModalVisible: false, toolBarModalLink: '' })
  }
  toolBarModalHandleComfirm = () => {
    this.setState({ toolBarModalVisible: false })
    this.textFormattedByToolsbarWidthUrl(this.typeofTextFormattedByToolsbarWidthUrl)
  }
  awaitFn() {
    this.timer && clearTimeout(this.timer)
    return new Promise((res, rej) => {
      this.timer = setTimeout(() => {
        res()
      }, 0)
    })
  }
  toolBarModalHandleInput(e, type) {
    this.setState({
      ['toolBarModal' + type]: e.target.value,
    })

  }
  showCardModal = () => {
    this.setState({
      showCarModal: true,
      card_title: '',
      card_cover: '',
      card_summary: '',
      card_link: ''
    })
  }

  cardHandleComfirm = () => {
    this.setState({
      showCarModal: false
    })
    this.slectedValFormattedNewline('card')
  }
  cardHandleCancle = () => {
    this.setState({
      showCarModal: false
    })
  }
  cardModalInput(type, _) {
    this.setState({
      [type]: _.target.value
    })
  }
  showInWeb = () => {
    this.setState({
      showWebPreview: true
    })
  }
  previewHandleComfirm = () => {
    this.setState({
      showWebPreview: false
    })
  }
  previewHandleCancle = () => {
    this.setState({
      showWebPreview: false
    })
  }
  loading = (bool) => {
    this.props.adminStore.setLoading(bool)
  }
  exportData = async (e) => {
    if (this.props.onExport) {
      e.preventDefault();
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          this.md2html()
          await this.awaitFn
          let data = {}
          data.title = values.title
          data.cover = this.state.cover || 'https://static.topdiantop.top/blog/images/default_bg.jpg'
          data.listCardType = this.state.listCardType
          data.categories = values.categories
          data.summary = this.state.MD.slice(0, 200)
          data.MD = this.state.MD
          data.HTML = this.state.HTML
          this.props.onExport(data)
        }
      });
    }
  }
  render() {
    // const uploadButton = (
    //   <div>
    //     <Icon type={this.state.loading ? 'loading' : 'plus'} />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // )
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3, },
      wrapperCol: { span: 16 }
    }
    return (
      <div>
        <div className="aritcle-presets">
          <Form
            onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="文章标题">
              {getFieldDecorator('title', {
                initialValue: this.state.title,
                rules: [{ required: true, message: '请输入文章主标题!' }],
              })(
                <Input
                  placeholder="标题:文章主标题"
                />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文章分类">
              {getFieldDecorator('categories', {
                initialValue: this.state.categories,
                rules: [{ required: true, message: '请选择文章分类，可多选!' }],
              })(
                <Select placeholder="请选择分类、可多选" mode="multiple">
                  {this.state.tagMap.map(item => {
                    return <Option key={item.value}>{item.label}</Option>
                  })}
                </Select>
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="背景图片">
              {/* <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={this.state.bgList}
                onPreview={this.imagePreview}
                onChange={this.imageChange}
                onRemove={this.imageRemove}
              >
                {this.state.bgList.length >= 1 ? null : uploadButton}
              </Upload> */}
              <Input
                placeholder="背景图片地址(暂时手动填入，不填则默认首页背景图，后期增加上传功能)"
                value={this.state.bgImage}
                onChange={_ => this.saveVal2State('bgImage', _)}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="列表卡片样式">
              <RadioGroup onChange={this.listCardTypeonChange} value={this.state.listCardType}>
                <Popover content={<img src={require('../../image/plain-text.gif')} alt="plain-text" />} title="plain-text" trigger="hover">
                  <Radio value="plain-text">plain-text</Radio>
                </Popover>
                <Popover content={<img src={require('../../image/text-title.gif')} alt="text-title" />} title="text-title" trigger="hover">
                  <Radio value="text-title">text-title</Radio>
                </Popover>
                <Popover content={<img src={require('../../image/text-image.gif')} alt="text-image" />} title="text-image" trigger="hover">
                  <Radio value="text-image">text-image</Radio>
                </Popover>
                <Popover content={<img src={require('../../image/album.gif')} alt="album" />} title="album" trigger="hover">
                  <Radio value="album">album</Radio>
                </Popover>
              </RadioGroup>
            </FormItem>
          </Form>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.imageCancel}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </div>
        <div className="editor">
          <div className="editor-toolbar">
            <div className="column">
              <span onClick={_ => this.textFormattedByToolsbarInline('bold')} className="editor-iconfont btn">&#xe6d9;</span>
              <span onClick={_ => this.textFormattedByToolsbarInline('italic')} className="editor-iconfont btn">&#xe6f8;</span>
              <span onClick={_ => this.textFormattedByToolsbarInline('underline')} className="editor-iconfont btn">&#xe72b;</span>
              <span onClick={_ => this.textFormattedByToolsbarInline('delline')} className="editor-iconfont btn">&#xe729;</span>
            </div>
            <div className="column">
              <span className="editor-iconfont btn" onClick={_ => this.showToolBarModal('link')}>&#xe701;</span>
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('blockquote')}>&#xe715;</span>
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('code')}>&#xe6f7;</span>
              <span className="editor-iconfont btn" onClick={_ => this.showToolBarModal('image')}>&#xe665;</span>
              <span className="editor-iconfont btn" onClick={_ => this.showToolBarModal('music')}>&#xe668;</span>
              <span className="editor-iconfont btn" onClick={_ => this.showToolBarModal('video')}>&#xe669;</span>
              <span className="editor-iconfont btn" onClick={_ => this.showToolBarModal('tag')}>&#xe68c;</span>
              <span className="editor-iconfont btn" onClick={this.showCardModal}>&#xe68d;</span>
            </div>
            <div className="column">
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('title')}>&#xe62b;</span>
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('ol')}>&#xe71b;</span>
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('ul')}>&#xe71a;</span>
              <span className="editor-iconfont btn" onClick={_ => this.textFormattedByToolsbarNewline('hr')}>&#xe652;</span>
            </div>
            <div className="column">
              <span className="editor-iconfont btn">&#xe659;</span>
              <span className="editor-iconfont btn">&#xe65a;</span>
            </div>
            <div className="column layout">
              <span className="editor-iconfont btn" style={{ fontSize: '26px' }} onClick={this.md2html}>&#xe65b;</span>
              <span className="editor-iconfont btn" style={{ fontSize: '26px' }} onClick={this.showInWeb}>&#xe651;</span>
            </div>
            <div className="column">
              <span className="editor-iconfont btn disabled">&#xe660;</span>
              <span className="editor-iconfont btn">&#xe66a;</span>
              <span className="editor-iconfont btn">&#xe661;</span>
            </div>
            <Modal
              title={`请填入${this.state.toolBarModalTips}信息`}
              visible={this.state.toolBarModalVisible}
              onOk={this.toolBarModalHandleComfirm}
              onCancel={this.toolBarModalHandleCancle}
            >
              <Input addonBefore="标题" value={this.state.toolBarModalTitle} onChange={_ => { this.toolBarModalHandleInput(_, 'Title') }} />
              <Input addonBefore="链接" value={this.state.toolBarModalLink} onChange={_ => { this.toolBarModalHandleInput(_, 'Link') }} />
            </Modal>
            <Modal
              title="card录入区"
              visible={this.state.showCarModal}
              onOk={this.cardHandleComfirm}
              onCancel={this.cardHandleCancle}
            >
              <Input addonBefore="标题" value={this.state.card_title} onChange={_ => { this.cardModalInput('card_title', _) }} />
              <Input addonBefore="头图" value={this.state.card_cover} onChange={_ => { this.cardModalInput('card_cover', _) }} />
              <Input addonBefore="简介" value={this.state.card_summary} onChange={_ => { this.cardModalInput('card_summary', _) }} />
              <Input addonBefore="链接" value={this.state.card_link} onChange={_ => { this.cardModalInput('card_link', _) }} />
            </Modal>

          </div>
          <div className="handle-section">
            <div className="editor-edit">
              <textarea value={this.state.MD} ref={_ => this.textArea = _} onChange={this.handleInputChange} onSelect={_ => this.textAreaSlect(_)}></textarea>
            </div>
            <div className="editor-preview">
              {this.state.HTML}
              <Modal
                title="内容预览"
                width={800}
                style={{ top: 0 }}
                visible={this.state.showWebPreview}
                onOk={this.previewHandleComfirm}
                onCancel={this.previewHandleCancle}
                ref={_ => this.previewModal = _}
              >
                <div dangerouslySetInnerHTML={{ __html: this.state.HTML }}>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div className="handle-btn">
          <Button onClick={this.exportData} type="primary" icon="save" size="large">{this.props.btnContext ? this.props.btnContext : '导出数据'}</Button>
        </div>
      </div>
    )
  }
}