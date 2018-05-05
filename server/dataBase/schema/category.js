const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  articles: [{
    type: ObjectId,
    ref: 'Article'
  }],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
categorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()

})



mongoose.model('Category', categorySchema)