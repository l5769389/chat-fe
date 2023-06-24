import {app, desktopCapturer, globalShortcut, ipcMain, screen, session} from 'electron';
import * as path from "path";
import {
    Between_Main_Render_Events,
    MainEvent,
    Shortcut,
    Socket_Main_Render_Events,
    WindowOperateMsg,
    Within_Main_Events
} from "../common/types";
import {MainWindow} from "./pages/MainWindow";
import {CaptureWindow} from "./pages/CaptureWindow";
import {SocketIoClient} from "./SocketIoClient";
import {VideoWindow} from "./pages/VideoWindow";

const robot = require('robotjs')

const vueDevToolsPath = path.resolve(__dirname, '../extension/vue-devtools')
let mainWindow: MainWindow
let captureWindow
let socketIoClient: SocketIoClient
let videoWindow: VideoWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(async () => {
    await loadVueTools()
    createMainWin()
    registerSocketIo()
    registerShortcut()
    addIpcListen()
});


const registerSocketIo = () => {
    socketIoClient = new SocketIoClient(mainWindow)
}
const createVideoPage = (windowType) => {
    videoWindow = new VideoWindow(windowType);
}
/**
 * socket.io开启连接
 */
ipcMain.on(Socket_Main_Render_Events.start_connect, () => {
    console.log('ipcMain 收到渲染进程的：连接socketIo服务器请求')
    socketIoClient.connect()
})

ipcMain.on(Socket_Main_Render_Events.disconnect, () => {
    console.log('ipcMain 收到渲染进程的：断开socketIo服务器请求')
    socketIoClient.disconnect()
})

/**
 * 收到render发送给别的用户的消息
 */
ipcMain.on(Socket_Main_Render_Events.to_socket_server_msg, (event, args) => {
    // console.log('ipcMain收到', args)
    socketIoClient.sendToSocketServer(args)
})

/**
 * 用于转发 socket.io发来的 视频消息给 video 页面。
 */
ipcMain.on(Between_Main_Render_Events.transfer_video_msg, (event, args) => {
    console.log(`收到：${Between_Main_Render_Events.transfer_video_msg},${args}`)
    sendMsgToVideoWindow(args)
})

ipcMain.on(Within_Main_Events.transfer_main_msg, (data: any) => {
    console.log(`收到：${Within_Main_Events.transfer_main_msg},${JSON.stringify(data)}`)
    const {eventName} = data;
    if (eventName === 'offer_invite') {
        sendMsgToVideoWindow(data, 'remote_control')
    } else if (eventName === 'answer_invite') {
        const {screenInfo} = data.data;
        const aspectRatio = Number.parseFloat((screenInfo.width / screenInfo.height).toFixed(2))
        const total_height = 500;
        const video_height = 500 - 20;
        videoWindow.win.setSize(video_height * aspectRatio, total_height)
        const new_aspect = Number.parseFloat((video_height * aspectRatio / total_height).toFixed(4))
        console.log(new_aspect)
        videoWindow.win.setAspectRatio(new_aspect)
        sendMsgToVideoWindow(data, 'video')
    } else {
        sendMsgToVideoWindow(data, 'video')
    }
})

ipcMain.on('desk', data => {
    desktopCapturer.getSources({types: ['window', 'screen']}).then(async sources => {
        for (const source of sources) {
            console.log(source)
        }
    })
})

ipcMain.on(Within_Main_Events.operator_compute, (data: any) => {
    const {clientX, clientY, type, key} = data.data;
    key as string;
    if (type === 'mousemove') {
        robot.moveMouse(clientX, clientY)
    } else if (type === 'mousedown') {
        console.log('down')
        robot.mouseToggle('down')
    } else if (type === 'mouseup') {
        console.log('up')
        robot.mouseToggle('up')
    } else if (type === 'dragMouse') {
        console.log('drag')
        robot.dragMouse(clientX, clientY)
    } else if (type === 'click') {
        robot.mouseClick()
    } else if (type === 'keydown') {
        console.log(`tap: ${key}`)
        let tapkey = '';
        if (key.length === 1) {
            tapkey = key;
        } else {
            tapkey = key.toLocaleLowerCase()
        }
        try {
            robot.keyTap(tapkey)
        } catch (e) {
            console.log(`${tapkey} is error`)
            console.log(e)
        }
    }
})


const sendMsgToVideoWindow = (msg, windowType = 'video') => {
    if (!videoWindow?.win) {
        createVideoPage(windowType);
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
        console.log('加载vue devtools')
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


const addIpcListen = () => {
    ipcMain.on(Between_Main_Render_Events.op_window, (event, data: WindowOperateMsg) => {
        const {opType, window, value} = data;
        console.log(opType, window, value)
        let win = window === 'main' ? mainWindow : videoWindow
        switch (opType) {
            case MainEvent.window_pin:
                win.win.setAlwaysOnTop(value)
                break;
            case MainEvent.window_minimize:
                win.win.minimize()
                break;
            case MainEvent.window_full:
                if (win.win.isMaximized()) {
                    win.win.restore()
                } else {
                    win.win.maximize()
                }
                break;
            case MainEvent.window_close:
                win.destroy()
                win = null;
                break;
            default:
                break;
        }
    })
}

ipcMain.handle(Between_Main_Render_Events.render_to_main, (e, type) => {
    return getScreenInfo();
})


const getScreenInfo = () => {
    let display = screen.getAllDisplays()[0];
    return {
        width: display.bounds.width,
        height: display.bounds.height,
        scaleFactor: display.scaleFactor,
    };
}
