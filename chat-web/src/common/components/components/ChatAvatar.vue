<script setup>
  const props = defineProps({
      avatars:{
          type:Array,
      }
  })
</script>

<template>
    <div class="w-full h-full p-1" :class="avatars.length > 1 ? 'grid grid-cols-3 grid-rows-3 bg-white': ''">
        <el-avatar v-for="avatar in avatars" :key="avatar" :size="avatars.length === 1 ? 40:15"  shape="square" :src="avatar" />
    </div>
</template>

<style scoped>

</style>