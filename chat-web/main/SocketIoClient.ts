import io from "socket.io-client";
import {MainWindow} from "./pages/MainWindow";

export class SocketIoClient {
    socket = null;
    mainWindow: MainWindow

    constructor(mainWindow) {
        this.socket = io('http://localhost:3001', {
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
        ["connect", 'disconnect', 'singleMsg', 'multiMsg', 'joinRoom', 'connected',
            'offer_invite', 'answer_invite', 'create_invite_room', 'video_room_message', 'video_room_change_msg'].forEach(eventName => {
            this.socket.on(eventName, (data) => {
                console.log(`socket client 收到消息:${JSON.stringify(data)}`)
                this.mainWindow.sendToRender({
                    msg: {
                        eventName,
                        data: data
                    }
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