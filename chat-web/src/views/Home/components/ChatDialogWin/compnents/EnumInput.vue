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
} from "@icon-park/vue-next";
import Meme from "@/common/components/Meme.vue";
import {useStore} from "vuex";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {VIDEO_CLIENT_STATUS} from "@/config/config.js";

const store= useStore()
const {showVideoModal} = modalVideoHooks()
const invokeRTCDialog = () => {
    store.commit('setVideoStatus',VIDEO_CLIENT_STATUS.INVITING)
    showVideoModal()
}
const icons = [
  {
    type: "meme",
    icon: WinkingFace,
  },
  {
    icon: FolderClose,
  },
  {
    icon: Screenshot,
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
