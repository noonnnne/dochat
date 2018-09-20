const webpackConfig = require('../../config/index')

const avatarCount = 9
const env = process.env.NODE_ENV === 'develop' ? 'dev' : 'build'
const path = webpackConfig[env].assetsPublicPath + webpackConfig[env].assetsSubDirectory

const generateRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarCount)
  return `${path}/avatar/${index}.jpg`
}

module.exports = generateRandomAvatar