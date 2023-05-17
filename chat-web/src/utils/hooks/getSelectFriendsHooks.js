import {computed, reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const searchKey = ref('')
let checkedFriendIds = ref({})
let exceptChatUserIds = ref([]);


export default function (){
    const store = useStore()
    const router = useRouter()
    const friends = computed(() => store.getters.friends)
    const exceptChatFriends = computed(() => {
        if (exceptChatUserIds.value.length === 0){
            return  friends.value
        }
        return friends.value.filter(friend => {
            if (!exceptChatUserIds.value.includes(friend.userId)){
                return friend
            }
        })
    } )
    const friendsList = computed(() => {
        return exceptChatFriends.value.map(item => {
            return {
                avatar: item.avatar,
                nickname: item.nickname,
                userId: item.userId
            }
        })
    })
    const checkedFriendsInfo = computed(() => {
        let arr = [];
        for (const [id, v] of Object.entries(checkedFriendIds.value)) {
            if (!v) {
                continue;
            }
            const friend = friendsList.value.find(item => item.userId == id)
            arr.push({
                userId: id,
                avatar: friend.avatar,
                nickname: friend.nickname
            })
        }
        return arr;
    })
    const filtered_friends = computed(() => {
        return friendsList.value.filter(item => {
            const {userId, nickname} = item;
            if (userId.toString().includes(searchKey.value)) {
                return item
            } else if (nickname.toString().includes(searchKey.value)) {
                return item
            }
        })
    })
    const remove_checked = id => {
        checkedFriendIds.value[id] = false
    }
    const setExceptUserId = (ids) => {
        exceptChatUserIds.value = ids
    }
    const reset = () => {
        checkedFriendIds.value = {}
        exceptChatUserIds.value =[]
    }

    return {
        searchKey,
        checkedFriendIds,
        checkedFriendsInfo,
        filtered_friends,
        remove_checked,
        setExceptUserId,
        reset
    }

}