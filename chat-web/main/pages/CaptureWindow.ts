import path from "path";
import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import {Shortcut} from "../../common/types";

export class CaptureWindow {
    static instance = null;

    constructor() {
        if (!CaptureWindow.instance) {
            CaptureWindow.instance = this.getInstance()
        }
        return CaptureWindow.instance
    }

    getInstance() {
        let allDisplays = screen.getAllDisplays();
        const displays = allDisplays.map(display => {
            return {
                id: display.id,
                width: display.bounds.width,
                height: display.bounds.height,
                scaleFactor: display.scaleFactor,
                x: display.bounds.x,
                y: display.bounds.y
            }
        })
        const captureWindows = displays.map(display => {
            const {id, width, height, scaleFactor, x, y} = display
            const captureWindow = new BrowserWindow({
                width,
                height,
                x,
                y,
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
            captureWindow.webContents.openDevTools()
            captureWindow.loadURL(path.join(process.argv[2], '/pages/capture/index.html'))
                .then(() => {
                    this.getCapturerImg(captureWindow, id, width, height, scaleFactor)
                })
            return captureWindow;
        })
        this.addIpcListen()
        return captureWindows
    }

    getCapturerImg = (captureWindow, display_id, width, height, scaleFactor) => {
        desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: width * scaleFactor,
                height: height * scaleFactor,
            }
        }).then(async sources => {
            const source = sources.filter(source => source.display_id === display_id.toString())
            captureWindow.webContents.send('capture', {
                img: source[0].thumbnail.toDataURL(),
                scaleFactor: scaleFactor
            })
        })
    }

    destroyCaptureWindow = () => {
        if (CaptureWindow.instance) {
            CaptureWindow.instance.forEach(item => {
                item.close()
            })
            CaptureWindow.instance = null;
        }
    }

    addIpcListen() {
        ipcMain.once('capture-cancel', () => {
            this.destroyCaptureWindow()
        })
        globalShortcut.register(Shortcut.esc, this.destroyCaptureWindow)
    }
}