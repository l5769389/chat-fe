/**
 * 渲染进程和socketIo之间的消息。
 */
export const Socket_Main_Render_Events = {
    // 开启socket连接
    start_connect: 'to_socket_server_start',
    disconnect: 'to_socket_server_disconnect',
    // 分发给聊天主界面的消息类型
    to_socket_server_msg: 'to_socket_server_msg',
    from_socket_server_msg: 'from_socket_server_msg',
}

export const Render_Render_Events = {
    video_info: 'video_info'
}

export enum Video_Info_Type {
    video = 'video',
    remote_desktop = 'remote_desktop'
}


// 只在electron main线程中的事件
export const Within_Main_Events = {
    transfer_main_msg: 'transfer_main_msg',
    operator_compute: 'operator_compute',
}


// 负责分发给视频页面的消息类型， 在主线程和渲染进程之间
export const Between_Main_Render_Events = {
    transfer_video_msg: 'transfer_video_msg',
    op_window: 'op_window', // 操作窗口 缩放、全屏等。
    render_to_main: 'render_to_main' // 想要通过主进程获取一些信息。比如屏幕尺寸等。
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

    static REMOTE_CONTROL = 'remote_control'
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

export type WindowOperateMsg = {
    // 类型是枚举的其中之一
    opType: keyof typeof MainEvent,
    window: 'main' | 'video',
    value?: boolean
}

