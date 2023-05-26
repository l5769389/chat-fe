<template>
  <div class="flex flex-col flex-1">
    <edit-input ref="editInputRef" class="max-h-[200px] overflow-auto"></edit-input>
    <div class="w-20 h-10 self-end">
      <el-button plain class="ml" @click="sendMsg">Send</el-button>
    </div>
  </div>
</template>

<script setup>
import {computed, inject, ref} from "vue";
import {useStore} from "vuex";
import {getFormatTime} from "@/utils/utils.js";
import EditInput from "@/views/components/EditInput.vue";
import {SocketEvent} from "@/config/config.js";

const socket = inject("socket");
const store = useStore();
const currentDialogInfo = computed(() => store.getters.currentDialogInfo);
const user = computed(() => store.getters.user);
const editInputRef = ref(null)
const sendMsg = () => {
  const msg = editInputRef.value.getEditContent()
  if (msg.length === 0) {
    return
  }
  editInputRef.value.clearAllInput()
  sendToServer(msg);
  storeToLocal(msg);
};

const storeToLocal = (msg) => {
  if (Array.isArray(msg)) {
    const mapped_msg = msg.map(item => {
      if (item.type === 'img') {
        return {
          type: 'img',
          content: item.objectUrl,
          timestamp: getFormatTime(),
          messageId: new Date().getTime(),
          source: "self",
          userId: user.value.userId
        }
      } else if (item.type === 'text') {
        return {
          type: 'text',
          content: item.content,
          timestamp: getFormatTime(),
          messageId: new Date().getTime(),
          source: "self",
          userId: user.value.userId
        }
      } else if (item.type === 'file') {
        return {
          type: 'file',
          content: item.content,
          timestamp: getFormatTime(),
          messageId: new Date().getTime(),
          source: "self",
          userId: user.value.userId
        }
      }
    })
    mapped_msg.forEach(msg => {
      store.commit("addTotalMsgMap", {
        chatId: currentDialogInfo.value.id,
        ...msg,
      });
    })

  }
};
const sendToServer = (msg) => {
  for (const msgSingle of msg) {
    Object.assign(msgSingle, {
      timestamp: new Date().getTime()
    })
    sendToServerOneMsg(msgSingle)
  }
};
const sendToServerOneMsg = (msgSingle) => {
  if (currentDialogInfo.value.type === 'Single') {
    socket.emit(
        SocketEvent.CHAT_MSG_SINGLE,
        {
          toUserId: Number.parseInt(currentDialogInfo.value.id),
          fromUserId: user.value.userId,
          msg: msgSingle,
          msgType: msgSingle.type,
        },
        () => {
          console.log("发送成功");
        }
    );
  } else if (currentDialogInfo.value.type === 'Multi') {
    socket.emit(
        SocketEvent.CHAT_MSG_MULTI,
        {
          toChatRoomId: currentDialogInfo.value.id,
          fromUserId: user.value.userId,
          msg: msgSingle,
          joinUserIds: currentDialogInfo.value.joinIds,
        },
        () => {
          console.log("发送成功");
        }
    );
  }
}

</script>

<style scoped>
::v-deep(textarea) {
  background: rgb(245, 245, 245);
  box-shadow: none;
  height: 100%;
  flex: 1;
}

::v-deep(textarea:focus) {
  box-shadow: none;
}

::v-deep(textarea:hover) {
  box-shadow: none;
}

.edit-area:focus-visible {
  border: none;
  outline: none;
}
</style>
