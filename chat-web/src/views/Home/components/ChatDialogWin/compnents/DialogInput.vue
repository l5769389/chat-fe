<template>
    <div class="flex flex-col flex-1">
        <edit-input ref="editInputRef"></edit-input>
        <div class="w-20 h-10 self-end">
            <el-button plain class="ml" @click="sendMsg">Send</el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import { getFormatTime } from "../../../../../utils/utils";
import EditInput from "@/views/components/EditInput.vue";
const socket = inject("socket");
const store = useStore();
const activeDialogId = computed(() => store.getters.currentDialogInfo);
const user = computed(() => store.getters.user);
const editInputRef = ref(null)
const sendMsg = () => {
    const msg = editInputRef.value.getEditContent()
    if (msg.length === 0) {
        return
    }
    // editInputRef.value.clearAllInput()
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
                }
            } else {
                return {
                    type: 'text',
                    content: item.content,
                    timestamp: getFormatTime(),
                    messageId: new Date().getTime(),
                    source: "self",
                }
            }
        })
        store.commit("addTotalMsgMap", {
            chatId: activeDialogId.value.id,
            content: mapped_msg
        });
    }
};


const sendToServer = (msg) => {
    for (const msgSingle of msg) {
        sendToServerOneMsg(msgSingle)
    }
};

const sendToServerOneMsg = (msgSingle) => {
    if (activeDialogId.value.type === 'Single'){
        socket.emit(
            "SingleMsg",
            {
                toUserId: Number.parseInt(activeDialogId.value.id),
                fromUserId: user.value.userId,
                msg: msgSingle,
                msgType: msgSingle.type,
                timestamp: new Date().getTime(),
            },
            () => {
                console.log("发送成功");
            }
        );
    } else if (activeDialogId.value.type === 'Multi'){
        socket.emit(
            "MultiMsg",
            {
                toChatRoomId: activeDialogId.value.id,
                fromUserId: user.value.userId,
                msg: msgSingle,
                msgType: msgSingle.type,
                timestamp: new Date().getTime(),
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
