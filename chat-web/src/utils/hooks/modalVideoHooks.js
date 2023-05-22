import {computed} from "vue";
import store from '@/store/index.js'
let invite_info = {
    videoRoomId : '',
    oppositeUserId: '',
    userId: '',
}
export default  function () {
    const videoModalFlag = computed(() => store.state.showVideoModal)
    const showVideoModal = function () {
        store.commit('setShowVideoModal',true)
    }
    const hideVideoModal = function () {
        store.commit('setShowVideoModal',false)
    }
    const setInviteVideoInfo = function (val) {
       Object.assign(invite_info,val)
    }
    return {
        videoModalFlag,
        showVideoModal,
        hideVideoModal,
        invite_info,
        setInviteVideoInfo
    }
}