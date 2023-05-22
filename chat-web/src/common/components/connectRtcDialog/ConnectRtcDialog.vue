<script setup>

import WaitForConnect from "@/common/components/connectRtcDialog/components/WaitForConnect.vue";
import {computed, inject, onMounted, ref} from "vue";
import {useStore} from "vuex";
import InviteVideo from "@/common/components/connectRtcDialog/components/inviteVideo.vue";
import {
    ANSWER_INVITE,
    CONNECTING,
    JUDGE_ANSWER,
    OFFER_INVITE,
    VIDEO_ROOM_MSG,
    WAITING_FOR_ANSWER
} from "@/config/config.js";
import Connecting from "@/common/components/connectRtcDialog/components/Connecting.vue";
const store = useStore()
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
const {invite_info} = modalVideoHooks();
defineProps({
    showConnect: {
        type: Boolean,
        default: false
    }
})

const videoStatus = computed(() => store.state.videoStatus)

const socket = inject("socket");
const currentDialogInfo = computed(() => store.getters.currentDialogInfo)
const user = computed(() => store.getters.user)
let localStream = null;
const connectRef = ref(null);
let pc = null;
const pcConfig = {};
const openVideo = async () => {
   connectToSignalServer();
    socket.emit(OFFER_INVITE,{
        userId:user.value.userId,
        oppositeId: currentDialogInfo.value.id,
    });
}
onMounted(() => {
    openVideo()
})

function getLocalStream() {
    // 获取本地流
    const constraints = {
        video: true,
        audio: false,
    }
    return navigator.mediaDevices.getUserMedia(constraints)
}

function connectToSignalServer() {
    socket.on(ANSWER_INVITE,async (room, data) => {
        console.log('收到answer invite')
       await createPeerConnection();
        call()
    })
    socket.on(VIDEO_ROOM_MSG, (data) => {
        console.log(`收到：${VIDEO_ROOM_MSG}`)
        switch (data.type) {
            case 'offer':
                console.log('收到offer')
                pc.setRemoteDescription(new RTCSessionDescription(data))
                pc.createAnswer()
                    .then(desc => {
                        pc.setLocalDescription(desc)
                        socket.emit(VIDEO_ROOM_MSG, {
                            roomId: invite_info.videoRoomId,
                            content:desc
                        })
                    })
                break;
            case 'answer':
                console.log('收到answer')
                pc.setRemoteDescription(new RTCSessionDescription(data))
                break;
            case 'candidate':
                console.log('收到candidate')
                const candidate = new RTCIceCandidate({
                    sdpMLineIndex: data.label,
                    candidate: data.candidate
                })
                pc.addIceCandidate(candidate)
                break;
            default:
                break;
        }
    })
}


async function createPeerConnection() {
    const stream = await getLocalStream();
    localStream = stream;
    store.commit('setVideoStatus',CONNECTING)
    pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            socket.emit(VIDEO_ROOM_MSG, {
                roomId: invite_info.videoRoomId,
                data: {
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                }
            })
        }
    }
    pc.ontrack =async (e) => {
        connectRef.value.$refs.oppositeRef.srcObject =e.streams[0];
        connectRef.value.$refs.myRef.srcObject = stream;
    }
    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
    })
}

function call() {
    const offerOptions = {
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 0,
    }
    pc.createOffer(offerOptions)
        .then(desc => {
            pc.setLocalDescription(desc);
            socket.emit(VIDEO_ROOM_MSG, desc)
        })
}

</script>

<template>
    <el-dialog
            :model-value="showConnect"
            width="100%"
            class="max-w-[350px] no-header"
            :show-close="false"
            :close-on-click-modal="false"
    >
        <div class="w-full h-[600px] max-h-full">
            <invite-video v-if="videoStatus ===JUDGE_ANSWER "></invite-video>
            <wait-for-connect v-if="videoStatus ===WAITING_FOR_ANSWER "></wait-for-connect>
            <connecting v-else-if="videoStatus === CONNECTING" ref="connectRef"></connecting>
        </div>
    </el-dialog>
</template>

<style>

.no-header .el-dialog__header {
    padding: 0;
}

.no-header .el-dialog__body {
    padding: 0;
}

</style>