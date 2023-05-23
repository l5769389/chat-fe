export class SocketEvent {
    // 聊天相关的事件
    static CHAT_MSG_SINGLE = 'singleMsg'
    static  CHAT_MSG_MULTI = 'multiMsg'
    static CHAT_JOIN_ROOM = 'joinRoom'
    // 用户连接状态
    static  CONNECTED = 'connected'
    // 音视频相关的事件
    static  OFFER_INVITE = 'offer_invite'
    static  ANSWER_INVITE = 'answer_invite'
    static CREATE_INVITE_ROOM = 'create_invite_room'
    static  VIDEO_ROOM_MSG = 'video_room_message'
    static  VIDEO_ROOM_CHANGE_MSG = 'video_room_change_msg' //关闭，切换语音、视频等
}


// 当前视频窗口的状态
export class VIDEO_CLIENT_STATUS {
    static IDLE = 'idle'
    static INVITING = 'inviting'
    static BEINVITING = 'beInviting'
    static BEINVITED = 'beInvited'
    static CONNECTING = 'connecting'
    static CONNECTED = 'connected'
}
