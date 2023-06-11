<script setup>
import {
  Between_Main_Render_Events,
  Socket_Main_Render_Events,
  SocketEvent,
  VIDEO_CLIENT_STATUS
} from "/common/types.ts";

import {ipcRenderer} from "electron";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import hooks from "./components/hooks.js";
import InviteVideo from "./components/inviteVideo.vue";
import WaitForConnect from "./components/WaitForConnect.vue";
import Connecting from "./components/Connecting.vue";

const {
  userInfo,
  videoStatus,
  invite_info,
  videoOrAudioRef,
  muteRef,
  setVideoStatus,
  sendIpcMsg,
  closeVideoConnectPassive
} = hooks();


let localStream = null;
const connectRef = ref(null);
let pc = null;
const pcConfig = {};

watch([videoOrAudioRef, muteRef], ([hasVideo, muteFlag]) => {
  console.log('change', [hasVideo, muteFlag])
  for (const track of localStream.getTracks()) {
    if (track.kind === 'audio') {
      track.enabled = !muteFlag
    } else if (track.kind === 'video') {
      track.enabled = hasVideo
    }
  }
})

watch(videoStatus, async newVal => {
  // 一旦用户点击了接受，那么就要获取本地视频流
  if (newVal === VIDEO_CLIENT_STATUS.BEINVITED) {
    console.log('点了接受，获取本地视频流')
    await localJoinStream()
  }
})


const closeVideo = () => {
  console.log('关闭音视频')
  if (localStream) {
    for (const track of localStream.getTracks()) {
      track.stop()
    }
  }
}

onMounted(() => {
  connectToSignalServer();
})

onBeforeUnmount(() => {
  closeVideo()
})


function getLocalStream() {
  const constraints = {
    video: true,
    audio: true,
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}


async function connectToSignalServer() {
  await createPeerConnection();
  ipcRenderer.on(Between_Main_Render_Events.transfer_video_msg, (event, args) => {
    console.log('视频modal收到ipcMain消息', JSON.stringify(args));
    const {eventName, data} = args;
    if (eventName === SocketEvent.ANSWER_INVITE) {
      handle_Answer_Invite(data)
    } else if (eventName === SocketEvent.VIDEO_ROOM_MSG) {
      handle_Video_room_msg(data)
    } else if (eventName === SocketEvent.VIDEO_ROOM_CHANGE_MSG) {
      handle_Video_room_change(data)
    }
  })
}

const handle_Answer_Invite = async (data) => {
  const {msg: {answer}} = data;
  console.log(`收到:${SocketEvent.ANSWER_INVITE}`)
  if (answer) {
    await localJoinStream()
    // 不知道为啥不延迟不行。
    setTimeout(() => {
      call()
    },500)
  } else {
  }
}

const handle_Video_room_msg = async (data) => {
  console.log(`收到:${SocketEvent.VIDEO_ROOM_MSG}`)
  switch (data.type) {
    case 'offer':
      pc.setRemoteDescription(new RTCSessionDescription(data))
      pc.createAnswer()
          .then(desc => {
            pc.setLocalDescription(desc)
            console.log(`收到offer,roomId为：${invite_info.value.videoRoomId}`)
            sendIpcMsg({
              type: SocketEvent.VIDEO_ROOM_MSG,
              data: {
                roomId: invite_info.value.videoRoomId,
                content: desc.toJSON()
              }
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
      await pc.addIceCandidate(candidate)
      break;
    default:
      break;
  }
}
const handle_Video_room_change = async (data) => {
  console.log(`收到：${SocketEvent.VIDEO_ROOM_CHANGE_MSG}`, JSON.stringify(data))
  const {type} = data;
  if (type === 'cancel') {
    closeVideoConnectPassive()
  }
}


async function createPeerConnection() {
  pc = new RTCPeerConnection(pcConfig);
  pc.onicecandidate = (e) => {
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
  pc.ontrack = async (e) => {
    console.log('收到对方的track')
    setVideoStatus(VIDEO_CLIENT_STATUS.CONNECTED)
    await nextTick(() => {
      connectRef.value.$refs.oppositeRef.srcObject = e.streams[0];
      connectRef.value.$refs.myRef.srcObject = localStream
    })
  }
}

async function localJoinStream() {
  // 获取本地流，发送给对方。
  try {
    localStream = await getLocalStream();
    for (const track of localStream.getTracks()) {
      pc.addTrack(track, localStream)
    }
    console.log('获取本地视频成功')
  } catch (e) {
    console.log('获取本地视频流出错')
    console.error(e)
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
        sendIpcMsg({
          type: SocketEvent.VIDEO_ROOM_MSG,
          data: {
            roomId: invite_info.value.videoRoomId,
            content: desc.toJSON()
          }
        })
      })
      .catch(e => {
        console.log(e)
      })
}


</script>

<template>
  <div class="w-full h-full">
    <invite-video v-if="videoStatus ===VIDEO_CLIENT_STATUS.BEINVITING"></invite-video>
    <wait-for-connect v-if="videoStatus ===VIDEO_CLIENT_STATUS.INVITING"></wait-for-connect>
    <connecting v-else-if="videoStatus === VIDEO_CLIENT_STATUS.CONNECTED" ref="connectRef"></connecting>
  </div>
</template>

<style scoped>

</style>