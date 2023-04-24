<template>
    <div class="w-100 box-border pl-5 pr-5">
        <el-input
            v-model="searchKey"
            size="large"
            placeholder="Please Input"
            :suffix-icon="Search"
        />
    </div>
</template>

<script setup>
import {ref} from "vue";
import {Search} from "@icon-park/vue-next";

const searchKey = ref('')
</script>

<style scoped>

</style>