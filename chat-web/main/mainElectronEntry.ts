import {app, ipcMain, globalShortcut, session, BrowserWindow} from "electron";
import * as path from "path";
import {Main_Between_Events, MainEvent, Shortcut} from "../common/types";
import {MainWindow} from "./pages/MainWindow";
import {CaptureWindow} from "./pages/CaptureWindow";
import {SocketIoClient} from "./SocketIoClient";
import {Socket_Main_Render_Events} from "../common/types";
import {VideoWindow} from "./pages/VideoWindow";

const vueDevToolsPath = path.resolve(__dirname, '../extension/vue-devtools')
let mainWindow: MainWindow
let captureWindow
let socketIoClient
let videoWindow: VideoWindow
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
const createVideoPage = () => {
    videoWindow = new VideoWindow();
}
/**
 * socket.io开启连接
 */
ipcMain.on(Socket_Main_Render_Events.start_connect, () => {
    socketIoClient.connect()
})

/**
 * 收到render发送给别的用户的消息
 */
ipcMain.on(Socket_Main_Render_Events.to_socket_server_msg, (event, args) => {
    console.log('ipcMain收到', args)
    socketIoClient.sendToSocketServer(args)
})

/**
 * 用于转发 socket.io发来的 视频消息给 video 页面。
 */
ipcMain.on(Main_Between_Events.to_video_msg, (event, args) => {
    sendMsgToVideoWindow(args)
})

const sendMsgToVideoWindow = (msg) => {
    if (!videoWindow) {
        createVideoPage();
    }
    videoWindow.sendToRender(msg)
}

/**
 * 截屏
 */
ipcMain.on(MainEvent.capture, () => {
    createCaptureWin()
})

/**
 *  render发来的视频请求
 */
ipcMain.on(MainEvent.open_video_page, (event, args) => {
    sendMsgToVideoWindow(args)
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






