import { observable, action } from 'mobx'

class CommonStore {
  @observable scrollTop = 0
  tagMap = {
    "media": "媒体",
    "music": "音乐",
    "video": "视频",
    "image": "图片",
    "code": "代码",
    "diary": "日记",
    "js": "JavaScript",
    "html": "HTML",
    "css": 'CSS',
    "linux": 'Linux'
  }
  @action setScrollTop(num) {
    this.scrollTop = num
  }
}


export default new CommonStore()