const Koa = require('koa')
const IO = require('koa-socket')
const koaSend = require('koa-send')
const koaStatic = require('koa-static')
const path = require('path')

const app = new Koa()

const enhanceContext = require('./middleware/enhanceContext')
const log = require('./middleware/log')
const route = require('./middleware/route')

const userRoute = require('./routes/user')
const groupRoute = require('./routes/group')
const messageRoute = require('./routes/message')
const qiniuRoute = require('./routes/qiniu')

const Socket = require('./models/socket')

app.use(async (ctx, next) => {
  if (!/\./.test(ctx.request.url)) {
    await koaSend(ctx, 'index.html', {
      root: path.join(__dirname, '../public'),
      maxage: 1000 * 60 * 60 * 24 * 7,
      gzip: true
    })
  } else {
    await next()
  }
})

app.use(koaStatic(
  path.join(__dirname, '../public'),
  {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    gzip: true
  }
))

const io = new IO()

io.attach(app)

io.use(log())
io.use(enhanceContext())
io.use(route(
  app.io,
  app._io,
  Object.assign({}, userRoute, groupRoute, messageRoute, qiniuRoute)
))

app.io.on('connection', async ctx => {
  console.log(
  `----------------
    ctx.socket.id: ${ctx.socket.id}
    remoteAddress: ${ctx.socket.request.connection.remoteAddress}
    ----------------
  `)

  await Socket.create({
    id: ctx.socket.id,
    ip: ctx.socket.request.connection.remoteaddress
  })
})

app.io.on('disconnect', async ctx => {
  console.log(`----------------
                        ctx.socket.id: ${ctx.socket.id}
                        ----------------
  `)
  await Socket.remove({
    id: ctx.socket.id
  })
})

module.exports = app
