const electron = require('electron')
const _http = require('http')

const { app, BrowserWindow } = electron
const testString = 'hello dxy'

let win

function createWindow () {
  // 创建窗口
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // 加载index.html
  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS上没有任何窗口打开时要新开一个window
  if (win === null) {
    createWindow()
  }
})
