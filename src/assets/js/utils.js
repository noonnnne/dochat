export default {
  serialize(data) {
    let str = ''
    Object.keys(data).forEach(item => {
      str += `${item}=${encodeURIComponent(data[item])}&`
    })
    return str ? str.substr(0, str.length - 1) : ''
  }
}
