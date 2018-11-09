const { app, Menu, Tray, Notification, nativeImage } = require('electron')
const _path = require('path')

const Client = require('./src/client')
const Store = require('electron-store')

const setting = require('./setting')
const store = new Store()

let client = null
let tray = null

const requireUserInfo = function () {
  let noti = new Notification({
    title: '需要账号和密码',
    subtitle: '悬停此处，输入账号和密码，用英文冒号（:）隔开',
    hasReply: true
  })

  noti.on('reply', (e, text) => {
    text = text.split(':')
    let username = text[0] || ''
    let password = text[1] || ''
    if (username && password) {
      store.set('username', text[0] || '')
      store.set('password', text[1] || '')
      client = new Client(username, password, setting.url)
    } else {
      noti.show()
    }
  })
  noti.show()
}

app.on('will-finish-launching', () => {
  app.dock.hide()
})

app.on('ready', () => {
  tray = new Tray(
    nativeImage.createFromPath(
      _path.join(__dirname, setting.relative_path.icon)
    )
  )
  tray.setToolTip('zjucst-internet-login-client')

  let username = store.get('username')
  let password = store.get('password')

  if (username && password) {
    client = new Client(username, password, setting.url)
  } else {
    requireUserInfo()
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '上线',
      type: 'normal',
      click: () => {
        if (!client) {
          return requireUserInfo()
        }
        client
          .login()
          .then(res => {
            new Notification({
              title: '登录成功',
              subtitle: res
            }).show()
          })
          .catch(res => {
            new Notification({
              title: '登录失败',
              subtitle: res
            }).show()

            if (res === 'online_num_error') {
              // todo: 添加 强制下线自动登录 逻辑
            }
          })
      }
    },
    {
      label: '下线',
      type: 'normal',
      click: () => {
        if (!client) {
          return requireUserInfo()
        }
        client
          .logout()
          .then(res => {
            new Notification({
              title: '下线成功',
              subtitle: res
            }).show()
          })
          .catch(res => {
            new Notification({
              title: '下线失败',
              subtitle: res
            }).show()
          })
      }
    },
    {
      label: '强制下线',
      type: 'normal',
      click: () => {
        if (!client) {
          return requireUserInfo()
        }

        client
          .forceLogout()
          .then(res => {
            new Notification({
              title: '强制下线成功',
              subtitle: res
            }).show()
          })
          .catch(res => {
            new Notification({
              title: '强制下线失败',
              subtitle: res
            }).show()
          })
      }
    },
    {
      type: 'separator'
    },
    {
      type: 'separator'
    },
    {
      label: '清除登录信息',
      type: 'normal',
      click: () => {
        let username = store.get('username')

        store.delete('username')
        store.delete('password')
        this.client = null

        new Notification({
          title: '清除登录信息成功',
          subtitle: username
        }).show()
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
})
