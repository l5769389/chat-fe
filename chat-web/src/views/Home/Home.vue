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
  <Transition name="slide">
    <div v-if="showAddMore" ref="addMoreRef"
         class="absolute right-[-211px] w-[210px] h-[700px] bg-dark-200  border-box border border-black border-l-0">
      <add-user-chat></add-user-chat>
    </div>
  </Transition>
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
const activeDialogId = computed(() => store.getters.currentDialogInfo);

const addMoreRef = ref()


</script>
<style scoped>
.slide-enter-active {
  animation: slide 0.5s;
}

.slide-leave-active {
  animation: slide 0.5s reverse;
}

@keyframes slide {
  0% {
    transform: translateX(-210px);
  }
  100% {
    transform: translateX(0px);
  }
}

</style>