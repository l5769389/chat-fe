export class WebRtc {
    localStream;
    pc = null;
    pcConfig = {};

    constructor() {

    }

    createPeerConnection = (onicecandidate, ontrack) => {
        this.pc = new RTCPeerConnection(this.pcConfig)
        this.pc.onicecandidate = onicecandidate
        this.pc.ontrack = ontrack
    }

    createOffer(onCreateOffer, onCreateOfferError = () => {
    }) {
        const offerOptions = {
            offerToReceiveVideo: 1,
            offerToReceiveAudio: 0,
        }
        this.pc.createOffer(offerOptions)
            .then(async desc => {
                await this.setLocalDescription(desc)
                onCreateOffer(desc)
            })
            .catch(onCreateOfferError)
    }

    createAnswer = async () => {
        const desc = await this.pc.createAnswer()
        return desc;
    }

    async handleOffer(data, onCreateAnswer, onCreateAnswerError = () => {
    }) {
        try {
            // 1. 设置远端
            await this.setRemoteDescription(data)
            // 创建answer
            const desc = await this.createAnswer()
            await this.setLocalDescription(desc)
            // 执行回调
            onCreateAnswer(desc)
        } catch (e) {
            onCreateAnswerError(e)
        }
    }

    async setLocalDescription(data) {
        await this.pc.setLocalDescription(new RTCSessionDescription(data))
    }

    async setRemoteDescription(data) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(data))
    }

    async handleCandidate(data) {
        const candidate = new RTCIceCandidate({
            sdpMLineIndex: data.label,
            candidate: data.candidate
        })
        await this.pc.addIceCandidate(candidate)
    }

    async getLocalStream() {
        const constraints = {
            video: true,
            audio: true,
        }
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
            for (const track of this.localStream.getTracks()) {
                this.pc.addTrack(track, this.localStream)
            }
        } catch (e) {
            console.log('获取本地视频出错')
            console.log(e)
        }
        return this.localStream
    }

    handleAnswer = async (data) => {
        const desc = new RTCSessionDescription(data)
        await this.setRemoteDescription(desc)
    }
}