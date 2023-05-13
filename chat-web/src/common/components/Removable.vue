<template>
    <div class="relative">
        <close-small @click="$emit('remove')" theme="outline" size="15"  class="absolute right-[-7px] top-[-7px] bg-dark-300 rounded-full fill-current hover:bg-dark-400-hover"/>
                <slot></slot>
    </div>
</template>
<script setup>
import { CloseSmall } from '@icon-park/vue-next';
defineEmits(['remove'])
</script>
<style scope></style>