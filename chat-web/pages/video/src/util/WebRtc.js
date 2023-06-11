import {SocketEvent, VIDEO_CLIENT_STATUS} from "../../../../common/types.js";
import {nextTick} from "vue";

class WebRtc {
    localStream;
    pc = null;
    pcConfig = {};

    constructor() {

    }

    createPeerConnection = () => {
        this.pc = new RTCPeerConnection(this.pcConfig)
        this.pc.onicecandidate = (e) => {
            if (e.candidate) {
                const msg = {
                    roomId: invite_info.value.videoRoomId,
                    content: {
                        type: 'candidate',
                        label: e.candidate.sdpMLineIndex,
                        id: e.candidate.sdpMid,
                        candidate: e.candidate.candidate
                    }
                }
                sendIpcMsg({
                    type: SocketEvent.VIDEO_ROOM_MSG,
                    data: msg
                })
            }
        }
        this.pc.ontrack = async (e) => {
            console.log('收到对方的track')
            setVideoStatus(VIDEO_CLIENT_STATUS.CONNECTED)
            await nextTick(() => {
                connectRef.value.$refs.oppositeRef.srcObject = e.streams[0];
                connectRef.value.$refs.myRef.srcObject = localStream
            })
        }
    }

}