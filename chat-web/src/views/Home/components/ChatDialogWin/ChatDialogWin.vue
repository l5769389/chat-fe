<template>
  <div class="flex flex-col h-full">
    <template v-if="activeDialogId !== ''">
      <div class="h-12">
        <dialog-header />
      </div>
      <div
        class="border border-l-0 border-r-0"
        style="height: calc(100% - 11rem)"
      >
        <dialog-wrapper />
      </div>
      <div class="h-60 flex flex-col">
        <enum-input></enum-input>
        <dialog-input />
      </div>
    </template>
    <template v-else></template>
  </div>
</template>

<script setup>
import { computed, defineComponent } from "vue";
import DialogHeader from "@/views/Home/components/ChatDialogWin/compnents/DialogHeader.vue";
import DialogInput from "@/views/Home/components/ChatDialogWin/compnents/DialogInput.vue";
import DialogWrapper from "@/views/Home/components/ChatDialogWin/compnents/DialogWrapper.vue";
import EnumInput from "./compnents/EnumInput.vue";
import { useStore } from "vuex";
const store = useStore();
const activeDialogId = computed(() => store.getters.currentDialogInfo);
</script>

<style scoped></style>
