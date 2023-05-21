<script setup>

import WaitForConnect from "@/common/components/connectRtcDialog/components/WaitForConnect.vue";
import {ref} from "vue";
import Connecting from "@/common/components/connectRtcDialog/components/Connecting.vue";

defineEmits(['update:showConnect'])
defineProps(['showConnect'])

const acceptConnectRef = ref(true)


</script>

<template>
  <el-dialog
      :model-value="showConnect"
      width="100%"
      class="max-w-[350px] no-header"
      :show-close="false"
      :close-on-click-modal="false"
  >
    <div class="w-full h-[600px] max-h-full">
      <wait-for-connect v-if="!acceptConnectRef"></wait-for-connect>
      <connecting v-else></connecting>
    </div>
  </el-dialog>
</template>

<style>

.no-header .el-dialog__header {
  padding:0;
}
.no-header .el-dialog__body {
  padding:0;
}

</style>