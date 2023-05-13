<template>
    <div contenteditable="true" class="flex-1 edit-area" @keyup.enter="sendMsg" @input="handleInput" @paste="handlePaste"
        ref="editRef">
    </div>
</template>
<script setup>
import { ref } from "vue";
const imgSrcList = reactive([]);

const socket = inject("socket");
const handleInput = (e) => {
    console.log("input");
};
const editRef = ref(null);
const fileContentMap = new Map();
const handlePaste = (e) => {
    console.log("paste");
    const pasteItems = e.clipboardData?.items;
    if (!pasteItems) {
        return;
    }
    const img_whites = ["image/jpeg", "image/jpg", "image/png"];
    const text_whites = ["text/plain"];
    const whites = [...img_whites, ...text_whites];
    const filter_pasteItems = Array.from(pasteItems).filter((pasteItem) => {
        if (whites.includes(pasteItem.type)) {
            return pasteItem;
        }
    });
    for (const pasteItem of filter_pasteItems) {
        const { kind, type } = pasteItem;
        const file = pasteItem.getAsFile();
        if (img_whites.includes(type)) {
            const imgUrl = window.URL.createObjectURL(file);
            const img = document.createElement("img");
            img.src = imgUrl;
            fileContentMap.set(imgUrl, file);
            editRef.value.append(img);
        } else if (text_whites.includes(type)) {
            const content = e.clipboardData.getData("text/plain");
            e.preventDefault();
            const span = document.createElement("span");
            span.innerText = content;
            editRef.value.append(span);
        } else {
            e.preventDefault();
            return;
        }
    }
    moveSelection();
    getEditContent();
};

const moveSelection = () => {
    editRef.value.focus();
    const range = window.getSelection();
    range.selectAllChildren(editRef.value);
    range.collapseToEnd();
};


const getEditContent = () => {
    let contentArr = []
    const childrenNodes = editRef.value.childNodes;
    for (const node of childrenNodes) {
        if (node.nodeName === "#text") {
            contentArr.push({
                type: 'text',
                content: node.nodeValue
            })
        } else if (node.tagName === 'SPAN') {
            contentArr.push({
                type: 'text',
                content: node.innerText
            })
        } else if (node.tagName === 'IMG') {
            contentArr.push({
                type: 'img',
                content: fileContentMap.get(node.src),
                objectUrl: node.src
            })
        }
    }
    return contentArr;
};

const clearAllInput = () => {
    editRef.value.innerHTML = ''
}
defineExpose({
    getEditContent,
    clearAllInput
})
</script>
<style scope>
img {
    @apply w-12 h-12 inline-block;
}
</style>
