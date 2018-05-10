const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const articleSchema = mongoose.Schema({
  title: String,
  cover: String,
  MD: String,
  HTML: String,
  readCount: Number,
  summary: String,
  listCardType: String,
  poster:String,
  editor:String,
  readCount: {
    type :Number,
    default : 0
  },
  categories: [{type:String}],
  comments: [{
    type: ObjectId,
    ref: 'Comments'
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
articleSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()

})

mongoose.model('Article', articleSchema)