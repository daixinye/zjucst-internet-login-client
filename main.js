const { app, Menu, Tray, Notification } = require('electron')
const _path = require('path')

const setting = require('./src/setting')
const Client = require('./src/client')

const Store = require('electron-store')
const store = new Store()

// app
class Menus {
  constructor (imgPath) {
    this.tray = null
    this.contextMenu = null
    this.client = null
  }
  init (imgPath) {
    this.tray = new Tray(imgPath)
    this.tray.setToolTip('zjucst-internet-login')

    this.clear()

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
      subtitle: '悬停此处，输入账号和密码，用英文分号（:）隔开',
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
    store.delete('username')
    store.delete('password')
  }
}

let menus = new Menus()

app.on('ready', () => {
  menus.init(_path.join(__dirname, setting.relative_path.icon))
  const contextMenu = Menu.buildFromTemplate([
    { label: '状态', type: 'normal', enabled: false },
    {
      type: 'separator'
    },
    {
      label: '上线',
      type: 'normal',
      click: item => {
        if (menus.check()) menus.client.login()
      }
    },
    {
      label: '下线',
      type: 'normal',
      checked: true,
      click: item => {
        if (menus.check()) menus.client.logout()
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
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])
  menus.setContextMenu(contextMenu)
})
