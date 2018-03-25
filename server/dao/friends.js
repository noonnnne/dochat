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

  // FriendsModel
  const Friends = sequelize.define('user_contacts', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    'user_account': Sequelize.STRING,
    'friend_account': Sequelize.STRING,
    remark: Sequelize.STRING
  }, {
    timestamps: false
  })

  return {
    // 增
    add(data, cb) {
      sequelize.sync()
        .then(() => {
          Friends.create(data)
              .then(person => {
                console.log('--------')
                console.log(person)
                cb && cb(person)
              })
              .catch(err => {
                console.log('--------')
                console.log(err)
                if (err) {
                  const data = {
                    code: 1002,
                    msg: '好友已存在，请勿重复添加'
                  }
                  cb && cb(data)
                }
              })
        })
    },
    // 查
    find(condition = null, callback) {

    }
  }
}
