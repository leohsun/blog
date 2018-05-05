const {initSchemas,connect} = require('./dataBase/index')
const koa = require('koa')
const mongoose = require('mongoose')
const Cors = require('koa2-cors')
const Krouter = require('koa-router')
const router = require('./router')

;(async()=>{
  initSchemas()
  await connect()
})()
const Koa = require('koa');
const app = new Koa();

app.use(Cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8000,()=>{
    console.log('server open on port 8000')
  })
