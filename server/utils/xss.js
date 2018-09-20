const xss = require('xss')

const myXss = new xss.FilterXSS({
  whiteList: {
    img: ['src'],
    a: ['contenteditable', 'type', 'class'],
    br: [],
    div: []
  }
})

module.exports = (text) => {
  return myXss.process(text)
}
