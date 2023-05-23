import {inject, ref} from "vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {SocketEvent, VIDEO_CLIENT_STATUS} from "@/config/config.js";
import {useStore} from "vuex";

const videoOrAudioRef = ref(true)
const muteRef = ref(false)
const closeRef = ref(false)

const {invite_info,hideVideoModal} = modalVideoHooks();

export default function () {
    const socket = inject("socket");
    const store = useStore()
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
        closeRef.value = true
        hideVideoModal()
        store.commit('setVideoStatus',VIDEO_CLIENT_STATUS.IDLE)
    }

    const closeVideoConnectPassive = () => {
        closeRef.value = true
        hideVideoModal()
        store.commit('setVideoStatus',VIDEO_CLIENT_STATUS.IDLE)
    }


    const emitCloseMsg =() => {
        const msg = {
            roomId: invite_info.videoRoomId,
            type: 'cancel'
        }
        console.log(`向对方发出取消视频:${JSON.stringify(msg)}`)
        socket.emit(SocketEvent.VIDEO_ROOM_CHANGE_MSG, msg)
    }
    return {
        videoOrAudioRef,
        muteRef,
        closeRef,
        toggleVideoOrAudio,
        toggleMute,
        closeVideoConnectPositive,
        closeVideoConnectPassive
    }
}