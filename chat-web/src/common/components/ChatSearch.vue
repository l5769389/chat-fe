<template>
    <div class="w-full  flex justify-center items-center pl-3 pr-3 ">
            <el-input size="small"  v-model="searchKey"  placeholder="搜索" :prefix-icon="Search" />
    </div>
</template>

<script setup>
import {computed, ref} from "vue";
import { Search } from "@icon-park/vue-next";
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const searchKey = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
</script>

<style scoped></style>