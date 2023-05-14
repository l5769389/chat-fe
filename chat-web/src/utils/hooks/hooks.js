import {computed, reactive, inject, onBeforeMount, onMounted, watch, ref} from "vue";
import {useStore} from "vuex";
import {getFormatTime, buffer2base64, base642File} from "@/utils/utils.js";

const getDialogInfoHook = function () {
    const store = useStore()
    const friends = computed(() => store.getters.friends)
    const currentDialogUserId = computed(() => store.getters.currentDialogUserId)
    const currentDialogUserInfo = computed(() => {
        const friend = friends.value.find(item => item.userId == currentDialogUserId.value)
        return {
            userId: currentDialogUserId.value,
            avatar: friend?.avatar || '',
            nickname: friend?.nickname || ''
        }
    })

    const currentDialogDetails = computed(() => store.getters.currentDialogDetails)
    const messageRef = computed(() => {
        return {
            avatar: currentDialogUserInfo.value.avatar,
            userId: currentDialogUserInfo.value.userId,
            nickName: currentDialogUserInfo.value.nickname,
            message: currentDialogDetails.value,
        }
    })
    return {
        currentDialogUserId,
        currentDialogUserInfo,
        currentDialogDetails,
        messageRef
    }
}


const sockInitHook = function () {
    const socket = inject("socket");
    const store = useStore();
    const isLogin = computed(() => store.getters.isLogin);
    const user = computed(() => store.getters.user);
    const currentDialogUserId = computed(() => store.getters.currentDialogUserId);
    watch(
        () => isLogin.value,
        (newVal, oldValue) => {
            if (newVal) {
                initSocket();
            } else {
                socket.disconnect();
            }
        }
    );

    const initSocket = () => {
        socket.on("connect", () => {
            store.commit("setSocketStatus", "connect");
            console.log(
                `当前用户的userId为:${user.value.userId},socketId为：${socket.id}`
            );
            socket.emit(
                "connected",
                {
                    userId: user.value.userId,
                },
                () => {
                    console.log("发送成功");
                }
            );
        });
        socket.on("disconnect", () => {
            store.commit("setSocketStatus", "disconnect");
        });
        socket.on("connect_error", () => {
            store.commit("setSocketStatus", "connect_error");
        });

        socket.on("msg", (data) => {
            const {fromUserId, msg: {type, content}, timestamp} = data;
            console.log(`收到服务器推送的${type}类型消息`)
            let imgUrl;
            if (type === 'img') {
                let image = buffer2base64(content)
                const file = base642File(image)
                imgUrl = window.URL.createObjectURL(file)
            }
            // 当前窗口就在与该用户的会话窗口
            if (currentDialogUserId.value != fromUserId) {
                store.commit("addUnreadMsgMap", {
                    userId: fromUserId,
                    content: {
                        type: type,
                        content: type === 'img' ? imgUrl : content,
                        timestamp: getFormatTime(timestamp),
                    },
                    type: type,
                    source: "other",
                    messageId: new Date().getTime(),
                });
            }
            store.commit("addTotalMsgMap", {
                userId: fromUserId,
                content: {
                    type: type,
                    content: type === 'img' ? imgUrl : content,
                    timestamp: getFormatTime(timestamp),

                },
                messageId: new Date().getTime(),
                source: "other",
            });
        });


        socket.connect();
    };
}

export {
    getDialogInfoHook,
    sockInitHook,
}