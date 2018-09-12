void (function () {
  const app = {
    method: {
      login: function (e) {
        e.preventDefault()
        console.log('login')
      }
    }
  }

  window.onload = function () {
    // 事件监听
    document.addEventListener('click', e => {
      switch (e.target.id) {
        case 'login':
          app.method.login(e)
          break
        default:
      }
    })
  }
})(window)
