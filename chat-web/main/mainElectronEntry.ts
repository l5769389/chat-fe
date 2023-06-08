import {app, ipcMain, globalShortcut, session, BrowserWindow} from "electron";
import * as path from "path";
import {MainEvent, Shortcut} from "./types";
import {MainWindow} from "./pages/MainWindow";
import {CaptureWindow} from "./pages/CaptureWindow";
import {SocketIoClient} from "./SocketIoClient";
import {Socket_Main_Render_Events} from "../common/types";
import {VideoWindow} from "./pages/VideoWindow";

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
ipcMain.on(Socket_Main_Render_Events.start_connect, () => {
    socketIoClient.connect()
})

ipcMain.on(Socket_Main_Render_Events.to_socket_server_msg, (event, args) => {
    console.log('ipcMain收到', args)
    socketIoClient.sendToSocketServer(args)
})

ipcMain.on(MainEvent.capture, () => {
    createCaptureWin()
})

ipcMain.on(MainEvent.open_video_page,() => {
    createVideoPage()
})

const createVideoPage = () => {
    const videoPage = new VideoWindow();
}



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






