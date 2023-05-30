import { app, BrowserWindow } from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
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