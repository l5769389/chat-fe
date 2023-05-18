import {createStore} from "vuex";
import service from "@/api/index.js";
import sessionStore from "../utils/sessionStore";
import _ from 'lodash'

export default createStore({
    state() {
        return {
            isLogin: false,
            user: {},    //用户信息
            friends: [], // 用户的通讯录中的所有朋友列表
            groupFriends: {}, // 用户群聊中的所有用户信息
            currentDialogInfo: {
                type: 'Single', //Single or Multi
                id: '', //Single为 userId
            }, //chatList中当前位于的聊天，可能是群聊、单个用户
            socketStatus: 'close',  // 与服务器socket通讯的状态
            unreadMsgMap: {}, //未读消息
            totalMsgMap: {},  //所有消息
            /**
             * [{
             *      type: 'Single',
             *      id: ''
             *  }]
             */
            chatList: [],  // 用户点击通讯录产生的对话id,
            recentChatIds: [], //
        }
    },
    getters: {
        isLogin: state => state.isLogin,
        user: state => state.user,
        friends: state => state.friends,
        currentDialogInfo: state => state.currentDialogInfo,
        socketStatus: state => state.socketStatus,
        unreadMsgMap: state => state.unreadMsgMap,
        totalMsgMap: state => state.totalMsgMap,
        totalChatList: state => {  //在chat页面所有的对话的chatId,有可能是userId,也有可能是groupId
            const list = [...Object.keys(state.unreadMsgMap)]
            return list
        },
        currentDialogDetails: state => {
            const d = state.totalMsgMap[state.currentDialogInfo.id] || []
            return d
        },
        recentChatIds: state => {
            return state.recentChatIds
        },
        groupFriends: state => {
            return state.groupFriends
        },
        chatList:state => {
            return state.chatList
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
            state.currentDialogInfo = payload
            state.unreadMsgMap[state.currentDialogInfo.id] = []

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
            const {chatId, content} = params;
            const arr = state.totalMsgMap[chatId]
            if (arr) {
                if (Array.isArray(content)) {
                    state.totalMsgMap[chatId] = [...arr, ...content]
                } else {
                    state.totalMsgMap[chatId].push(content)
                }
            } else {
                // 如果要存储的消息是一个数组，比如输入框中：1+ 图片 需要依次存储。
                if (!Array.isArray(content)) {
                    state.totalMsgMap[chatId] = [content]
                } else {
                    state.totalMsgMap[chatId] = content
                }
            }
        },
        addChatList(state, newUserId) {
            state.chatList.unshift(newUserId)
        },
        updateChatList(state, {...newChat}) {
            const index = state.chatList.findIndex(item => item.id === newChat.id)
            if (index === -1){
                state.chatList.unshift(newChat)
            }else {
                state.chatList.splice(index, 1)
                state.chatList = [newChat, ...state.chatList]
            }
        },
        setRecentChatIds(state, payload) {
            state.recentChatIds = payload
        },
        setGroupFriends(state, payload) {
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
        async getUnfriendInfo({commit}, userIds) {
            if (userIds?.length === 0) {
                return;
            }
            const res = await service.get('/api/users', {
                params: {
                    ids: userIds + ''
                }
            })
            commit('setGroupFriends', res)
        },
        async createRoom({state}, joinIds) {
            const createUserId = state.user.userId;
            const joinIds_str = joinIds.map(item=>Number.parseInt(item)).join(',')
            const res = await service.post('/chat-room', {
                createUserId: createUserId,
                joinUserId: joinIds_str,
                chatRoomName: 'default11'
            })
            return res.data
        },
        async updateRecentChat({state,commit, dispatch}, payload) {
            commit('updateChatList',payload)
        }
    }
})