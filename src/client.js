const _md5 = require('./md5')
const setting = require('./setting')
const { post } = require('./post')

class Client {
  constructor (username, password) {
    this.username = username
    this.password = password
    this.uid = ''
  }
  login () {
    let postData = {
      username: this.username,
      password: _md5.hex_md5(this.password).substr(8, 16),
      drop: 0,
      type: 1,
      n: 100
    }

    let url = setting.url.login

    post(url, postData, res => {
      console.log(res)
      let pattern = /^[\d]+$/
      if (pattern.test(res)) {
        this.uid = res
      } else {
        switch (res) {
          case 'online_num_error':
            // 强制登出
            this.forceLogout()
            // 每隔5秒尝试登陆直到登陆成功
            setTimeout(() => {
              this.login()
            }, 5 * 1000)
        }
      }
    })
  }

  logout () {
    let postData = {
      uid: this.uid
    }
    let url = setting.url.logout

    post(url, postData, res => {
      console.log(res)
    })
  }

  forceLogout () {
    let postData = {
      username: this.username,
      password: this.password,
      drop: 0,
      type: 1,
      n: 1
    }
    let url = setting.url.forceLogout

    post(url, postData, res => {
      console.log(res)
    })
  }
}

module.exports = Client
