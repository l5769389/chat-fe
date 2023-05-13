<script setup>
import { sockInitHook } from '@/utils/hooks'
import AddressListWrapper from '@/views/Address/components/AddressListWrapper.vue';
import { ElAvatar } from 'element-plus';
import  Removable  from '@/common/components/Removable.vue'
sockInitHook()
const addUserFlag = ref(true)
const checkedUserRef = ref([])
const handleCheckedUser = (list) => {
  checkedUserRef.value = list
}
const handleRemove = (item) => {
  console.log(item)
}
</script>

<template>
  <router-view></router-view>

  <el-dialog class="no-header" v-model="addUserFlag" width="600px" :before-close="handleClose" :modal="false"
    :show-close="false">
    <div class="h-[400px] w-full divide-x-2 flex overflow-hidden">
      <div class="flex-1 w-0 border-box">
        <address-list-wrapper :canSelect="true" @update:checked="handleCheckedUser"></address-list-wrapper>
      </div>
      <div class="flex-1 flex flex-col w-0 pl-2">
        <div class="flex-1">
          <div class="flex justify-between">
            <span>选择联系人</span>
            <span>已选择{{ checkedUserRef.length }}个联系人</span>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-3 max-h-[200px] justify-items-center items-center">
            <div class="w-min" v-for="(item, index) in checkedUserRef" :key="index">
                  <removable @remove="handleRemove(item)">
                    <div class="flex flex-col justify-center items-center">
                        <el-avatar shape="square" :src="item.avatar" :size="30"></el-avatar>
                        <span class="max-w-[50px] overflow-ellipsis overflow-hidden whitespace-nowrap">{{ item.nickname }}</span>
                    </div>
                  </removable>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <el-button>确定</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scope>
.no-header .el-dialog__header {
  display: none;
}

.no-header .el-dialog__body {
  @apply pt-4 pb-4
}
</style>
