;(function (window) {
  const Client = require('./src/client')
  const client = new Client('', '')

  client.login()
  // client.logout()
  // client.forceLogout()
})(window)
