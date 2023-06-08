import {ref} from "vue";
import {Socket_Main_Render_Events, VIDEO_CLIENT_STATUS} from "/common/types.ts";
import {ipcRenderer} from "electron";

const user = ref({})
const invite_info = ref({
    videoRoomId: '',
    oppositeUserId: '',
    userId: '',
})
const videoStatus = ref(VIDEO_CLIENT_STATUS.IDLE)
export default function () {
    const setUser = (info) => {
        user.value = info
    }
    const setInviteInfo = (info) => {
        Object.assign(invite_info.value, info)
    }
    const setVideoStatus = (status) => {
        videoStatus.value = status
    }

    const sendIpcMsg = (msg) => {
        ipcRenderer.send(Socket_Main_Render_Events.to_socket_server_msg, msg)
    }

    return {
        user,
        videoStatus,
        invite_info,
        setUser,
        setInviteInfo,
        setVideoStatus,
        sendIpcMsg,
    }
}