import {computed, reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


const searchKey = ref('')
const checkedFriendIds = reactive({})



export default function (){
    const store = useStore()
    const router = useRouter()
    const friends = computed(() => store.getters.friends)
    const friendsList = computed(() => friends.value.map(item => {
        return {
            avatar: item.avatar,
            nickname: item.nickname,
            userId: item.userId
        }
    }))
    const checkedFriendsInfo = computed(() => {
        let arr = [];
        for (const [id, v] of Object.entries(checkedFriendIds)) {
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
        checkedFriendIds[id] = false
    }
    return {
        searchKey,
        checkedFriendIds,
        checkedFriendsInfo,
        filtered_friends,
        remove_checked
    }

}