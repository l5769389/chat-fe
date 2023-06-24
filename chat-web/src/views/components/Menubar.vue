<template>
    <div class="bg-dark h-full flex flex-col items-center pt-[20px] pb-[20px]">
        <el-avatar shape="square" :size="35" :src="avatar" class="mb-10"/>
        <div v-for="item in icons" :key="item.type" class="mb-5">
            <component :is="item.type"
                       theme="outline"
                       @click="routeChange(item)"
                       :class="activePath === item.routeName ? 'fill-active !text-active': 'fill-iconFill !text-iconFill'"
                       size="22"
            ></component>
        </div>
      <el-popover placement="right"  trigger="click" :effect="'dark'">
        <template #reference>
          <setting-two size="25" theme="outline" class="mt-auto  !text-iconFill"  @click=""/>
        </template>
        <div>
            <div class="bg-dark hover:bg-dark-active h-[30px] flex items-center" @click="logout">退出登录</div>
        </div>
      </el-popover>

    </div>
</template>
<script setup>
import {Message, AddressBook, WeixinFavorites, FolderClose, FriendsCircle,SettingTwo} from '@icon-park/vue-next'
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import store from "@/store/index.js";
const icons = [
    {
        type: Message,
        routeName: '/'
    },
    {
        type: AddressBook,
        routeName: '/address'
    },
    // {
    //     type: WeixinFavorites,
    //     routeName: '/favorites'
    // },
    // {
    //     type: FolderClose,
    //     routeName: '/folder'
    // },
    // {
    //     type: FriendsCircle,
    //     routeName: '/friends'
    // },
]
const route = useRoute()
const router = useRouter()

const activePath = ref('/')
watch(() => route.path, (newVal, oldValue) => {
    activePath.value = newVal
}, {
    immediate: true
});

const user = computed(() =>  store.getters.user)
const avatar = computed(() => user.value.avatar)

const routeChange = (icon) => {
    router.push(icon.routeName)
}

const logout = () => {
    store.commit('logout')
    router.push('/login')
}
</script>
<style scoped>


</style>