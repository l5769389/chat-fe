<script setup>
  const props = defineProps({
      avatars:{
          type:Array,
      }
  })
</script>

<template>

    <div v-if="avatars.length > 1" class="w-full h-full p-1 grid grid-cols-3 grid-rows-3 bg-white">
        <el-avatar :fit="'fill'" v-for="avatar in avatars" :key="avatar" :size="15"  shape="square" :src="avatar" />
    </div>
    <div class="w-[35px] h-[35px]" v-else>
      <el-avatar :fit="'cover'" :size="35"  shape="square" :src="avatars[0]" />
    </div>
</template>

<style scoped>

</style>