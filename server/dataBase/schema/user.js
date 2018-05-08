const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  role:{
    type: String,
    default:'user'
  },
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
userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})


mongoose.model('User', userSchema)