import { app, BrowserWindow,ipcMain, desktopCapturer,screen,globalShortcut } from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import * as path from "path";
let mainWindow
let captureWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(() => {
    listenEvent()
    createMainWin()
    registerShortcut()
});

const createMainWin = () => {
    let config: BrowserWindowConstructorOptions = {
        width: 1000,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            contextIsolation: false,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
        },
    };
    mainWindow = new BrowserWindow(config);
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(process.argv[2]);
}
const registerShortcut = () => {
    globalShortcut.register('Ctrl+Alt+A',createCaptureWin)
    globalShortcut.register('Esc',destroyCaptureWindow)
}
const createCaptureWin = () => {
    let allDisplays = screen.getAllDisplays();
    const displayInfo = allDisplays.map(display => {
        return {
            id: display.id,
            width: display.bounds.width,
            height: display.bounds.height
        }
    })
    const {width,height} = displayInfo[0];
    captureWindow = new BrowserWindow({
        width,
        height,
        x:0,
        y:0,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            contextIsolation: false,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
        },
        // transparent:true,
        // frame: false,
        // skipTaskbar:true,
        // autoHideMenuBar: true,
        // movable: false,
        // resizable: false,
        // hasShadow: false
    });
    captureWindow.webContents.openDevTools()
    captureWindow.loadURL(path.join(process.argv[2],'/pages/capture/index.html'))
}
const destroyCaptureWindow = () => {
    if (captureWindow){
        captureWindow.close();
        captureWindow = null;
    }
}


const listenEvent = () => {
    ipcMain.on('capture', () => {
        createCaptureWin()
    })
}



