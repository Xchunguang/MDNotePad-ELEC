import { app, BrowserWindow, Menu } from 'electron';
import { initMessage } from './src/main/components/Message';
import Status from './src/main/components/Status';

let mainWindow: BrowserWindow = null;
let status: Status = null;
let createWindow = function() {
    Menu.setApplicationMenu(null)
    mainWindow = new BrowserWindow({
      width:800, 
      height:700, 
      icon: './app.ico',
      webPreferences: {
        nodeIntegration: true
      }
    })
    mainWindow.loadFile('./render/pages/index.html')
    // mainWindow.webContents.openDevTools()

    status = new Status();
    initMessage(status, mainWindow);
}

app.on('ready', createWindow);
app.on('window-all-closed', ()=>{
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', ()=>{
   if (mainWindow === null) {
        createWindow()
    }
})
// 禁止窗口弹出动画
app.commandLine.appendSwitch('wm-window-animations-disabled');