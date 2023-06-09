export const Socket_Main_Render_Events = {
    // 开启socket连接
    start_connect: 'to_socket_server_start',

    // 分发给聊天主界面的消息类型
    to_socket_server_msg: 'to_socket_server_msg',
    from_socket_server_msg: 'from_socket_server_msg',
}

export const Within_Main_Events = {
    transfer_main_msg: 'transfer_main_msg'
}


// 负责分发给视频页面的消息类型
export const Between_Main_Render_Events = {
    transfer_video_msg: 'transfer_video_msg',
}


export class SocketEvent {
    // 聊天相关的事件
    static CHAT_MSG_SINGLE = 'singleMsg'
    static CHAT_MSG_MULTI = 'multiMsg'
    static CHAT_JOIN_ROOM = 'joinRoom'
    // 用户连接状态
    static CONNECTED = 'connected'
    // 音视频相关的事件
    static OFFER_INVITE = 'offer_invite'
    static ANSWER_INVITE = 'answer_invite'
    static CREATE_INVITE_ROOM = 'create_invite_room'
    static VIDEO_ROOM_MSG = 'video_room_message'
    static VIDEO_ROOM_CHANGE_MSG = 'video_room_change_msg' //关闭，切换语音、视频等
}

// 当前视频窗口的状态
export class VIDEO_CLIENT_STATUS {
    static IDLE = 'idle'
    static INVITING = 'inviting' //用户点击发起视频后处于该状态
    static BEINVITING = 'beInviting' // 用户选择接受、拒绝视频邀请的状态
    static BEINVITED = 'beInvited'  // 选择接受，进入该状态， 拒绝的话返回IDLE状态
    static CONNECTING = 'connecting' // 选择接受，连接中，
    static CONNECTED = 'connected'   // 视频连接成功
}

// 快捷键
export enum Shortcut {
    capture = 'Ctrl+Alt+A',
    esc = 'Esc'
}

// ipcRender与ipcMain的事件，无需转发给socketIo
export enum MainEvent {
    capture = 'capture',
    open_video_page = 'open_video_page',
    window_pin = 'window_pin',
    window_minimize = 'window_minimize',
    window_full = 'window_full',
    window_close = 'window_close',
}