<script setup>
import {ipcRenderer} from 'electron'
import VideoPop from "./components/VideoPop.vue";
import hooks from './components/components/hooks.js'
import {Between_Main_Render_Events, SocketEvent, VIDEO_CLIENT_STATUS} from "../../../common/types.ts";

const {userInfo, invite_info, setUser, setInviteInfo, setVideoStatus} = hooks();
const handleCreateInviteRoom = data => {
  console.log(`房间roomId:${data}`)
  setInviteInfo({
    videoRoomId: data
  })
}
const handleOfferInvite = data => {
  const {fromUserId, msg: {roomId}} = data;
  setInviteInfo({
    videoRoomId: roomId,
    oppositeUserId: fromUserId,
  })
  console.log(`收到服务器事件：${SocketEvent.OFFER_INVITE}`)
}
const setUserInfo = data => {
  const {user, oppositeUser} = data;
  setUser(data)
  if (user && oppositeUser){
    setVideoStatus(VIDEO_CLIENT_STATUS.INVITING)
  }else if (user){
    setVideoStatus(VIDEO_CLIENT_STATUS.BEINVITING)
  }
}

const EventMap = {
  'video-info': setUserInfo,
  [SocketEvent.CREATE_INVITE_ROOM]: handleCreateInviteRoom,
  [SocketEvent.OFFER_INVITE]: handleOfferInvite
}

ipcRenderer.on(Between_Main_Render_Events.transfer_video_msg, (event, args) => {
  console.log('视频页面收到消息:', args);
  if (typeof args === 'string') {
    args = JSON.parse(args)
  }
  const {eventName, data} = args;
  const handlerEvent = EventMap[eventName]
  if (handlerEvent) {
    handlerEvent(data)
  }
})

</script>

<template>
  <video-pop></video-pop>
</template>

<style scoped>

</style>
