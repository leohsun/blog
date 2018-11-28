const { initSchemas, connect } = require('./dataBase/index')
const koaSession = require('koa-session')
const router = require('./router')
  ; (async () => {
    initSchemas()
    await connect()
  })()
const allowedOrigins = ['https://www.topdiantop.top', 'https://topdiantop.top','http://localhost:3000']
const repHeader = (ctx, next) => {
  const { origin } = ctx.header;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : 'https://www.topdiantop.top';
  ctx.response.set('Access-Control-Allow-Origin', allowedOrigin);
  ctx.response.set('Access-Control-Allow-Credentials', true);
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.response.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  return next()
}


const Koa = require('koa');
const app = new Koa();

app.keys = ['leohsun-blog']
const sCfg = {
  key: 'blog:sess',
  maxAge: 18000000, //300min
  signed: true,
  overwrite: true,
  httpOnly: true,
  rolling: true
}
app.use(repHeader)
  .use(koaSession(sCfg, app))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(4444, () => {
    console.log('server open on port 4444')
  })
