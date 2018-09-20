const mongoose = require('mongoose')

const { Schema } = mongoose

const GroupSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true,
    unique: true,
    index: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isDefault: Boolean,
  avatar: {
    type: String,
    default: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4048446268,4268796217&' +
  'fm=27&gp=0.jpg'
  },
  intro: String,
  pinyin: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

const Group = mongoose.model('Group', GroupSchema)
module.exports = Group
