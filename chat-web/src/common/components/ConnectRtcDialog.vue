<script setup>
import {ref} from "vue";

const connectRTC = ref(true)

const invokeRTCDialog = () => {
    connectRTC.value = true
}
</script>

<template>
    <el-dialog
            v-model="connectRTC"
            title="Tips"
            width="30%"
            :show-close="false"
    >
        <span>This is a message</span>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="connectRTC = false">Cancel</el-button>
        <el-button type="primary" @click="connectRTC = false">
          Confirm
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>