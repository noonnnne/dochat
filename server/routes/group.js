const assert = require('assert')
const { isValid } = require('mongoose').Types.ObjectId

const Group = require('../models/group')
const Socket = require('../models/socket')
const Message = require('../models/message')
const generateRandomAvatar = require('../utils/generateRandomAvatar')
const config = require('../config')

const getGroupOnlineMembers = async (group) => {
  const sockets = await Socket.find(
    { user: group.members },
    { os: 1, browser: 1, environment: 1, user: 1 }
  )
  .populate('user', { account: 1, nickname: 1, avatar: 1})

  const filterSockets = sockets.reduce((resuce, socket) => {
    result[socket.user] = socket
    return result
  }, {})

  return Object.values(filterSockets)
}

module.exports = {
  async createGroup(ctx) {
    const ownGroupCount = await Group.count({
      creator: ctx.socket.user
    })
    assert(ownGroupCount < config.maxGroupsCount, `创建的群已达上限${config.maxGroupsCount}`)

    const { name, intro, pinyin, avatar } = ctx.data
    assert(name, '群名不能为空')

    const group = await Group.findOne({ name })
    assert(!group, '群名已被占用了')

    let newGroup = null
    try {
      newGroup = await Group.create({
        name,
        intro,
        pinyin,
        avatar,
        creator: ctx.socket.user,
        members: [ctx.socket.user]
      })
    } catch (err) {
      throw err
    }

    ctx.socket.socket.join(newGroup._id)
    return {
      _id: newGroup._id,
      name: newGroup.name,
      avatar: newGroup.avatar,
      createTime: newGroup.createTime,
      creator: newGroup.creator,
      members: newGroup.members,
      intro: newGroup.intro,
      pinyin: newGroup.pinyin
    }
  },

  async joinGroup(ctx) {
    const { groupId } = ctx.data
    assert(isValid(groupId), '无效的群组id')

    const group = await Group.findOne({ _id: groupId })
    assert(group, '群组不存在')
    assert(group.members.indexOf(ctx.socket.user) === -1, '你已经在群组中了')

    group.members.push(ctx.socket.user)
    await group.save()

    const message = await Message.find(
      { toGroup: groupId },
      { type: 1, content: 1, from: 1, creatTime: 1 },
      { sort: { createTime: -1 }, limit: 3 }
    )
    .populate('from', { account: 1, nickname: 1, avatar: 1, pinyin: 1 })
    message.reverse()

    ctx.socket.socket.join(group._id)

    return {
      _id: group._id,
      name: group.name,
      avatar: group.avatar,
      createTime: group.createTime,
      creator: group.creator,
      pinyin: group.pinyin,
      message
    }
  },

  async leaveGroup(ctx) {
    const { groupId } = ctx.data
    assert(isValid(groupId), '无效的群组id')

    const group = await Group.findOne({ _id: groupId })
    assert(group, '群组不存在')
    // TODO: 可退出  退出后删除该群聊
    assert(group.creator.toString() !== ctx.socket.user.toString(), '群主不能退出自己创建的群')

    const index = group.members.indexOf(ctx.socket.user)
    assert(idnex !== -1, '你不在群组中')

    group.member.splice(index, 1)
    await group.save()

    ctx.socket.stocket.leave(group._id)
    return {}
  },

  async getGroupOnlineMembers(ctx) {
    const {groupId} = ctx.data
    assert(isValid(groupId), '无效的群组id')

    const group = await Group.findOne({_id: groupId})
    assert(group, '群组不存在')
    return getGroupOnlineMembers(group)
  },

  async changeGroupAvatar(ctx) {
    const {groupId, avatar} = ctx.data;
    assert(isValid(groupId), '无效的群组ID')
    assert(avatar, '头像地址不能为空')

    await Group.update({
      _id: groupId
    }, { avatar })
    return {};
  }
}