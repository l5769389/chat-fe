<template>
    <template v-if="useType === 'shortMsg'">
        <div class="h-[60px] flex items-center  box-border p-1 w-52" @click="$emit('click', dialogInfo.userId)">
            <div class="w-[50px] h-full flex justify-center items-center">
                <el-badge class="w-full h-full" :value="dialogInfo.msgInfo.count" :hidden="dialogInfo.msgInfo.count === 0">
                    <chat-avatar  :avatars="msgType === 'Single' ? [dialogInfo.avatar]: avatars"></chat-avatar>
                </el-badge>
            </div>
            <div class="ml-1 flex-1 h-full overflow-hidden">
                <div class="flex justify-between">
                    <span class="text-black font-bold">{{dialogInfo.nickname }}</span>
                    <span class="text-gray-400">{{ dialogInfo.msgInfo.timestamp }}</span>
                </div>
                <p class="overflow-ellipsis overflow-hidden whitespace-nowrap min-w-full">{{ msgContent }}</p>
            </div>
        </div>
    </template>
    <template v-else-if="useType === 'address'">
        <!-- 通讯录中的 -->
        <el-badge class="hover:bg-dark-400-hover" :hidden="true" @dblclick="$emit('dbClick', dialogInfo.userId)">
            <div class="h-20 flex items-center  box-border p-3 w-52">
                <el-avatar shape="square" :size="35" class="mr-2" :src="dialogInfo.avatar"/>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <span class="text-black font-bold">{{ dialogInfo.nickname }}</span>
                    </div>
                </div>
            </div>
        </el-badge>
    </template>
    <template v-else-if="useType === 'select'">
        <!-- 可选择的 -->
        <el-badge class="hover:bg-dark-400-hover" :hidden="true">
            <div class="flex items-center pl-5">
                <span>
                    <el-checkbox size="large" v-model="checked"/>
                </span>
                <div class="flex items-center  box-border p-3 w-52 h-14">
                    <el-avatar shape="square" :size="35" class="mr-2" :src="dialogInfo.avatar"/>
                    <div class="flex-1">
                        <div class="flex justify-between">
                            <span class="text-black font-bold">{{ dialogInfo.nickname }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-badge>
    </template>
</template>

<script setup>
import {computed} from "vue";
import ChatAvatar from "@/common/components/components/ChatAvatar.vue";

const props = defineProps({
    dialogInfo: {
        type: Object,
        default: function () {
            return {
                avatar: '',
                nickname: '',
                userId: -1,
                msgInfo: {
                    count: 0,
                    timestamp: ''
                },
                group: []
            }
        }
    },
    msg: {
        type: Object,
        default: function () {
            return {
                type: "text",
                content: ''
            }
        }
    },
    useType: {
        validator(value) {
            return ['shortMsg', 'address', 'select'].includes(value)
        },
        default() {
            return 'shortMsg'
        }
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    msgType: {
        validator(value) {
            return ['Single', 'Multi'].includes(value)
        },
        default() {
            return 'Single'
        }
    }
})
const emit = defineEmits(['click', 'dbClick', 'update:modelValue'])
const avatars = computed(() => {
    return props.dialogInfo.group.map(item => {
        return item.avatar
    })
})

const msgContent = computed(() => {
    const msg = props.msg
    if (msg.type === 'text') {
        return msg.content
    } else if (msg.type === 'img') {
        return '[图片]'
    } else if (msg.type === 'file'){
      return '[文件]'
    }
})


const checked = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

</script>

<style scoped></style>