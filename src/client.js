const _http = require('http')
const _querystring = require('querystring')
const _md5 = require('./md5')
const { URL } = require('url')

function post (url, postDataObj, callback) {
  let postData = _querystring.stringify(postDataObj)
  let urlWithFormat = new URL(url)

  let options = {
    hostname: urlWithFormat.hostname,
    path: urlWithFormat.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  let req = _http.request(options, res => {
    let body = ''
    // console.log(`STATUS: ${res.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', chunk => {
      body += chunk
      // console.log(`BODY: ${chunk}`)
    })
    res.on('end', () => {
      // console.log('No more data in response.')
      callback(body)
    })
  })

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`)
  })

  req.write(postData)
  req.end()
}

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

    let url = 'http://192.0.0.6/cgi-bin/do_login'

    post(url, postData, res => {
      console.log(res)
      let pattern = /^[\d]+$/
      if (pattern.test(res)) {
        this.uid = res
      }
    })
  }

  logout () {
    let postData = {
      uid: this.uid
    }
    let url = 'http://192.0.0.6/cgi-bin/do_logout'

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
    let url = 'http://192.0.0.6/cgi-bin/force_logout'

    post(url, postData, res => {
      console.log(res)
    })
  }
}

module.exports = Client
