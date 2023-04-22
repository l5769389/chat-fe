<template>
    <div class="bg-gray-500 h-full">
        <div v-for="item in icons" :key="item.type">
            <component :is="item.type" theme="outline" size="32" fill="#000000"></component>
        </div>
    </div>
</template>
<script setup>
import {CheckOne} from '@icon-park/vue-next'
    const icons = [
        {
            type:CheckOne
        }
    ]
</script>
<style scope></style>