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
  <canvas></canvas>
</template>
<script setup>
import {
  WinkingFace,
  FolderClose,
  Screenshot,
  Message,
  PhoneTelephone,
  VideoOne,
} from "@icon-park/vue-next";
import Meme from "@/common/components/Meme.vue";
import {useStore} from "vuex";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {VIDEO_CLIENT_STATUS} from "@/config/config.js";
import {ref} from "vue";
import uploadFileHook from "@/utils/hooks/uploadFileHook.js";
import {ipcRenderer} from 'electron'
const {addUploadFile} = uploadFileHook()

const uploadRef = ref(null)

const store= useStore()
const {showVideoModal} = modalVideoHooks()
const invokeRTCDialog = () => {
    store.commit('setVideoStatus',VIDEO_CLIENT_STATUS.INVITING)
    showVideoModal()
}
const invokeUpload = ()=> {
  uploadRef.value[0].dispatchEvent(new MouseEvent('click'))
}

const handleChoose = (e) => {
  const files = e.target.files;
  for (const file of files) {
    addUploadFile(files)
  }
}
ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
  try {
    console.log('ipcRender 收到 SET_SOURCE')
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    })
    handleStream(stream)
  } catch (e) {
    handleError(e)
  }
})

function handleStream (stream) {
  const canvas = document.querySelector('canvas')

}

function handleError (e) {
  console.log(e)
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
    icon: PhoneTelephone,
    className: "ml-auto",
  },
  {
    icon: VideoOne,
    handler: invokeRTCDialog
  },
];



</script>
<style scope></style>
