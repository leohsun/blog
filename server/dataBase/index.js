const { resolve } = require('path')
const glob = require('glob')
const mongoose = require('mongoose')
const db = 'mongodb://127.0.0.1:10086/blog'
let maxTimes = 0
mongoose.Promise = global.Promise
module.exports = {
  initSchemas() {
      glob.sync(resolve(__dirname, './schema', '**.js')).forEach(item=>{
        require(item)
      })
  },
  connect() {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_EVN !== 'production') {
        mongoose.set('debug', true)
      }
      mongoose.connect(db)
      mongoose.connection.on('disconnected', () => {
        maxTimes++
        if (maxTimes < 5) {
          mongoose.connect(db)
        } else {
          throw new Error('数据库重连失败，请修复...')
        }
      })
      mongoose.connection.once('open', () => {
        console.log('we are connected!!')
        resolve()
      })
      mongoose.connection.on('error', err => {
        console.error(err)
        reject()
      })
    })

  }
}
