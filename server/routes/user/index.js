const express = require('express')
let userDAO = require('../../dao/user')()
let router = express.Router()

router
  // 登录
  .get('/login', (req, res) => {
    let condition = req.query
    userDAO.find(condition, (data) => {
      if (data.length) {
        if (!req.session.user) {
          req.session.user = data
        }
        res.send({
          code: 200,
          msg: '登录成功',
          data
        })
      } else {
        res.send({
          code: 404,
          msg: '帐号/密码错误或不存在',
          data: null
        })
      }
    })
  })

  // 注册
  .post('/regist', (req, res) => {
    userDAO.add({
      account: req.body.account,
      password: req.body.password,
      gender: 'unknown',
      nickname: `用户${new Date().getTime()}`,
      autograph: '',
      avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4048446268,4268796217&fm=27&gp=0.jpg'
    }, (data) => {
      data.code = 1001
      res.json(data)
    })
  })

  // 获取好友
  .get('/getFriendsList', (req, res) => {

  })

module.exports = router
