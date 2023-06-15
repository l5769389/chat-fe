<template>
  <div class="w-[230px] bg-gray-100 h-100 overflow-auto relative border-r-2 border-solid border-black">
    <div class="bg-dark-100 sticky inset-x-0 top-0 h-14 flex items-center h-[50px]">
      <chat-search/>
    </div>
    <div class="overflow-hidden bg-dark-200" style="height: calc( 100% - 3.5rem)">
      <chat-list/>
    </div>
  </div>
  <div class="flex-1 bg-dark-200 w-0 z-10">
    <chat-dialog-win/>
  </div>
  <el-dialog
      v-model="showAddMore"
      :show-close="false"
      class="addMoreDialog"
  >
    <add-user-chat @hide-modal="showAddMore = false"></add-user-chat>
  </el-dialog>
</template>
<script setup>
import ChatList from './components/ChatList.vue'
import ChatSearch from '@/common/components/ChatSearch.vue'
import ChatDialogWin from './components/ChatDialogWin/ChatDialogWin.vue'
import {showAddMore} from './homeHooks'
import AddUserChat from './components/AddUserChat.vue'
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore()
</script>
<style>
.addMoreDialog .el-dialog__header {
  display: none;
}
</style>