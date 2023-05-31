import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import * as path from "path";

let mainWindow
let captureWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(() => {
    listenEvent()
    createMainWin()
    registerShortcut()
});

const createMainWin = () => {

    let config: BrowserWindowConstructorOptions = {
        width: 1000,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            contextIsolation: false,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
        },
    };
    let extensionPath = path.resolve('C:\\Users\\57693\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\6.5.0_0')
    BrowserWindow.addDevToolsExtension(extensionPath)
    mainWindow = new BrowserWindow(config);

    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(process.argv[2]);
}
const registerShortcut = () => {
    globalShortcut.register('Ctrl+Alt+A', createCaptureWin)
    globalShortcut.register('Esc', destroyCaptureWindow)
}
const createCaptureWin = () => {
    if (captureWindow) {
        return;
    }
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
    captureWindow = new BrowserWindow({
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
    captureWindow.webContents.openDevTools()
    captureWindow.loadURL(path.join(process.argv[2], '/pages/capture/index.html'))
        .then(() => {
            getCapturerImg(width,height,scaleFactor)
        })

}
const destroyCaptureWindow = () => {
    if (captureWindow) {
        captureWindow.close();
        captureWindow = null;
    }
}


const listenEvent = () => {
    ipcMain.on('capture', () => {
        createCaptureWin()
    })
}

const getCapturerImg = (width,height,scaleFactor) => {
    desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
            width: width * scaleFactor,
            height: height * scaleFactor,
        }
    }).then(async sources => {
        captureWindow.webContents.send('capture', sources[0].thumbnail.toDataURL())
    })
}





