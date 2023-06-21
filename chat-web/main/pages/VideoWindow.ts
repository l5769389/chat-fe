import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import path from "path";
import {Between_Main_Render_Events} from "../../common/types";

export class VideoWindow {
    static win = null;
    static ready = false;

    constructor(windowType, aspectRatio) {
        if (!VideoWindow.win) {
            VideoWindow.win = this.getWinInstance(windowType, aspectRatio)
            this.addListen()
        }
    }

    getWinInstance(windowType = 'video', aspectRatio = 1) {
        const initWidth = windowType === 'video' ? 700 : 500
        const initHeight = initWidth * aspectRatio
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
        console.log(`设置窗口的aspect为${aspectRatio}`)
        win.setAspectRatio(aspectRatio)
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

    static destroy() {
        if (VideoWindow.win) {
            VideoWindow.win.close();
            VideoWindow.win = null;
            VideoWindow.ready = false;
        }
    }

    addListen() {
        VideoWindow.win.once('closed', () => {
            console.log('closed')
            VideoWindow.destroy()
        })
    }
}