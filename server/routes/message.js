const assert = require('assert')
const { isValid } = require('mongoose').Types.ObjectId

const User = require('../models/user')
const Group = require('../models/group')
const Message = require('../models/message')
const Socket = require('../models/socket')
const xss = require('../utils/xss')

const FirstLoadMessagesCount = 20
const EachFetchMessageCount = 30

module.exports = {
  async sendMessage(ctx) {
    const { to, type, content } = ctx.data
    assert(to, '收件人不能为空')

    let groupId = ''
    let userId = ''
    let group
    let user
    if (isValid(to)) {
      groupId = to
      assert(isValid(groupId), '无效的群组id')
      group = await Group.findOne({ _id: to })

      if (!group) {
        userId = to
        assert(isValid(userId), '无效的用户id')
        user = await User.findOne({ _id: userId })
      }
    }

    if (!group && !user) {
      assert(user, '用户/群组不存在')
    }

    let messageContent = content
      if (type === 'text') {
        messageContent = xss(content)
      }

      const sendUser = await User.findOne({  _id: ctx.socket.user }, {
        account: 1,
        avatar: 1,
        nickname: 1
      })
      let message

      try {
        message = await Message.create({
          from: ctx.socket.user,
          to,
          type,
          content: messageContent
        })
      } catch (err) {
        throw err
      }

      const messageData = {
        _id: message._id,
        to,
        type,
        createTime: message.createTime,
        from: sendUser.toObject(),
        toDetail: group || user,
        content: messageContent,
        isGroup: !!group
      }

      if (group) {
        ctx.socket.socket.to(groupId).emit('message', messageData)
      } else {
        const sockets = await Socket.find({ user: userId })
        sockets.forEach(socket => {
          console.log(userId, socket._id)
          ctx._io.to(socket.id).emit('message', messageData)
        })
      }
      return messageData
  },

  async getContactsLastMessage(ctx) {
    const { contacts } = ctx.data

    const promises = contacts.map(contactId =>
      Message.find(
        { to: contactId },
        { type: 1, content: 1, from: 1, createTime: 1 },
        { sort: {  createTime: -1 }, limit: FirstLoadMessagesCount }
      )
      .populate('from', { account: 1, nickname: 1, avatar: 1 })
    )

    const results = await Promise.all(promises)
    const messages = contacts.reduce((result, contactId, index) => {
      result[contactId] = (results[index] || []).reverse()
      return result
    }, {})

    return messages
  },

  async getContactsHistoryMessages(ctx) {
    const { contactId, existCount } = ctx.data

    const messages = await Message.find(
      { to: contactId },
      { type: 1, content: 1, from: 1, createTime: 1 },
      { sort: { createTime: -1 }, limit: EachFetchMessageCount + existCount }
    )
    .populate('from', { account: 1, avatar: 1, nickname: 1 })

    const result = messages.slice(existCount).reverse()
    return result
  },

  async getGroupHistoryMessages(ctx) {
    const { existCount, groupId } = ctx.data

    const group = await Group.findOne({ _id: groupId })
    const messages = await Message.find(
      { to: group._id },
      { type: 1, content: 1, from: 1, createTime: 1},
      { sort: { createTime: -1 }, limit: EachFetchMessageCount + existCount }
    )
  }
}
