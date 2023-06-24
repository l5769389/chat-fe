import {createStore} from "vuex";
import service from "@/api/index.js";
import webStorage from "../utils/webStorage.js";
import Db from '@/plugin/db/Db.js'
import {sendIpcMsg} from "@/utils/hooks/hooks.js";
import {Socket_Main_Render_Events} from "../../common/types.ts";

const db = new Db()
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
                nickname: '',
                avatar: '',
                joinIds: [],
            }, //chatList中当前位于的聊天，可能是群聊、单个用户
            socketStatus: 'close',  // 与服务器socket通讯的状态
            unreadMsgMap: {}, //未读消息
            totalMsgMap: {},  //所有消息
            chatList: [],  // 用户点击通讯录产生的对话id,
            showVideoModal: false,
            /**
             *  1. 视频发送者： '' 空, inviting 邀请中，connecting 连接中, connected 连接上
             *  2. 视频接受者： ‘’ 空， beInvited 接受邀请，connecting 连接中， connected 连接上
             */
            videoStatus: ''
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

        groupFriends: state => {
            return state.groupFriends
        },
        chatList: state => {
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
            webStorage.remove('access_token')
            sendIpcMsg({type: Socket_Main_Render_Events.disconnect, msg: null})
        },
        setCurrentDialog(state, payload) {
            // 设置当前激活的会话框。需要将该id未读的消息清空。
            state.currentDialogInfo = payload
            this.commit('clearUnreadMsg', state.currentDialogInfo.id)

            this.dispatch('get_db_total_msg', {
                chatId: payload.id,
                limit: 20
            })
        },
        setSocketStatus(state, payload) {
            state.socketStatus = payload
        },
        addUnreadMsgMap(state, {...params}) {
            // chatId fromUserId
            const {chatId, userId} = params;
            const arr = state.unreadMsgMap[chatId]
            if (arr) {
                state.unreadMsgMap[chatId].push({
                    ...params
                })
            } else {
                state.unreadMsgMap[chatId] = [
                    {
                        ...params
                    }
                ]
            }
            this.dispatch('update_db_unread_msg', params)
        },
        clearUnreadMsg(state, chatId) {
            state.unreadMsgMap[chatId] = [];
            this.dispatch('clear_db_unread_msg', chatId)
        },
        addTotalMsgMap(state, params) {
            const {chatId, ...msg} = params;
            const arr = state.totalMsgMap[chatId]
            if (arr) {
                state.totalMsgMap[chatId].push(msg)
            } else {
                state.totalMsgMap[chatId] = [msg]
            }
            this.dispatch('update_db_total_msg', params)

        },
        async updateChatList(state, {...newChat}) {
            const onTop = newChat.onTop;
            if (state.chatList.length === 0) {
                return state.chatList.unshift(newChat)
            }
            // 已有的列表中是否含有新添加的
            const index = state.chatList.findIndex(item => item.id === newChat.id)
            const lastOnTopIndex = state.chatList.findLastIndex(item => item.onTop === true);
            console.log(lastOnTopIndex);
            if (index === -1) {
                // 说明是从通讯录中点过来的，直接加入到未置顶的第一个。
                state.chatList.splice(lastOnTopIndex + 1, 0, newChat)
            } else {
                // 已有，且置顶
                let chatItem = state.chatList.splice(index, 1)[0];
                chatItem.onTop = onTop;
                if (onTop) {
                    state.chatList.unshift(chatItem);
                } else {
                    state.chatList.splice(lastOnTopIndex + 1, 0, chatItem)
                }
            }
            await this.dispatch('update_db_chatList')
        },
        async removeChatList(state, {...newChat}) {
            const index = state.chatList.findIndex(item => item.id === newChat.id)
            if (index === -1) {
                return;
            } else {
                state.chatList.splice(index, 1)
            }
            await this.dispatch('update_db_chatList')
        },
        setGroupFriends(state, payload) {
            state.groupFriends = payload
        },
        setShowVideoModal(state, payload) {
            state.showVideoModal = payload
        },
        setVideoStatus(state, paylaod) {
            state.videoStatus = paylaod;
        },
        onTopChatList(state, payload) {
            this.commit('updateChatList', {
                id: payload,
                onTop: true,
            })
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
            const token = webStorage.get('access_token')
            if (!state.isLogin && token) {
                await dispatch('loginByToken')
                return true
            } else {
                return false
            }
        },
        async getUnfriendInfo({state, commit}, userIds) {
            if (userIds?.length === 0) {
                return;
            }
            const groupFriends = Object.keys(state.groupFriends)
            const unKnownFriends = userIds.filter(item => !groupFriends.includes(item))
            const res = await service.get('/api/users', {
                params: {
                    ids: unKnownFriends + ''
                }
            })
            commit('setGroupFriends', res)
        },
        async createRoom({state}, joinIds) {
            const createUserId = state.user.userId;
            const joinIds_str = joinIds.map(item => Number.parseInt(item)).join(',')
            const res = await service.post('/chat-room', {
                createUserId: createUserId,
                joinUserId: joinIds_str,
                chatRoomName: 'default11'
            })
            return res.data
        },
        async updateRecentChat({state, commit, dispatch}, payload) {
            commit('updateChatList', payload)
        },


        async update_db_chatList({state}) {
            // 查询用户的所有最近聊天联系人
            await db.put('chatList', state.user.userId, {
                chatId: state.user.userId,
                recent: JSON.stringify(state.chatList),
            })
        },
        async clear_db_unread_msg({state, commit, dispatch}, chatId) {
            await db.deleteKey('unreadMsg', {
                chatId: chatId
            });
        },
        async deleteMsgByChatId({state, commit}, condition) {
            const temp = {
                id: condition.chatId
            }
            await commit('removeChatList', temp)
            commit('setCurrentDialog', {
                type: 'Single', //Single or Multi
                id: '', //Single为 userId
                nickname: '',
                avatar: '',
                joinIds: [],
            })
            await db.deleteKey('totalMsg', condition)
        },
        async update_db_unread_msg({state, commit, dispatch}, payload) {
            // 收到未读消息的时候放入db
            await db.add('unreadMsg', payload)
        },
        async update_db_total_msg({state, commit, dispatch}, payload) {
            // 同时更新用户的所有消息进入db
            await db.add('totalMsg', payload)
        },
        async get_db_chatList({state, commit, dispatch}) {
            const userChatId = state.user.userId;
            const chatList = await db.queryOne('chatList', {
                chatId: userChatId
            })
            try {
                state.chatList = JSON.parse(chatList.recent)
            } catch (e) {
                state.chatList = []
            }
        },

        async get_db_unread_msg({state, commit, dispatch}, chatId) {
            state.unreadMsgMap[chatId] = await db.query({
                schema: 'unreadMsg', chatId, limit: 99
            }) || [];
        },

        async get_db_total_msg({state, commit, dispatch}, {chatId, limit = 1}) {
            state.totalMsgMap[chatId] = await db.query({
                schema: 'totalMsg', limit, chatId,
            }) || [];
        },
        async get_db_info({state, commit, dispatch}) {
            await dispatch('get_db_chatList')
            for (const chatItem of state.chatList) {
                await dispatch('get_db_total_msg', {chatId: chatItem.id, limit: 1})
                await dispatch('get_db_unread_msg', chatItem.id)
            }
        }
    }
})