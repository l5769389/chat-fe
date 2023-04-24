<template>
    <div class="bg-dark h-full flex flex-col items-center pt-20">
        <el-avatar shape="square" :size="50" :src="avatarUrl"  class="mb-10"/>
        <div v-for="item in icons" :key="item.type" class="mb-5">
            <component :is="item.type"
                       theme="outline"
                       @click="routeChange(item)"
                       :fill="activePath === item.routeName ? 'green': 'white'"
                       size="25"
                       ></component>
        </div>
    </div>
</template>
<script setup>
import {Message, AddressBook, WeixinFavorites, FolderClose, FriendsCircle} from '@icon-park/vue-next'
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
    const icons = [
        {
            type:Message,
            routeName:'/home'
        },
        {
            type:AddressBook,
            routeName:'/address'
        },
        {
            type: WeixinFavorites,
            routeName:'/favorites'
        },
        {
            type: FolderClose,
            routeName:'/folder'
        },
        {
            type: FriendsCircle,
            routeName:'/friends'
        }
    ]
const avatarUrl = ref('')
const route = useRoute()
const router = useRouter()

const activePath = ref('/')
watch(() => route.path,(newVal,oldValue) => {
    activePath.value = newVal
},{
    immediate: true
})

const routeChange = (icon) => {
        router.push(icon.routeName)
}
</script>
<style scoped>

</style>