<template>
  <div class="w-full  flex justify-center items-center pl-3 pr-3">
    <el-input size="small" v-model="searchKey" placeholder="搜索" class="bg-gray" :prefix-icon="Search"/>
    <div
        class="w-[30px] h-[25px] flex justify-center items-center bg-white-250 ml-[10px] rounded-sm hover:bg-white-250-active">
      <plus @click="showGroupChatModal" v-if="iconType === 'home'" theme="outline" size="20" fill="#333"/>
      <people-plus-one @click="showSearchNewFriend" v-else-if="iconType ==='address'" theme="outline" size="20" fill="#333"/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {Search, Plus, PeoplePlusOne} from "@icon-park/vue-next";
import {useRoute} from "vue-router";

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const route = useRoute();
const iconType = computed(() => {
  return route.name;
})
const searchKey = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})


const showGroupChatModal = () => {

}
const showSearchNewFriend = () => {

}
</script>

<style scoped>
.bg-gray ::v-deep(.el-input__wrapper) {
  @apply bg-white-250
}

</style>