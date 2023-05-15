<template>
    <template v-if="useType === 'shortMsg'">
        <div class="h-20 flex items-center  box-border p-1 w-52" @click="$emit('click', dialogInfo.userId)">
            <div class="w-10 flex justify-center items-center mr-2">
                <el-badge :value="dialogInfo.msgInfo.count" :hidden="dialogInfo.msgInfo.count === 0">
                    <el-avatar shape="square" :size="40" :src="dialogInfo.avatar" />
                </el-badge>
            </div>
            <div class="flex-1 overflow-hidden">
                <div class="flex justify-between">
                    <span class="text-black font-bold">{{ dialogInfo.nickname }}</span>
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
                <el-avatar shape="square" :size="35" class="mr-2" :src="dialogInfo.avatar" />
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
                    <el-checkbox size="large" v-model="checked" />
                </span>
                <div class="flex items-center  box-border p-3 w-52 h-14">
                    <el-avatar shape="square" :size="35" class="mr-2" :src="dialogInfo.avatar" />
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
                }
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
        default:false
    }
})
const emit = defineEmits(['click', 'dbClick', 'update:modelValue'])


const msgContent = computed(() => {
    const msg = props.msg
    if (msg.type === 'text') {
        return msg.content
    } else if (msg.type === 'img') {
        return '[图片]'
    }
})


const checked = computed({
    get(){
        return props.modelValue
    },
    set(val){
        emit('update:modelValue', val)
    }
})

</script>

<style scoped></style>