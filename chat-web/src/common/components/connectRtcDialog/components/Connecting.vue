<script setup>
import {inject, ref} from "vue";
import VideoController from "@/common/components/connectRtcDialog/components/VideoController.vue";

const socket = inject("socket");
const myRef = ref(null)
const oppositeRef = ref(null)
let localStream = null;
let pc = null;
const pcConfig = {};
const openVideo = async () => {
  const stream = await getLocalStream();
  localStream = stream;
  myRef.value.srcObject = stream;
  await connectToSignalServer();
  socket.emit('join_video_room');
}

function getLocalStream() {
  // 获取本地流
  const constraints = {
    video: true,
    audio: false
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

function connectToSignalServer() {
  socket.on('joined_video_room', (room, data) => {
    console.log('joined_video_room')
    createPeerConnection();
  })
  socket.on('other_join_room', (room, data) => {
    console.log('otherjoin');
    call()
  })
  socket.on('video_room_message', (data) => {
    switch (data.type) {
      case 'offer':
        console.log('收到offer')
        pc.setRemoteDescription(new RTCSessionDescription(data))
        pc.createAnswer()
            .then(desc => {
              pc.setLocalDescription(desc)
              socket.emit('video_room_message', desc)
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


function createPeerConnection() {
  pc = new RTCPeerConnection(pcConfig);
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit('video_room_message', {
        type: 'candidate',
        label: e.candidate.sdpMLineIndex,
        id: e.candidate.sdpMid,
        candidate: e.candidate.candidate
      })
    }
  }
  pc.ontrack = (e) => {
    oppositeRef.value.srcObject = e.streams[0];
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
        socket.emit('video_room_message', desc)
      })
}
</script>

<template>
  <div class="w-full h-full relative">
    <div class="w-[60px] h-[100px] bg-red absolute left-2 top-10">
      <video id="origin" autoplay playsinline ref="myRef"></video>
    </div>

    <div class="w-full h-full absolute top-0 left-0">
      <video  ref="oppositeRef"  autoplay playsinline></video>
    </div>

    <div class="w-5/6 absolute bottom-1/4 left-1/2 bg-black" style="transform: translateX(-50%)">
      <video-controller/>
    </div>

  </div>
</template>

<style scoped>

</style>