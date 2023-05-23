import {ref} from "vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";

const {hideVideoModal} = modalVideoHooks()
const videoOrAudioRef = ref(true)
const muteRef = ref(false)
const closeRef = ref(false)
export default function () {
    const toggleVideoOrAudio = () => {
        console.log('切换音视频');
        videoOrAudioRef.value = !videoOrAudioRef.value
    }
    const toggleMute = () => {
        console.log('切换静音');
        muteRef.value = !muteRef.value
    }
    const closeConnect = () => {
        closeRef.value = true
        hideVideoModal()
    }
    return {
        videoOrAudioRef,
        muteRef,
        closeRef,
        toggleVideoOrAudio,
        toggleMute,
        closeConnect
    }
}