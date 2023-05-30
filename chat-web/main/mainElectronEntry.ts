import { app, BrowserWindow,ipcMain, desktopCapturer,screen } from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import * as path from "path";
let mainWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
// 警告

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(() => {
    let config: BrowserWindowConstructorOptions = {
        fullscreen:true,
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
    mainWindow.loadURL(process.argv[2]);
});

const createCaptureWin = ({width,height}) => {
    let captureWindow = new BrowserWindow({
        width,
        height,
        x:0,
        y:0,
        transparent:true,
        frame: false,
        skipTaskbar:true,
        autoHideMenuBar: true,
        movable: false,
        resizable: false,
        hasShadow: false
    });
    captureWindow.loadURL(path.join(__dirname,'/capture.html'))
}

ipcMain.on('capture', () => {
    let allDisplays = screen.getAllDisplays();
   const displayInfo = allDisplays.map(display => {
        return {
            id: display.id,
            width: display.bounds.width,
            height: display.bounds.height
        }
    })
    createCaptureWin(displayInfo[0])
})



