import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import path from "path";
import {Between_Main_Render_Events} from "../../common/types";

export class VideoWindow {
    static win = null;
    static ready = false;

    constructor(windowType) {
        if (!VideoWindow.win) {
            VideoWindow.win = this.getWinInstance(windowType)
            this.addListen()
        }
    }

    getWinInstance(windowType = 'video') {
        const initWidth = windowType === 'video' ? 500 : 200
        const initHeight = windowType === 'video' ? 700 : 400
        let config: BrowserWindowConstructorOptions = {
            width: initWidth,
            height: initHeight,
            minWidth: initWidth,
            minHeight: initHeight,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                allowRunningInsecureContent: true,
                contextIsolation: false,
                webviewTag: true,
                spellcheck: false,
                disableHtmlFullscreenWindowResize: true,
            },
            frame: false,
        };
        const win = new BrowserWindow(config);
        win.webContents.openDevTools()
        win.loadURL(path.join(process.argv[2], '/pages/video/index.html'));
        win.on('ready-to-show', () => {
            VideoWindow.ready = true
        })
        return win;
    }

    sendToRender(msg) {
        // 解决发消息的时候如果窗口没有就绪的问题。
        if (VideoWindow.ready) {
            console.log(`窗口已经就绪，向video_window 窗口发出`, msg)
            VideoWindow.win.webContents.send(Between_Main_Render_Events.transfer_video_msg, msg)
        } else {
            VideoWindow.win.on('ready-to-show', () => {
                VideoWindow.ready = true
                console.log(`等待窗口就绪,向video_window 窗口发出`, msg)
                VideoWindow.win.webContents.send(Between_Main_Render_Events.transfer_video_msg, msg)
            })
        }
    }

    destroyVideoWindow = () => {
        if (VideoWindow.win) {
            VideoWindow.win = null;
            VideoWindow.ready = false;
        }
    }

    addListen() {
        VideoWindow.win.once('closed', () => {
            console.log('closed')
            this.destroyVideoWindow()
        })
    }
}