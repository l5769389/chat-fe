import { createStore } from "vuex";
import service from "@/api/index.js";
import sessionStore from "../utils/sessionStore";
export default createStore({
    state() {
        return {
            isLogin: false,
            user: {},
            friends: [],
            currentDialogUserId: '',
            socketStatus: 'close',
            unreadMsgMap: {

            },
            totalMsgMap: {},
            chatList: []  // 用户点击通讯录产生的对话id
        }
    },
    getters: {
        isLogin: state => state.isLogin,
        user: state => state.user,
        friends: state => state.friends,
        currentDialogUserId: state => state.currentDialogUserId,
        socketStatus: state => state.socketStatus,
        unreadMsgMap: state => state.unreadMsgMap,
        totalMsgMap: state => state.totalMsgMap,
        totalChatList: state => {  //在chat页面所有的对话的userId
            const list = [...Object.keys(state.unreadMsgMap)]
            return list
        },
        currentDialogDetails: state => {
            const d = state.totalMsgMap[state.currentDialogUserId] || []
            return d
        }
    },
    mutations: {
        login(state, { user, friends }) {
            state.isLogin = true
            Object.assign(state.user, user)
            state.friends = friends
        },
        logout(state) {
            state.isLogin = false
            state.user = {}
            state.friends = []
        },
        setCurrentDialog(state, payload) {
            // 设置当前激活的会话框。需要将该id未读的消息清空。
            state.currentDialogUserId = payload
            state.unreadMsgMap[state.currentDialogUserId] = []

        },
        setSocketStatus(state, payload) {
            state.socketStatus = payload
        },
        addUnreadMsgMap(state, { ...params }) {
            const { userId } = params;
            const arr = state.unreadMsgMap[userId]
            if (arr) {
                state.unreadMsgMap[userId].push({
                    ...params
                })
            } else {
                state.unreadMsgMap[userId] = [
                    {
                        ...params
                    }
                ]
            }
        },
        addTotalMsgMap(state, { ...params }) {
            const { userId, content } = params;
            const arr = state.totalMsgMap[userId]
            if (arr) {
                if (Array.isArray(content)) {
                    state.totalMsgMap[userId] = [...arr,...content]
                } else {
                    state.totalMsgMap[userId].push(content)
                }
            } else {
                // 如果要存储的消息是一个数组，比如输入框中：1+ 图片 需要依次存储。
                if (!Array.isArray(content)) {
                    state.totalMsgMap[userId] = [content]
                } else {
                    state.totalMsgMap[userId] = content
                }
            }
        },
        addChatList(state, newUserId) {
            state.chatList.unshift(newUserId)
        },
        updateChatList(state, userId) {
            const index = state.chatList.findIndex(item => item === userId)
            state.chatList.splice(index, 1)
            state.chatList = [userId, ...state.chatList]
        }
    },
    actions: {
        async login({ commit, state, dispatch }, { username, password }) {
            await service.post('/auth/login', {
                username,
                password
            })
            await dispatch('loginByToken')
        },
        async loginByToken({ commit, state }) {
            const res = await service.get('/api/user')
            commit('login', res)
        },

        async checkLogin({ commit, state, dispatch }) {
            const token = sessionStore.get('access_token')
            if (!state.isLogin && token) {
                await dispatch('loginByToken')
                return true
            } else {
                return false
            }
        }
    }
})