const Sequelize = require('sequelize')
const config = require('../config').mysql

module.exports = () => {
  const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: 3306,
    dialect: 'mysql', // 当前使用mysql
    dialectOptions: {
      requestTimeout: 999999
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  // UserModel
  const User = sequelize.define('user', {
    account: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: Sequelize.STRING,
    gender: Sequelize.ENUM('male', 'female', 'unknown'),
    nickname: Sequelize.STRING,
    autograph: Sequelize.TEXT,
    avatar: Sequelize.STRING,
    birthday: Sequelize.STRING
  }, {
    timestamps: false
  })

  return {
    // 增
    add(data, callback) {
      console.log('----------')
      console.log(data)
      sequelize.sync()
        .then(() => {
          User.create(data)
              .then((person) => {
                callback && callback(person)
              })
              .catch((err) => {
                if (err) {
                  callback({
                    code: '',
                    msg: '帐号已存在'
                  })
                }
              })
        })
    },
    // 查
    find(condition = null, callback) {
      if (condition
          && typeof condition === 'object'
          && !Array.isArray(condition)
      ) {
        User.findAll({ where: condition })
            .then((res) => {
              callback && callback(res)
            })
      }
    },
    // 改
    update(condition, modify, callback) {
      if (!condition && !modify) {
        throw new Error(`
          condition and modify is required!
          At server/dao/index file, line 65 =>
        `)
      }
      User.update(modify, condition)
          .then((res) => {
            callback && callback(res)
          })
          .catch((e) => {
            callback && callback(e)
          })
    },
    // 删
    delete(condition, callback) {
      if (!condition) {
        return undefined
      }
      User.destroy({ where: condition })
          .then((res) => {
            callback && callback(res)
          })
          .then((e) => {
            callback && callback(e)
          })
    }
  }
}
