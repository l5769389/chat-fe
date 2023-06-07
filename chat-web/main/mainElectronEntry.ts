import {app, ipcMain, globalShortcut, session, BrowserWindow} from "electron";
import * as path from "path";
import {MainEvent, Shortcut} from "./types";
import {MainWindow} from "./MainWindow";
import {CaptureWindow} from "./CaptureWindow";
import {SocketIoClient} from "./SocketIoClient";
import {SocketEvents} from "../common/types";

const vueDevToolsPath = path.resolve(__dirname, '../extension/vue-devtools')
let mainWindow: MainWindow
let captureWindow
let socketIoClient
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(async () => {
    await loadVueTools()
    createMainWin()
    registerSocketIo()
    registerShortcut()
});

const registerSocketIo = () => {
    socketIoClient = new SocketIoClient(mainWindow)
}
ipcMain.on(SocketEvents.start_connect, () => {
    socketIoClient.connect()
})

ipcMain.on(SocketEvents.to_socket_server_msg, (event, args) => {
    console.log('ipcMain收到', args)
    socketIoClient.sendToSocketServer(args)
})

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






