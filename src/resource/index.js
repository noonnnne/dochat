import axios from 'axios'
import utils from '../assets/js/utils'

const post = (url, data = {}) => {
  data = utils.serialize(data)
  return axios.post(url, data)
}
post()
const get = (url, data) => {
  if (data.mock) {
   url = `/static/mock/${url.split('/')[2]}.json`
   return axios.get(url)
  }
  return axios.get(url, { params: data })
}

const uri = {
  login: '/api/login',
  regist: '/api/regist'
}

export default {
  login(data = {}) {
    return get(uri.login, data)
  },
  regist(data = {}) {
    return post(uri.regist, data)
  }
}
