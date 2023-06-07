import {computed, inject, watch} from "vue";
import {useStore} from "vuex";
import {getFormatTime, buffer2base64, base642File} from "@/utils/utils.js";
import {SocketEvent, VIDEO_CLIENT_STATUS} from "@/config/config.js";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import rtcModalHook from "@/common/components/connectRtcDialog/rtcModalHook.js";
import {ipcRenderer} from "electron";
import {SocketEvents} from "../../../common/types.ts";

const getDialogInfoHook = function () {
    const store = useStore()
    const friends = computed(() => store.getters.friends)
    const currentDialogInfo = computed(() => store.getters.currentDialogInfo)
    const groupFriends = computed(() => store.getters.groupFriends)
    const currentDialogDetails = computed(() => store.getters.currentDialogDetails)
    const currentDialogUserInfo = computed(() => {
        if (currentDialogInfo.value.type === 'Single') {
            const friend = friends.value.find(item => item.userId == currentDialogInfo.value.id)
            return {
                userId: currentDialogInfo.value.id,
                avatar: friend?.avatar || '',
                nickname: friend?.nickname || '',
                chatType: 'Single',
            }
        } else if (currentDialogInfo.value.type === 'Multi') {
            const friend = groupFriends.value[currentDialogInfo.value.id]
            return {
                chatId: currentDialogInfo.value.id,
                joinIds: currentDialogInfo?.joinIds,
                avatar: friend?.avatar || '',
                nickname: friend?.name || '',
                chatType: 'Multi',
            }
        }
    })
    return {
        currentDialogInfo,
        currentDialogUserInfo,
        currentDialogDetails,
    }
}


const sockInitHook = function () {
    const {} = rtcModalHook();
    const {showVideoModal, setInviteVideoInfo} = modalVideoHooks()
    const socket = inject("socket");
    const store = useStore();
    const isLogin = computed(() => store.getters.isLogin);
    const user = computed(() => store.getters.user);
    const currentDialogInfo = computed(() => store.getters.currentDialogInfo);
    watch(
        () => isLogin.value,
        (newVal, oldValue) => {
            if (newVal) {
                initSocket();
            } else {
                socket.disconnect();
            }
        }
    );

    const msgHandler = (data, eventName) => {
        let {fromUserId, msg: {type, content, timestamp}, chatId, joinUserIds: joinIds} = data;
        console.log(`收到消息:类型为：${eventName},内容为：${JSON.stringify(data)}`)
        if (type === 'img') {
            let image = buffer2base64(content)
            const file = base642File(image)
            content = window.URL.createObjectURL(file)
        }
        // 当前窗口就在与该用户的会话窗口
        if (currentDialogInfo.value.id != chatId) {
            store.commit("addUnreadMsgMap", {
                userId: fromUserId,
                chatId: chatId,
                content: {
                    type: type,
                    content: content,
                    timestamp: getFormatTime(timestamp),
                },
                type: type,
                source: "other",
                messageId: new Date().getTime(),
            });
        }
        if (eventName === 'Single') {
            store.commit('updateChatList', {
                type: 'Single',
                id: chatId,
            })
        } else if (eventName === 'Multi') {
            updateChatlist(data)
            store.commit('updateChatList', {
                type: 'Multi',
                id: chatId,
                joinIds: joinIds
            })
        }
        store.commit("addTotalMsgMap", {
            chatId: chatId,
            userId: fromUserId,
            type: type,
            content: content,
            timestamp: getFormatTime(timestamp),
            messageId: timestamp,
            source: "other",
        });
    }
    const handleConnect = () => {
        store.commit("setSocketStatus", "connect");
        console.log(
            `当前用户的userId为:${user.value.userId},socketId为：${socket.id}`
        );
        sendIpcMsg({
            msg: {
                type: SocketEvent.CONNECTED,
                data: {
                    userId: user.value.userId,
                }
            }
        })
    }
    const handleDisconnect = () => {
        store.commit("setSocketStatus", "disconnect");
    }
    const handleConnectError = () => {
        store.commit("setSocketStatus", "connect_error");
    }
    const handleJoinRoom = (data) => {
        updateChatlist(data)
    }
    const handleSingleMsg = (data) => {
        msgHandler(data, 'Single')
    }
    const handleMultiMsg = data => {
        msgHandler(data, 'Multi')
    }
    const handleCreateInviteRoom = data => {
        console.log(`房间roomId:${data}`)
        setInviteVideoInfo({
            videoRoomId: data,
        })
    }

    const handleOfferInvite = data => {
        const {fromUserId, msg: {roomId}} = data;
        setInviteVideoInfo({
            videoRoomId: roomId,
            oppositeUserId: fromUserId,
            userId: user.value.userId
        })
        console.log(`收到服务器事件：${SocketEvent.OFFER_INVITE}`)
        store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.BEINVITING)
        showVideoModal();
    }

    const EventMap = {
        'connect': handleConnect,
        'disconnect': handleDisconnect,
        'connect_error': handleConnectError,
        [SocketEvent.CHAT_JOIN_ROOM]: handleJoinRoom,
        [SocketEvent.CHAT_MSG_SINGLE]: handleSingleMsg,
        [SocketEvent.CHAT_MSG_MULTI]: handleMultiMsg,
        [SocketEvent.CREATE_INVITE_ROOM]: handleCreateInviteRoom,
        [SocketEvent.OFFER_INVITE]: handleOfferInvite
    }


    const initSocket = () => {
        ipcRenderer.on(SocketEvents.from_socket_server_msg, (event, args) => {
            console.log(args);
            const {eventName, data} = args;
            const handler = EventMap[eventName]
            handler(data)
        })
        sendIpcMsg({type: SocketEvents.start_connect})
    };

    const updateChatlist = (data) => {
        const {chatId: roomId, joinUserIds: joinIds, chatRoomName, fromUserId} = data;
        console.log(SocketEvent.CHAT_JOIN_ROOM, JSON.stringify(data))
        store.commit('updateChatList', {
            type: 'Multi',
            id: roomId,
            joinIds,
            chatRoomName
        })
        store.dispatch('getUnfriendInfo', joinIds)
    }
}

const sendIpcMsg = ({type = SocketEvents.to_socket_server_msg, msg}) => {
    ipcRenderer.send(type, msg)
}


export {
    getDialogInfoHook,
    sockInitHook,
    sendIpcMsg
}