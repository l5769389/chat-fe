import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import path from "path";

export class VideoWindow {
    static instance = null;

    constructor() {
        if (!VideoWindow.instance) {
            VideoWindow.instance = this.getInstance()
        }
        return VideoWindow.instance
    }

    getInstance() {
        let config: BrowserWindowConstructorOptions = {
            width: 500,
            height: 700,
            minWidth: 800,
            minHeight: 700,
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
        return win;
    }

    destroyVideoWindow = () => {
        if (VideoWindow.instance) {
            VideoWindow.instance.forEach(item => {
                item.close()
            })
            VideoWindow.instance = null;
        }
    }

    addIpcListen() {
        ipcMain.once('video-cancel', () => {
            this.destroyVideoWindow()
        })
    }
}