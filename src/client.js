const _md5 = require('../lib/md5')
const { post } = require('../lib/post')

class Client {
  constructor (username = null, password = null, urls = null) {
    if (!username) {
      throw Error('username 不能为空')
    }
    if (!password) {
      throw Error('password 不能为空')
    }
    if (!urls) {
      throw Error('urls 不能为空')
    } else {
      if (!urls.login) {
        throw Error('urls 中缺少 login url')
      }
      if (!urls.logout) {
        throw Error('urls 中缺少 logout url')
      }
      if (!urls.forceLogout) {
        throw Error('urls 中缺少 forceLogout url')
      }
    }

    this._username = username
    this._password = password
    this._urls = urls
    this._uid = ''
  }

  login () {
    let username = this._username
    let password = this._password
    let url = this._urls.login

    let postData = {
      username: username,
      password: _md5.hex_md5(password).substr(8, 16),
      drop: 0,
      type: 1,
      n: 100
    }

    return new Promise((resolve, reject) => {
      post(url, postData)
        .then(res => {
          let pattern = /^[\d]+$/
          if (pattern.test(res)) {
            this._uid = res
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }

  logout () {
    let uid = this._uid
    let url = this._urls.logout

    let postData = {
      uid
    }

    return new Promise((resolve, reject) => {
      post(url, postData)
        .then(res => {
          if (res === 'logout_ok') {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }

  forceLogout () {
    let username = this._username
    let password = this._password
    let url = this._urls.forceLogout

    let postData = {
      username: username,
      password: password,
      drop: 0,
      type: 1,
      n: 1
    }

    return new Promise((resolve, reject) => {
      post(url, postData)
        .then(res => {
          if (res === 'logout_ok') {
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }
}

module.exports = Client

if (require.main === module) {
  const setting = require('../setting')
  let username = process.argv[2]
  let password = process.argv[3]
  let urls = setting.url

  const client = new Client(username, password, urls)
  client.forceLogout().then(res => {
    console.log(res)
  })
}
