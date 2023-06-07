import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {MainEvent} from "./types";
import {SocketEvents} from "../common/types";

export class MainWindow {
    win = null;

    constructor() {
        this.win = this.getWinInstance()
    }

    getWinInstance() {
        let config: BrowserWindowConstructorOptions = {
            width: 800,
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
        this.addIpcListen()
        win.loadURL(process.argv[2]);

        return win;
    }

    destroy() {
        if (this.win) {
            this.win.close()
            this.win = null;
        }
    }

    addIpcListen() {
        ipcMain.on(MainEvent.window_pin, (event, args) => {
            this.win.setAlwaysOnTop(args)
        })
        ipcMain.on(MainEvent.window_minimize, () => {
            this.win.minimize()
        })
        ipcMain.on(MainEvent.window_full, () => {
            if (this.win.isMaximized()) {
                this.win.restore()
            } else {
                this.win.maximize()
            }
        })
        ipcMain.once(MainEvent.window_close, () => {
            this.destroy()
        })
    }

    sendToRender({
                     eventName = SocketEvents.from_socket_server_msg, msg
                 }) {
        console.log(`向ipcRender发出：${eventName},${JSON.stringify(msg)}`)
        this.win.webContents.send(eventName, msg)
    }
}