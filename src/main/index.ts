import * as path from 'path'
import { Login } from "../api/auto"
import { app, shell, ipcMain, Notification, Tray, BrowserWindow } from 'electron'
import { electronApp, optimizer, devTools, is } from '@electron-toolkit/utils'

let win;
let icon;
let tray;
let store;

const Store = require('electron-store');
Store.initRenderer();
store = new Store();

async function ipcLogin(account, password, ISP) {
  let result = await Login(account, password, ISP);

  new Notification({
    body: result[1] as string,
    title: result[0] === 0 ? '连接成功' : '连接失败',
    icon: icon
  }).show();

  return result;
}

function createWindow(): void {
  // Create the browser window.
  win = new BrowserWindow({
    width: 720,
    height: 512,
    show: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
        icon: path.join(__dirname, '../../build/icon.png')
      }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: false,
      nodeIntegration: true,
      sandbox: false,
    },
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the show URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  if (is.dev) {
    // 测试环境
    icon = path.join(__dirname, '../../build/icon.png')
  } else {
    // 正式环境
    icon = path.join(path.dirname(app.getPath('exe')), '/resources/icon.png')
  }


  tray = new Tray(icon)

  tray.setToolTip('AuNet')

  tray.on('double-click', () => {
    // 双击通知区图标实现应用的显示或隐藏
    win.isVisible() ? win.hide() : win.show()
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
  });


}

// 限制只可以打开一个应用, 4.x的文档
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
      win.show()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app show model id for windows
  electronApp.setAppUserModelId('com.electron')
  app.commandLine.appendSwitch('wm-window-animations-disabled')
  devTools.install('REACT_DEVELOPER_TOOLS', { allowFileAccess: true })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

}).then(async () => {
  let user;
  try {
    user = JSON.parse(store.get('setup'))?.network?.card || {
      ISP: '0',
      account: '',
      password: ''
    };
  } catch {
    user = {
      ISP: '0',
      account: '',
      password: ''
    }
  }

  if(
    (user.ISP == 0 || user.ISP == 1 || user.ISP == 2) &&
    (user.account.length > 8 && user.account.length < 12) &&
    (user.password.length > 7 && user.password.length < 21)
  ) {
    await ipcLogin(user.account, user.password, user.ISP)
  }
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the show quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('close', () => {
  app.quit()
})


ipcMain.on('minimize',() => {
  win.hide()
})

// @ts-ignore
ipcMain.on('connect',async (e, args) => {
  const { account = '', password = '', ISP = '' } = args;
  ipcLogin(account, password, ISP).then((res) => {
    e.sender.send('renderer-connect', res)
  });
})

// 获取可执行文件位置
const ex = process.execPath;

// 开启 开机自启动
ipcMain.on('openAutoStart',()=>{
  app.setLoginItemSettings({
    openAtLogin: true,
    path: ex,
    args: []
  });
});

// 关闭 开机自启动
ipcMain.on('closeAutoStart',()=>{
  app.setLoginItemSettings({
    openAtLogin: false,
    path: ex,
    args: []
  });
})
