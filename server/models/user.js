const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  account: {
    type: String,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    trim: true
  },
  nickname: {
    type: String,
    trim: true,
    minlength: 1
  },
  avatar: {
    type: String
  },
  autograph: String,
  pinyin: String,
  gender: String,
  birthday: Date
})

const User = mongoose.model('User', UserSchema)
module.exports = User
