<script setup>
import {ipcRenderer} from 'electron'
import VideoPop from "./components/VideoPage/VideoPop.vue";
import hooks from './hook/hooks.js'
import {
  Between_Main_Render_Events,
  Render_Render_Events,
  SocketEvent,
  VIDEO_CLIENT_STATUS, Video_Info_Type
} from "../../../common/types.ts";
import RemoteControl from "./components/RemoteControlPage/RemoteControl.vue";
import {RemoteDesktopRole} from "@video/types/types.ts";

const {
  userInfo, setUser, setInviteInfo, setVideoStatus,
  videoInfoTypeRef,
  setVideoInfoType,
  invite_info,
  setRemoteDesktopRole
} = hooks();
const handleCreateInviteRoom = data => {
  console.log(`房间roomId:${data}`)
  setInviteInfo({
    videoRoomId: data
  })
}
const handleOfferInvite = data => {
  const {fromUserId, msg: {roomId}, video_info_type} = data;
  setVideoInfoType(video_info_type)
  setRemoteDesktopRole(RemoteDesktopRole.Passive)
  setInviteInfo({
    videoRoomId: roomId,
    oppositeUserId: fromUserId,
  })
  console.log(`收到服务器事件：${SocketEvent.OFFER_INVITE}`)
}


//进入这里说明是主动发起方。
const setUserInfo = data => {
  const {user, oppositeUser, video_info_type} = data;
  if (video_info_type) {
    setVideoInfoType(video_info_type)
    setRemoteDesktopRole(RemoteDesktopRole.Positive)
  }
  setUser(data)
  if (user && oppositeUser) {
    setVideoStatus(VIDEO_CLIENT_STATUS.INVITING)
  } else if (user) {
    setVideoStatus(VIDEO_CLIENT_STATUS.BEINVITING)
  }
}

const EventMap = {
  [Render_Render_Events.video_info]: setUserInfo,
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
  <video-pop v-if="videoInfoTypeRef === Video_Info_Type.video"></video-pop>
  <remote-control v-else-if="videoInfoTypeRef ===Video_Info_Type.remote_desktop "></remote-control>
</template>

<style scoped>

</style>
