const { initSchemas, connect } = require('./dataBase/index')
const koaSession = require('koa-session')
const koa = require('koa')
const mongoose = require('mongoose')
const Cors = require('koa2-cors')
const Krouter = require('koa-router')
const router = require('./router')
  ; (async () => {
    initSchemas()
    await connect()
  })()
const repHeader = (ctx,next)=>{
  ctx.response.set('Access-Control-Allow-Origin', 'https://www.topdiantop.top');
  ctx.response.set('Access-Control-Allow-Credentials', true);
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.response.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  return next()
}
const sCfg = {
  key: 'blog:sess',
  maxAge: 86400000,
  signed: false
}
const Koa = require('koa');
const app = new Koa();
app.use(repHeader)
  .use(koaSession(sCfg, app))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8000, () => {
    console.log('server open on port 8000')
  })
