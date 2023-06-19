import {ref} from "vue";
import {Socket_Main_Render_Events, SocketEvent, VIDEO_CLIENT_STATUS, Video_Info_Type} from "/common/types.ts";
import {ipcRenderer} from "electron";
import {RemoteDesktopRole} from "@video/types/types.ts";

// 自己的信息和对方的信息。
const userInfo = reactive({
    user: {},
    oppositeUser: {}
})



const videoInfoTypeRef = ref(Video_Info_Type.video)
const remoteDesktopRoleRef = ref(RemoteDesktopRole.Positive)

const invite_info = ref({
    videoRoomId: '',
    oppositeUserId: '',
    userId: '',
})

const videoOrAudioRef = ref(true)
const muteRef = ref(false)

const videoStatus = ref(VIDEO_CLIENT_STATUS.IDLE)
export default function () {
    const setUser = ({user, oppositeUser}) => {
        if (user) {
            userInfo.user = user;
            setInviteInfo({
                userId: user.userId
            })
        }
        if (oppositeUser) {
            userInfo.oppositeUser = oppositeUser;
        }
    }

    const setInviteInfo = (info) => {
        Object.assign(invite_info.value, info)
    }

    const setVideoStatus = (status) => {
        videoStatus.value = status
    }

    const sendIpcMsg = (data) => {
        console.log(`video页面的ipcRender发出:内容：${JSON.stringify(data)}`)
        ipcRenderer.send(Socket_Main_Render_Events.to_socket_server_msg, data)
    }


    const toggleVideoOrAudio = () => {
        console.log('切换音视频');
        videoOrAudioRef.value = !videoOrAudioRef.value
    }
    const toggleMute = () => {
        console.log('切换静音');
        muteRef.value = !muteRef.value
    }

    const closeVideoConnectPositive = () => {
        emitCloseMsg()
        setVideoStatus(VIDEO_CLIENT_STATUS.IDLE)
    }

    const closeVideoConnectPassive = () => {
        setVideoStatus(VIDEO_CLIENT_STATUS.IDLE)
    }


    const emitCloseMsg = () => {
        const msg = {
            roomId: invite_info.value.videoRoomId,
            type: 'cancel'
        }
        console.log(`向对方发出取消视频:${JSON.stringify(msg)}`)
        sendIpcMsg({
            type: SocketEvent.VIDEO_ROOM_CHANGE_MSG,
            data: msg
        })
    }

    const setVideoInfoType = (type) => {
        videoInfoTypeRef.value = type;
    }

    const setRemoteDesktopRole = type => {
        remoteDesktopRoleRef.value = type
    }


    return {
        userInfo,
        videoStatus,
        invite_info,
        setUser,
        setInviteInfo,
        setVideoStatus,
        sendIpcMsg,

        videoOrAudioRef,
        muteRef,
        toggleVideoOrAudio,
        toggleMute,
        closeVideoConnectPositive,
        closeVideoConnectPassive,

        videoInfoTypeRef,
        setVideoInfoType,
        remoteDesktopRoleRef,
        setRemoteDesktopRole

    }
}