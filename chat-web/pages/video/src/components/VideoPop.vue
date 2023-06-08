<script setup>
import {SocketEvent,VIDEO_CLIENT_STATUS} from "/common/types.ts";
import InviteVideo from "./components/inviteVideo.vue";
import WaitForConnect from "./components/WaitForConnect.vue";
import Connecting from "./components/Connecting.vue";
const videoStatus = ref(VIDEO_CLIENT_STATUS.IDLE)
let invite_info = ref({
  videoRoomId: '',
  oppositeUserId: '',
  userId: '',
})
const handleCreateInviteRoom = data => {
  console.log(`房间roomId:${data}`)
  setInviteVideoInfo({
    videoRoomId: data,
  })
}

const handleOfferInvite = data => {
  const {fromUserId, msg: {roomId}} = data;
  setInviteVideoInfo({
    videoRoomId: roomId,
    oppositeUserId: fromUserId,
    userId: user.value.userId
  })
  console.log(`收到服务器事件：${SocketEvent.OFFER_INVITE}`)
  store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.BEINVITING)
  showVideoModal();
}

const EventMap = {
  'connect': handleConnect,
  'disconnect': handleDisconnect,
  'connect_error': handleConnectError,
  [SocketEvent.CHAT_JOIN_ROOM]: handleJoinRoom,
  [SocketEvent.CHAT_MSG_SINGLE]: handleSingleMsg,
  [SocketEvent.CHAT_MSG_MULTI]: handleMultiMsg,
  [SocketEvent.CREATE_INVITE_ROOM]: handleCreateInviteRoom,
  [SocketEvent.OFFER_INVITE]: handleOfferInvite
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