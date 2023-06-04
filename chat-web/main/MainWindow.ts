import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {MainEvent} from "./types";

export class MainWindow {
    static instance = null;

    constructor() {
        if (!MainWindow.instance) {
            MainWindow.instance = this.getInstance()
        }
        return MainWindow.instance
    }

    getInstance() {
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
        const instance = new BrowserWindow(config);
        instance.webContents.openDevTools()
        this.addIpcListen()
        instance.loadURL(process.argv[2]);
        return instance;
    }

    destroy() {
        if (MainWindow.instance) {
            MainWindow.instance.close()
            MainWindow.instance = null;
        }
    }
    addIpcListen(){
        ipcMain.on(MainEvent.window_pin, (event, args) => {
            MainWindow.instance.setAlwaysOnTop(args)
        })
        ipcMain.on(MainEvent.window_minimize, () => {
            MainWindow.instance.minimize()
        })
        ipcMain.on(MainEvent.window_full, () => {
            if (MainWindow.instance.isMaximized()){
                MainWindow.instance.restore()
            }else {
                MainWindow.instance.maximize()
            }
        })
        ipcMain.once(MainEvent.window_close, () => {
            this.destroy()
        })
    }
}