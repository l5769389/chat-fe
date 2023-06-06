import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import * as path from "path";
import {MainEvent, Shortcut} from "./types";
import {MainWindow} from "./MainWindow";
import {CaptureWindow} from "./CaptureWindow";
const io = require('socket.io-client');
const socket = io('http://localhost:3001');

// connection
socket.on("connect", () => {
    console.log(1234)
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});


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






