const assert = require('assert')
const bluebird = require('bluebird')
const bcrypt = bluebird.promisifyAll(require('bcrypt'), {suffix: '$'})
const jwt = require('jwt-simple')
const { isValid } = require('mongoose').Types.ObjectId

const User = require('../models/user')
const Group = require('../models/group')
const Message = require('../models/message')
const Contacts = require('../models/contacts')
const Socket = require('../models/socket')
const config = require('../config')
const generateRandomAvatar = require('../utils/generateRandomAvatar')

const saltRounds = 10

const generateToken = (user, environment) => {
  return jwt.encode(
    {
      user,
      environment,
      expires: Date.now() + config.tokenExpiressTime
    },
    config.jwtSecret
  )
}

module.exports = {
  async regist(ctx) {
    const {
      account,
      nickname,
      password,
      os,
      browser,
      pinyin,
      environment
    } = ctx.data

    assert(nickname, '用户名不能为空')
    assert(password, '密码不能为空')

    const user = await User.findOne({ account })
    assert(!user, '帐号已存在')

    const defaultGroup = await Group.findOne({ isDefault: true })
    assert(defaultGroup, '默认群组不存在')

    const salt = await bcrypt.genSalt$(saltRounds)
    const hash = await bcrypt.hash$(password, salt)

    let newUser = null

    newUser = await User.create({
      account,
      nickname,
      salt,
      password: hash,
      pinyin,
      gender: 'unknown',
      birthday: new Date('1997-01-01'),
      avatar: generateRandomAvatar(),
      groups: [defaultGroup]
    })

    defaultGroup.members.push(newUser)

    await defaultGroup.save()

    const token = generateToken(newUser._id, environment)
    ctx.socket.user = newUser._id
    await Socket.update({ id: ctx.socket.id }, {
      user: newUser._id,
      os,
      browser,
      environment
    })

    return {
      _id: newUser._id,
      avatar: newUser.avatar,
      nickname: newUser.nickname,
      account,
      groups: [{
        _id: defaultGroup._id,
        name: defaultGroup.name,
        avatar: defaultGroup.avatar,
        creator: defaultGroup.creator,
        createTime: defaultGroup.createTime,
        messages: []
      }],
      friends: [],
      token
    }
  },

  async login(ctx) {
    const {
      account,
      password,
      os,
      browser,
      environment
    } = ctx.data
    assert(account, '帐号不能为空')
    assert(password, '密码不能为空')

    const user = await User.findOne({ account })
    assert(user, '该帐号不存在')

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    assert(isPasswordCorrect,'密码错误')

    user.lastLoginTime = Date.now()
    await user.save()

    const groups = await Group.find({ members: user }, {
      _id: 1,
      name: 1,
      avatar: 1,
      creator: 1,
      intro: 1,
      pinyin: 1,
      createTime: 1,
      members: 1
    })

    groups.forEach(group => {
      ctx.socket.socket.join(group._id)
      return group
    })

    const contacts = await Contacts
      .find({from: user._id})
      .populate('to', { avatar: 1, account: 1, nickname: 1, pinyin: 1 })

    const token = generateToken(user._id, environment)

    ctx.socket.user = user._id
    await Socket.update({ id: ctx.socket.id }, {
      user: user._id,
      os,
      browser,
      environment
    })

    return {
      _id: user._id,
      avatar: user.avatar,
      nickname: user.nickname,
      account: user.account,
      gender: user.gender,
      autograph: user.autograph,
      groups,
      contacts,
      token
    }
  },

  async loginByToken(ctx) {
    const {
      token, os, browser, environment
    } = ctx.data

    assert(token, 'token不能为空')

    let payload = null
    try {
      payload = jwt.decode(token, config.jwtSecret)
    } catch (err) {
      return '非法token'
    }

    assert(Date.now() < payload.expires, 'token已过期')
    assert.equal(environment, payload.environment, '非法登录')

    const user = await User.findOne({ _id: payload.user }, {
      _id: 1,
      avatar: 1,
      nickname: 1,
      account: 1,
      gender: 1,
      birthday: 1,
      autograph: 1
    })
    assert(user, '用户不存在')

    user.lastLoginTime = Date.now()
    await user.save()

    const groups = await Group.find({ members: user }, {
      _id: 1,
      account: 1,
      avatar: 1,
      creator: 1,
      pinyin: 1,
      name: 1,
      intro: 1,
      createTime: 1,
      members: 1
    })
    groups.forEach(group => {
      ctx.socket.socket.join(group._id)
      return group
    })

    const contacts = await Contacts
      .find({ from: user._id })
      .populate('to', { avatar: 1, nickname: 1, account: 1, pinyin: 1, gender: 1, birthday: 1 })

    ctx.socket.user = user._id
    await Socket.update({ id: ctx.socket.id }, {
      user: user._id,
      os,
      browser,
      environment
    })

    return {
      _id: user._id,
      avatar: user.avatar,
      nickname: user.nickname,
      account: user.account,
      gender: user.gender,
      birthday: user.birthday,
      autograph: user.autograph,
      groups,
      contacts
    }
  },

  async updateUser(ctx) {
    const nickname = ctx.data.nickname
    const account = ctx.data.account
    const birthday = ctx.data.birthday
    const autograph = ctx.data.autograph
    const gender = ctx.data.gender
    const pinyin = ctx.data.pinyin
    const avatar = ctx.data.avatar

    await User.update({ account }, { nickname, birthday, autograph, gender, pinyin, avatar })
    const user = await User.findOne({ account })
    return user
  },

  async searchUser(ctx) {
    const { searchOpt, nickname } = ctx.data
    const data = []
    let res
    if (searchOpt) {
      data.push(
        { nickname: { $regex: searchOpt } },
        { pinyin: { $regex: searchOpt } }
      )

      res = User.find({
        $or: data
      })
    }
    if (nickname) {
      res = User.find({
        nickname
      })
    }

    return res
  },

  async searchUsersByIds(ctx) {
    const { userIds } = ctx.data
    const res = User.find({
      _id: {
        $in: userIds
      }
    }, { account: 1, nickname: 1, avatar: 1, _id: 1, autograph: 1, birthday: 1, gender: 1 })

    return res
  },

  async searchGroup(ctx) {
    const searchOpt = ctx.data
    const res = Group.find({
      $or: [
        { name: { $regex: searchOpt } },
        { pinyin: { $regex: searchOpt } }
      ]
    })
    return res
  },

  async addContact(ctx) {
    const { account, userId } = ctx.data
    assert(isValid(userId), '无效的用户id')

    const user = await User.findOne({ account })
    assert(user, '该用户不存在')

    const contact = await Contacts.find({
      from: ctx.socket.user,
      to: user._id
    })
    assert(contact.length === 0, '你们已经是好友了')

    const newContacts = await Contacts.create({
      from: ctx.socket.user,
      to: user
    })

    await Contacts.create({
      from: user._id,
      to: ctx.socket.user
    })

    return newContacts
  },

  async deleteFriend(ctx) {
    const { userId } = ctx.data
    assert(isValid(userId), '无效的用户id')

    const user = await User.findOne({ _id: userId })
    assert(user, '用户不存在')

    await Contacts.remove({ from: ctx.socket.user, to: user._id })
    return {}
  }
}
