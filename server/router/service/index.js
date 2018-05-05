const mongoose = require('mongoose')
const getModel = (name) => {
  return mongoose.model(name)
}
module.exports.getArrData = async function (modelName, arr) {
  return new Promise((resolve, reject) => {
    try {
      if(!arr.length) return []
      const model = getModel(modelName)
      let i = 0
      let res = []
      iterator = async (i) => {
        const one = await model.findById(arr[i])
        res.push(one)
        if (++i >= arr.length) {
          resolve(res)
        } else {
          iterator(i)
        }
      }
      iterator(i)
    } catch (err) {
      reject(err)
    }
  })
}