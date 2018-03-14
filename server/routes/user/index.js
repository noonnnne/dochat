const express = require('express')
let userDAO = require('../../dao/user')()
let router = express.Router()

router
  .get('/login', (req, res) => {
    let condition = req.query
    userDAO.find(condition, (data) => {
      if (!req.session.user) {
        req.session.user = data
      }
      res.send({
        code: 200,
        data
      })
    })
  })

  .post('/regist', (req, res) => {
    userDAO.add({
      account: req.body.account,
      password: req.body.password,
      gender: 'unknown',
      nickname: `用户${new Date().getTime()}`,
      autograph: '',
      avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4048446268,4268796217&fm=27&gp=0.jpg'
    }, (data) => {
      res.json(data)
    })
  })

module.exports = router
