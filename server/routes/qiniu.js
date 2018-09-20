const qiniu = require('qiniu')
const assert = require('assert')
const config = require('../config').qiniu

const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
const options = {
  scope: config.bucket,
  expires: 60
}

const configNotEmpty = (config.accessKey !== '' && config.secretKey !== '' && config.urlPrefix !== 0)

module.exports = {
  async uploadToken() {
    assert(configNotEmpty, '七牛accessKey为空')

    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)

    return {
      token: uploadToken,
      urlPrefix: config.urlPrefix
    }
  }
}
