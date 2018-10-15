const _http = require('http')
const _querystring = require('querystring')
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

module.exports = {
  post
}
