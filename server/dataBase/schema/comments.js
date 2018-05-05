const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId
const commentsSchema = new mongoose.Schema({
  username: String,
  email: String,
  website: String,
  comments: String,
  like_count: Number,
  dislike_count: Number,
  article: {
    type: ObjectId,
    ref: 'Article'
  },
  reply: [{
    username: String,
    email: String,
    website: String,
    comments: String,
    like_count: Number,
    dislike_count: Number,
    article: {
      type: ObjectId,
      ref: 'Article'
    }
  }]
})