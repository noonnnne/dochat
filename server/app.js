const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

let app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// session
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
let redisConfig = require('./config').redis
let redisOptions = Object.assign({}, redisConfig, { logErrors: true })

app.use(session({
  name: 'dochat',
  store: new RedisStore(redisOptions),
  secret: 'dochat',
  saveUninitialized: false,
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 60 * 1000
  }
}))



app.use((req, res, next) => {
  next()
})

const userApi = require('./routes/user/index')
app.use('/', userApi)

module.exports = app
