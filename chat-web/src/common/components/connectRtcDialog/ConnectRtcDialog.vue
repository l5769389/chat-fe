<script setup>

import WaitForConnect from "@/common/components/connectRtcDialog/components/WaitForConnect.vue";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import InviteVideo from "@/common/components/connectRtcDialog/components/inviteVideo.vue";
import {

    CONNECTING,
    JUDGE_ANSWER,
    SocketEvent, VIDEO_CLIENT_STATUS,
    WAITING_FOR_ANSWER
} from "@/config/config.js";
import Connecting from "@/common/components/connectRtcDialog/components/Connecting.vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import rtcModalHook from "@/common/components/connectRtcDialog/rtcModalHook.js";
import {ElMessage} from "element-plus";

const store = useStore()
const {invite_info, hideVideoModal} = modalVideoHooks();
const {
    videoOrAudioRef,
    muteRef,
    closeRef,
} = rtcModalHook();

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

watch([videoOrAudioRef, muteRef], ([hasVideo, muteFlag]) => {
    console.log('change',[hasVideo,muteFlag])
    for (const track of localStream.getTracks()) {
        if (track.kind === 'audio') {
            track.enabled = !muteFlag
        } else if (track.kind === 'video') {
            track.enabled = hasVideo
        }
    }
})

watch(closeRef, newVal => {
    console.log('收到关闭指令');
    if (newVal) {
        for (const track of localStream.getTracks()) {
            track.stop()
        }
    }
})
const emitOfferInvite = () => {
    socket.emit(SocketEvent.OFFER_INVITE, {
        userId: user.value.userId,
        oppositeId: currentDialogInfo.value.id,
    });
}

onMounted(() => {
    connectToSignalServer();
    if (videoStatus.value !== JUDGE_ANSWER) {
        emitOfferInvite();
    }
})


function getLocalStream() {
    // 获取本地流
    const constraints = {
        video: true,
        audio: true,
    }
    return navigator.mediaDevices.getUserMedia(constraints)
}


async function connectToSignalServer() {
    await createPeerConnection();
    socket.on(SocketEvent.ANSWER_INVITE, async (data) => {
        const {msg: {answer}} = data;
        console.log(`收到:${SocketEvent.ANSWER_INVITE}`)
        if (answer) {
            call()
        } else {
            hideVideoModal()
            ElMessage('对方拒绝了你')
        }
    })
    socket.on(SocketEvent.VIDEO_ROOM_MSG, (data) => {
        console.log(`收到:${SocketEvent.VIDEO_ROOM_MSG}`)
        switch (data.type) {
            case 'offer':
                pc.setRemoteDescription(new RTCSessionDescription(data))
                pc.createAnswer()
                    .then(desc => {
                        pc.setLocalDescription(desc)
                        console.log(`收到offer,roomId为：${invite_info.videoRoomId}`)
                        socket.emit(SocketEvent.VIDEO_ROOM_MSG, {
                            roomId: invite_info.videoRoomId,
                            content: desc
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
    pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            const msg = {
                roomId: invite_info.videoRoomId,
                content: {
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                }
            }
            socket.emit(SocketEvent.VIDEO_ROOM_MSG, msg)
        }
    }
    pc.ontrack = async (e) => {
        store.commit('setVideoStatus', CONNECTING)
        await nextTick(() => {
            connectRef.value.$refs.oppositeRef.srcObject = e.streams[0];
            connectRef.value.$refs.myRef.srcObject = stream;
        })
    }
    // 获取本地流，发送给对方。
    for (const track of localStream.getTracks()) {
        pc.addTrack(track, localStream)
    }
}

function call() {
    const offerOptions = {
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 0,
    }
    pc.createOffer(offerOptions)
        .then(desc => {
            pc.setLocalDescription(desc);
            console.log(`发出：${SocketEvent.VIDEO_ROOM_MSG}`)
            socket.emit(SocketEvent.VIDEO_ROOM_MSG, {
                roomId: invite_info.videoRoomId,
                content: desc
            })
        })
        .catch(e => {
            console.log(e)
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
            <invite-video v-if="videoStatus ===VIDEO_CLIENT_STATUS.BEINVITED"></invite-video>
            <wait-for-connect v-if="videoStatus ===VIDEO_CLIENT_STATUS.INVITING"></wait-for-connect>
            <connecting v-else-if="videoStatus === VIDEO_CLIENT_STATUS.CONNECTED" ref="connectRef"></connecting>
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