import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import path from "path";

export class VideoWindow {
    win = null;

    constructor() {
        this.win = this.getWinInstance()
    }

    getWinInstance() {
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
            frame: true,
        };
        const win = new BrowserWindow(config);
        win.webContents.openDevTools()
        win.loadURL(path.join(process.argv[2], '/pages/video/index.html'));
        return win;
    }

    sendToRender(msg) {
        this.win.webContents.send('video-info', msg)
    }

    destroyVideoWindow = () => {
        if (this.win) {
            this.win.close()
            this.win = null;
        }
    }

    addIpcListen() {
        ipcMain.once('video-cancel', () => {
            this.destroyVideoWindow()
        })
    }
}