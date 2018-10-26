const { app, Menu, Tray, Notification, nativeImage } = require('electron')
const _path = require('path')

const setting = require('./src/setting')
const Client = require('./src/client')

const Store = require('electron-store')
const store = new Store()

const appIcon = nativeImage.createFromPath(
  _path.join(__dirname, setting.relative_path.icon)
)

// app
class Menus {
  constructor () {
    this.tray = null
    this.contextMenu = null
    this.client = null
  }
  init (icon) {
    this.tray = new Tray(icon)
    this.tray.setToolTip('zjucst-internet-login')

    let username = store.get('username')
    let password = store.get('password')

    if (username && password) {
      this.client = new Client(username, password)
    } else {
      this.requireUsernameAndPassword()
    }
  }
  setContextMenu (contextMenu) {
    this.contextMenu = contextMenu
    this.tray.setContextMenu(contextMenu)
  }
  requireUsernameAndPassword () {
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
        this.client = new Client(username, password)
      } else {
        noti.show()
      }
    })

    noti.show()
  }
  check () {
    if (!this.client) {
      this.requireUsernameAndPassword()
      return false
    }
    return true
  }
  clear () {
    let username = store.get('username')

    store.delete('username')
    store.delete('password')
    this.client = null

    new Notification({
      title: '清除登录信息成功',
      subtitle: username
    }).show()
  }

  login () {
    if (this.check()) {
      let loginResult = menus.client.login()
      loginResult
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
        })
    }
  }

  logout () {
    if (this.check()) {
      let logoutResult = menus.client.logout()
      logoutResult
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
  }
}

let menus = new Menus()

app.on('will-finish-launching', () => {
  app.dock.hide()
})

app.on('ready', () => {
  menus.init(appIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '状态', type: 'normal', enabled: false },
    {
      type: 'separator'
    },
    {
      label: '上线',
      type: 'normal',
      click: item => {
        menus.login()
      }
    },
    {
      label: '下线',
      type: 'normal',
      checked: true,
      click: item => {
        menus.logout()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '设置',
      type: 'normal',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: '清除登录信息',
      type: 'normal',
      click: () => {
        menus.clear()
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
  menus.setContextMenu(contextMenu)
})
