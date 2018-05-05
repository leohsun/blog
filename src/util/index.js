import axios from 'axios'
import { message } from 'antd'
let lodingFn = null
export const http = (fn)=>{
  lodingFn = fn
  return ajax
}
const ajax = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 2000,
})
ajax.interceptors.request.use((cfg) => {
  lodingFn && lodingFn(true)
  return cfg
},(err)=>{
  lodingFn && lodingFn(false)
  console.error(err)
})
ajax.interceptors.response.use((res) => {
  lodingFn && lodingFn(false)
  if (res.status === 200) {
    if (res.data.code === 200) {
      message.success(res.data.msg)
      return res.data.data
    } else {
      message.warning(res.data.msg)
      return res.data
    }
  } else {
    message.error('通信错误!!')
  }
  return res
},(err)=>{
  console.log(err)
  lodingFn && lodingFn(false)
  message.error(err.toString())
  return []
})

export const formattedTime = (time,splitSymbol)=>{
  const symbol= splitSymbol || '-'
  const raw = new Date(time)
  const year = raw.getFullYear()
  const month = raw.getMonth()+1
  const day = raw.getDay()
  const hours = raw.getHours()
  const minutes = raw.getMinutes()
  const seconds = raw.getSeconds()
  return `${year}${symbol}${month>9?month:'0'+month}${symbol}${day>9?day:'0'+day} ${hours>9?hours:'0'+hours}:${minutes>9?minutes:'0'+minutes}:${seconds>9?seconds:'0'+seconds}`
}
