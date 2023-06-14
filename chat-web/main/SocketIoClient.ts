import io from "socket.io-client";
import {MainWindow} from "./pages/MainWindow";
import {ipcMain} from "electron";
import {Within_Main_Events} from "../common/types";
import {baseSocketIOURL} from "../common/config";

export class SocketIoClient {
    socket = null;
    mainWindow: MainWindow

    constructor(mainWindow) {
        this.socket = io(baseSocketIOURL, {
            autoConnect: false
        })
        this.mainWindow = mainWindow;
        this.listenInit()
    }

    connect() {
        this.socket.connect();
    }

    listenInit() {
        // connection
        ["connect", 'disconnect', 'singleMsg', 'multiMsg', 'joinRoom', 'connected', 'offer_invite'].forEach(eventName => {
            this.socket.on(eventName, (data) => {
                console.log(`socket client 收到消息:${eventName},${JSON.stringify(data)}`)
                // 发给主渲染进程
                this.mainWindow.sendToRender({
                    msg: {
                        eventName,
                        data: data
                    }
                })
            })
        });
        // 发给视频进程
        ['offer_invite', 'answer_invite', 'create_invite_room', 'video_room_message', 'video_room_change_msg'].forEach(eventName => {
            this.socket.on(eventName, (data) => {
                console.log(`socket client 收到消息:${eventName},${JSON.stringify(data)}`)
                ipcMain.emit(Within_Main_Events.transfer_main_msg, {
                    eventName,
                    data
                })
            })
        })
    }

    sendToSocketServer(msg) {
        const {type, data} = msg;
        console.log(`向socket server 发出:${JSON.stringify(msg)}`)
        this.socket.emit(type, data)
    }
}