<template>
  <div class="flex items-center w-full box-border pl-5 pr-5 h-9">
    <div
        v-for="item in icons"
        :key="item.type"
        class="text-dark-200 mr-3 flex justify-center items-center"
        :class="item.className"
        @click="item?.handler"
    >
      <template v-if="item.type === 'meme'">
        <el-popover
            placement="top"
            trigger="click"
            content="this is content, this is content, this is content"
        >
          <meme></meme>
          <template #reference>
            <component
                :is="item.icon"
                theme="outline"
                size="23"
                class="fill-current"
            ></component>
          </template>
        </el-popover>
      </template>
      <template v-else-if="item.type === 'file'">
        <component
            :is="item.icon"
            theme="outline"
            size="23"
            class="fill-current"
        ></component>
        <input type="file" multiple class="hidden" ref="uploadRef" @change="handleChoose">
      </template>
      <template v-else>
        <component
            :is="item.icon"
            theme="outline"
            size="23"
            class="fill-current"
        ></component>
      </template>
    </div>
  </div>
</template>
<script setup>
import {
  WinkingFace,
  FolderClose,
  Screenshot,
  Message,
  PhoneTelephone,
  VideoOne,
  RemoteControl
} from "@icon-park/vue-next";
import Meme from "@/common/components/Meme.vue";
import {useStore} from "vuex";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {computed, ref,} from "vue";
import uploadFileHook from "@/utils/hooks/uploadFileHook.js";
import {ipcRenderer} from 'electron'
import {
  SocketEvent,
  MainEvent,
  Socket_Main_Render_Events,
  Between_Main_Render_Events,
  Render_Render_Events, Video_Info_Type
} from "/common/types.ts";

const {addUploadFile} = uploadFileHook()

const uploadRef = ref(null)

const store = useStore()
const {showVideoModal} = modalVideoHooks()
const user = computed(() => store.getters.user)
const currentDialogInfo = computed(() => store.getters.currentDialogInfo)

/**
 * 1. 向ipcMain发起视频，携带信息
 * 2. ipcMain 收到后：
 *    2.1  创建视频页面并要把用户信息传递过去
 *    2.2  发起视频请求
 */
const invokeRTCDialog = () => {
  const invokePageInfo = {
    eventName: Render_Render_Events.video_info,
    data: {
      user: user.value,
      oppositeUser: currentDialogInfo.value,
      video_info_type: Video_Info_Type.video
    }
  }
  ipcRenderer.send(Between_Main_Render_Events.transfer_video_msg, JSON.stringify(invokePageInfo));

  const msg = {
    type: SocketEvent.OFFER_INVITE,
    data: {
      userId: user.value.userId,
      oppositeId: currentDialogInfo.value.id,
      video_info_type: Video_Info_Type.video
    }
  }
  ipcRenderer.send(Socket_Main_Render_Events.to_socket_server_msg, msg)
}


const invokeRemoteDesk = () => {
  const invokePageInfo = {
    eventName: Render_Render_Events.video_info,
    data: {
      user: user.value,
      oppositeUser: currentDialogInfo.value,
      video_info_type: Video_Info_Type.remote_desktop
    }
  }
  ipcRenderer.send(Between_Main_Render_Events.transfer_video_msg, JSON.stringify(invokePageInfo));

  const msg = {
    type: SocketEvent.OFFER_INVITE,
    data: {
      userId: user.value.userId,
      oppositeId: currentDialogInfo.value.id,
      video_info_type: Video_Info_Type.remote_desktop
    }
  }
  ipcRenderer.send(Socket_Main_Render_Events.to_socket_server_msg, msg)
}

const invokeUpload = () => {
  uploadRef.value[0].dispatchEvent(new MouseEvent('click'))
}

const handleChoose = (e) => {
  const files = e.target.files;
  for (const file of files) {
    addUploadFile(files)
  }
}



const invokeCapture = () => {
  ipcRenderer.send('capture', 123)
}

const icons = [
  {
    type: "meme",
    icon: WinkingFace,
  },
  {
    type: 'file',
    icon: FolderClose,
    handler: invokeUpload
  },
  {
    icon: Screenshot,
    handler: invokeCapture
  },
  {
    icon: Message,
  },
  {
    icon: RemoteControl,
    handler: invokeRemoteDesk
  },
  {
    icon: PhoneTelephone,
    className: "ml-auto",
  },
  {
    icon: VideoOne,
    handler: invokeRTCDialog
  },
];


</script>
<style scoped></style>
