const http = require('http')
const svr = http.createServer()
svr.listen(8888,()=>{
  console.log('server listening on port 8888')
})