import {app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut, session} from "electron";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import * as path from "path";
const vueDevToolsPath = path.resolve(__dirname, '../extension/vue-devtools')
let mainWindow
let captureWindow
// 关闭 electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.whenReady().then(async () => {
    await loadVueTools()
    listenEvent()
    createMainWin()
    registerShortcut()
});

const loadVueTools =async () => {
    if (process.env.NODE_ENV === 'development') {
        await session.defaultSession.loadExtension(vueDevToolsPath)
    }
}

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
    console.log({width, height,scaleFactor})
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





