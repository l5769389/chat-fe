import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import * as path from "path";
import {MainEvent, Shortcut} from "./types";
import {MainWindow} from "./MainWindow";
import {CaptureWindow} from "./CaptureWindow";

const vueDevToolsPath = path.resolve(__dirname, '../extension/vue-devtools')
let mainWindow
let captureWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(async () => {
    await loadVueTools()
    createMainWin()
    registerShortcut()
});
ipcMain.on(MainEvent.capture, () => {
    createCaptureWin()
})
const loadVueTools = async () => {
    if (process.env.NODE_ENV === 'development') {
        await session.defaultSession.loadExtension(vueDevToolsPath)
    }
}

const createMainWin = () => {
    mainWindow = new MainWindow()
}

const createCaptureWin = () => {
    captureWindow = new CaptureWindow()
}

const registerShortcut = () => {
    globalShortcut.register(Shortcut.capture, createCaptureWin)
}






