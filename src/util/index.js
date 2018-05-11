import axios from 'axios'
import { message } from 'antd'
import adminStore from '../stores/admin'
let loadingFn = null
export const http = (type) => {
  if (type === 'adminLoading') {
    loadingFn = adminStore.setLoading
  }
  return ajax
}

const ajax = axios.create({
  // baseURL: 'https://api.topdiantop.top/blog',
  baseURL: 'http://localhost:8000/blog',
  timeout: 5000,
  withCredentials: true
})
ajax.interceptors.request.use((cfg) => {
  loadingFn && loadingFn(true)
  return cfg
}, (err) => {
  loadingFn && loadingFn(false)
  console.error(err)
})
ajax.interceptors.response.use((res) => {
  loadingFn && loadingFn(false)
  if (res.status === 200) {
    if (res.data.code === 401) {
      window.location = '/admin/login'
    }
    if (res.data.code !== 200) {
      message.warning(res.data.msg)
    }
    return res.data
  } else {
    message.error('通信错误!!')
  }
  return res
}, (err) => {
  console.log(err)
  loadingFn && loadingFn(false)
  message.error(err.toString())
  return []
})

export const formattedTime = (time, cfg = { symbol: "-" }) => {
  const raw = new Date(time)
  const year = raw.getFullYear()
  const month = raw.getMonth() + 1
  const day = raw.getDate()
  const hours = raw.getHours()
  const minutes = raw.getMinutes()
  const seconds = raw.getSeconds()
  if (cfg.dateOnly) {
    return `${year}${cfg.symbol}${month > 9 ? month : '0' + month}${cfg.symbol}${day > 9 ? day : '0' + day}`
  } else if (cfg.timeOnly) {
    return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
  }
  return `${year}${cfg.symbol}${month > 9 ? month : '0' + month}${cfg.symbol}${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
}
