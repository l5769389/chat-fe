<template>
    
  <div class="w-52 bg-gray-100 h-100 overflow-auto relative border border-solid border-black">
        <div class="overflow-hidden bg-dark-200 h-full">
            <address-list-wrapper/>
        </div>
    </div>
    <div class="flex-1 bg-dark-200 flex justify-center items-center">
        <wechat theme="outline" size="80" fill="rgb(235,235,235)"/>
    </div>
</template>

<script setup>
import AddressListWrapper from './components/AddressListWrapper.vue';
import { Wechat } from '@icon-park/vue-next';
</script>

<style scoped></style>