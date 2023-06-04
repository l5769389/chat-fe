import path from "path";
import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import {Shortcut} from "./types";

export class CaptureWindow{
    static instance = null;
    constructor() {
        if (!CaptureWindow.instance) {
            CaptureWindow.instance =  this.getInstance()
        }
        return CaptureWindow.instance
    }

    getInstance(){
        let allDisplays = screen.getAllDisplays();
        const displayInfo = allDisplays.map(display => {
            return {
                id: display.id,
                width: display.bounds.width,
                height: display.bounds.height,
                scaleFactor: display.scaleFactor
            }
        })
        const {width, height,scaleFactor} = displayInfo[0];
        console.log(width,height,scaleFactor)
        const instance = new BrowserWindow({
            width,
            height,
            x: 0,
            y: 0,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                allowRunningInsecureContent: true,
                contextIsolation: false,
                webviewTag: true,
                spellcheck: false,
                disableHtmlFullscreenWindowResize: true,
            },
            transparent: true,
            frame: false,
            skipTaskbar: true,
            autoHideMenuBar: true,
            movable: false,
            resizable: false,
            hasShadow: false
        });
        instance.webContents.openDevTools()
        this.addIpcListen()
        instance.loadURL(path.join(process.argv[2], '/pages/capture/index.html'))
            .then(() => {
                this.getCapturerImg(width,height,scaleFactor)
            })
        return instance;
    }

    getCapturerImg = (width,height,scaleFactor) => {
        desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: width * scaleFactor,
                height: height * scaleFactor,
            }
        }).then(async sources => {
            CaptureWindow.instance.webContents.send('capture', sources[0].thumbnail.toDataURL())
        })
    }

    destroyCaptureWindow = () => {
        if (CaptureWindow.instance) {
            CaptureWindow.instance.close();
            CaptureWindow.instance = null;
        }
    }
    
    addIpcListen(){
        ipcMain.once('capture-cancel', () => {
            this.destroyCaptureWindow()
        })
        globalShortcut.register(Shortcut.esc, this.destroyCaptureWindow)
    }
}