import {inject, ref} from "vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {SocketEvent, VIDEO_CLIENT_STATUS} from "/common/types.ts";
import {useStore} from "vuex";
import {sendIpcMsg} from "@/utils/hooks/hooks.js";

const videoOrAudioRef = ref(true)
const muteRef = ref(false)


const {invite_info, hideVideoModal} = modalVideoHooks();
const closeRef = ref(false)
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
        store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.IDLE)
        hideVideoModal()
    }

    const closeVideoConnectPassive = () => {
        store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.IDLE)
        hideVideoModal()
    }


    const emitCloseMsg = () => {
        const msg = {
            roomId: invite_info.videoRoomId,
            type: 'cancel'
        }
        console.log(`向对方发出取消视频:${JSON.stringify(msg)}`)
        sendIpcMsg({
            type: SocketEvent.VIDEO_ROOM_CHANGE_MSG,
            data: msg
        })
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