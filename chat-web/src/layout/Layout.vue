<template>
    <div class="flex h-full">
        <div class="w-20">
            <menubar/>
        </div>
        <router-view/>
    </div>
</template>

<script setup>
import Menubar from "../views/components/Menubar.vue";
</script>

<style scoped>

</style>