import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import path from "path";
import {Between_Main_Render_Events} from "../../common/types";

export class VideoWindow {
    win = null;
    ready = false;

    constructor(windowType) {
        this.win = this.getWinInstance(windowType)
    }

    getWinInstance(windowType = 'video') {
        const initWidth = 500
        const initHeight = 500
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
        // win.setAspectRatio(aspectRatio)
        win.webContents.openDevTools()
        win.loadURL(path.join(process.argv[2], '/pages/video/index.html'));
        win.on('ready-to-show', () => {
            this.ready = true
        })
        return win;
    }

    sendToRender(msg) {
        // 解决发消息的时候如果窗口没有就绪的问题。
        if (this.ready) {
            console.log(`窗口已经就绪，向video_window 窗口发出`, msg)
            this.win.webContents.send(Between_Main_Render_Events.transfer_video_msg, msg)
        } else {
            this.win.on('ready-to-show', () => {
                this.ready = true
                console.log(`等待窗口就绪,向video_window 窗口发出`, msg)
                this.win.webContents.send(Between_Main_Render_Events.transfer_video_msg, msg)
            })
        }
    }

    destroy() {
        if (this.win) {
            this.win.close();
            this.win = null;
            this.ready = false;
        }
    }
}