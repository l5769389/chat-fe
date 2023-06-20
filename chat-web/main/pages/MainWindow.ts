import {BrowserWindow, ipcMain,} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {Socket_Main_Render_Events, MainEvent} from "../../common/types";

export class MainWindow {
    win = null;

    constructor() {
        this.win = this.getWinInstance()
    }

    getWinInstance() {
        const pid = this.getAppPid()
        let config: BrowserWindowConstructorOptions = {
            width: 1200,
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
                // partition: `${pid}`,
            },
            frame: false,
        };
        const win = new BrowserWindow(config);
        win.webContents.openDevTools()
        win.loadURL(process.argv[2]);
        return win;
    }

    destroy() {
        if (this.win) {
            this.win.close()
            this.win = null;
        }
    }

    sendToRender({
                     eventName = Socket_Main_Render_Events.from_socket_server_msg, msg
                 }) {
        console.log(`向ipcRender发出：${eventName},${JSON.stringify(msg)}`)
        this.win.webContents.send(eventName, msg)
    }

    getAppPid() {
        return process.pid
    }
}