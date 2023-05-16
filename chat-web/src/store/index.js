import {createStore} from "vuex";
import service from "@/api/index.js";
import sessionStore from "../utils/sessionStore";
import _ from 'lodash'

export default createStore({
    state() {
        return {
            isLogin: false,
            user: {},
            friends: [], // 用户的通讯录中的所有朋友列表
            groupFriends: {}, // 用户群聊中的所有用户信息
            currentDialogUserId: '', //chatList中当前位于的聊天，可能是群聊、单个用户
            socketStatus: 'close',  // 与服务器socket通讯的状态
            unreadMsgMap: {},
            totalMsgMap: {},
            chatList: [],  // 用户点击通讯录产生的对话id,
            recentChatIds: [],
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
        },
        recentChatIds: state => {
            return state.recentChatIds
        },
        groupFriends: state => {
            return state.groupFriends
        }
    },
    mutations: {
        login(state, {user, friends}) {
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
        addUnreadMsgMap(state, {...params}) {
            const {userId} = params;
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
        addTotalMsgMap(state, {...params}) {
            const {userId, content} = params;
            const arr = state.totalMsgMap[userId]
            if (arr) {
                if (Array.isArray(content)) {
                    state.totalMsgMap[userId] = [...arr, ...content]
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
        },
        setRecentChatIds(state, payload) {
            state.recentChatIds = payload
        },
        setGroupFriends(state,payload){
            state.groupFriends = payload
        }
    },
    actions: {
        async login({commit, state, dispatch}, {username, password}) {
            await service.post('/auth/login', {
                username,
                password
            })
            await dispatch('loginByToken')
        },
        async loginByToken({commit, state}) {
            const res = await service.get('/api/user')
            commit('login', res)
        },
        async checkLogin({commit, state, dispatch}) {
            const token = sessionStore.get('access_token')
            if (!state.isLogin && token) {
                await dispatch('loginByToken')
                return true
            } else {
                return false
            }
        },
        getRecentChatIds: _.debounce(async ({commit, state, dispatch}) => {
            const list = await service.get(`/recent-chat?userId=${state.user.userId}`)
            const group = list.filter(item => item.type === 'Multi')
            let ids = [];
            group.forEach(item => {
                ids = [...ids,...item.joinIds]
            })
            ids = Array.from(new Set(ids))
            await dispatch('getUnfriendInfo', ids)
            commit('setRecentChatIds', list)
        }, 500),
        async getUnfriendInfo({commit}, userIds) {
            if (!userIds){
                return;
            }
            const res = await service.get('/api/users', {
                params: {
                    ids:userIds + ''
                }
            })
            commit('setGroupFriends',res)
        },
        async createRoom({state}, joinIds) {
            const createUserId = state.user.userId;
            const res = await service.post('/chat-room', {
                createId: createUserId,
                joinIds,
            })
            console.log(res)
        },
        async updateRecentChat({state, dispatch}, {toUserId}) {
            const res = await service.patch('/recent-chat', {
                userId: state.user.userId,
                chatType: 'single',
                id: toUserId
            })
            dispatch('getRecentChatIds')
        }
    }
})