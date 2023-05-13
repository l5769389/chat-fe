import { ref } from "vue"
const showAddMore = ref(false)
const toggleShowAddMoreHook = function () {
    showAddMore.value = !showAddMore.value
}

export {
    showAddMore,
    toggleShowAddMoreHook
} 