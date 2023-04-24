<template>
  <div class="w-1/4 bg-gray-300 h-100 overflow-auto relative">
      <div class="bg-dark-100 sticky inset-x-0 top-0 h-12 flex items-center box-border"
           >
          <chat-search/>
      </div>
      <div class="overflow-hidden bg-dark-200" style="height: calc( 100% - 3rem)">
          <chat-list/>
      </div>
  </div>
  <div class="flex-1 bg-gray-500">
      <chat-dialog-win/>
  </div>
</template>
<script setup>
import ChatList from './components/ChatList.vue'
import ChatSearch from './components/ChatSearch.vue'
import ChatDialogWin from './components/ChatDialogWin/ChatDialogWin.vue'
</script>
<style scoped></style>