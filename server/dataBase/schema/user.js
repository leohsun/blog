const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    unique:true
  },
  password:{
    type:String
  },
  email:{
    type:String
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
userSchema.pre('save',next=>{
  if(this.isNew){
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  }else{
    this.meta.updatedAt = Date.now()
  }
})
