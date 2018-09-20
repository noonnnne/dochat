const mongoose = require('mongoose')

const { Schema } = mongoose

const ContactsSchema = new Schema({
  'from' : {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User'
  },
  'to': {
    type: Schema.Types.ObjectId,
    index : true,
    ref : 'User'
  },
  'remark': String
})

const Contacts = mongoose.model('contacts', ContactsSchema)
module.exports = Contacts
