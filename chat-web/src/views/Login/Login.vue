<template>
  <div class="flex w-full h-full justify-center items-center">
      <el-tabs v-model="activeTab" class="demo-tabs" >
          <el-tab-pane label="Form" name="form">
                <div class="w-80 h-40">
                    <form-login/>
                </div>
          </el-tab-pane>
          <el-tab-pane label="QR" name="qr">
              <div class="w-80 h-40">
                  <q-r-login/>
              </div>
          </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script setup>
  import {ref} from "vue";
  import FormLogin from "@/views/Login/components/FormLogin.vue";
  import QRLogin from "@/views/Login/components/QRLogin.vue";

  const activeTab = ref('form')
</script>

<style scoped>

</style>