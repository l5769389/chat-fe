<script setup>
import {
  Between_Main_Render_Events,
  Socket_Main_Render_Events,
  SocketEvent,
  VIDEO_CLIENT_STATUS, Video_Info_Type
} from "/common/types.ts";

import {ipcRenderer} from "electron";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import hooks from "@video/hook/hooks.js";
import InviteVideo from "./components/inviteVideo.vue";
import WaitForConnect from "./components/WaitForConnect.vue";
import Connecting from "./components/Connecting.vue";
import {WebRtc} from "@video/util/WebRtc.js";
import {RemoteDesktopRole} from "@video/types/types.ts";

const {
  userInfo,
  videoStatus,
  invite_info,
  remoteDesktopRoleRef,
  setVideoStatus,
  sendIpcMsg,
  closeVideoConnectPassive
} = hooks();

const rtcInstance = new WebRtc(Video_Info_Type.remote_desktop)
let localStream = null;
const connectRef = ref(null);
let pc = null;
const pcConfig = {};

// watch([videoOrAudioRef, muteRef], ([hasVideo, muteFlag]) => {
//   console.log('change', [hasVideo, muteFlag])
//   for (const track of localStream.getTracks()) {
//     if (track.kind === 'audio') {
//       track.enabled = !muteFlag
//     } else if (track.kind === 'video') {
//       track.enabled = hasVideo
//     }
//   }
// })

watch(videoStatus, async newVal => {
  // 一旦用户点击了接受，那么就要获取本地视频流
  if (newVal === VIDEO_CLIENT_STATUS.BEINVITED) {
    console.log('点了接受，获取本地视频流')
    localStream = await rtcInstance.getLocalStream()
  }
})


// const closeVideo = () => {
//   console.log('关闭音视频')
//   if (localStream) {
//     for (const track of localStream.getTracks()) {
//       track.stop()
//     }
//   }
// }


onMounted(() => {
  connectToSignalServer();
})


// onBeforeUnmount(() => {
//   closeVideo()
// })


async function connectToSignalServer() {
  rtcInstance.createPeerConnection(onicecandidate, ontrack)
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
    localStream = await rtcInstance.getLocalStream()
    // 不知道为啥不延迟不行。
    setTimeout(() => {
      rtcInstance.createOffer(onCreateOffer)
    }, 1000)
  } else {
  }
}

const handle_Video_room_msg = async (data) => {
  console.log(`收到:${SocketEvent.VIDEO_ROOM_MSG}`)
  const onCreateAnswer = (desc) => {
    console.log(`收到offer,roomId为：${invite_info.value.videoRoomId}`)
    sendIpcMsg({
      type: SocketEvent.VIDEO_ROOM_MSG,
      data: {
        roomId: invite_info.value.videoRoomId,
        content: desc.toJSON()
      }
    })
  }
  switch (data.type) {
    case 'offer':
      await rtcInstance.handleOffer(data, onCreateAnswer)
      break;
    case 'answer':
      console.log('收到answer')
      await rtcInstance.handleAnswer(data)
      break;
    case 'candidate':
      console.log('收到candidate')
      await rtcInstance.handleCandidate(data)
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


const onicecandidate = (e) => {
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

const ontrack = async (e) => {
  console.log('收到对方的track')
  setVideoStatus(VIDEO_CLIENT_STATUS.CONNECTED)
  await nextTick(() => {
    connectRef.value.$refs.oppositeRef.srcObject = e.streams[0];
    // connectRef.value.$refs.myRef.srcObject = localStream
  })
}

const onCreateOffer = desc => {
  console.log(`发出：${SocketEvent.VIDEO_ROOM_MSG},${JSON.stringify(desc)}`)
  sendIpcMsg({
    type: SocketEvent.VIDEO_ROOM_MSG,
    data: {
      roomId: invite_info.value.videoRoomId,
      content: desc.toJSON()
    }
  })
}


</script>

<template>
  <div class="w-full h-full">
    <invite-video v-if="videoStatus ===VIDEO_CLIENT_STATUS.BEINVITING"></invite-video>
    <wait-for-connect v-if="videoStatus ===VIDEO_CLIENT_STATUS.INVITING"></wait-for-connect>
    <connecting v-else-if="videoStatus === VIDEO_CLIENT_STATUS.CONNECTED && remoteDesktopRoleRef === RemoteDesktopRole.Positive" ref="connectRef"></connecting>
  </div>
</template>

<style scoped>

</style>