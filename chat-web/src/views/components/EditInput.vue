<template>
  <div contenteditable="true"
       class="flex-1 edit-area flex flex-wrap"
       @input="handleInput"
       @paste="handlePaste"
       ref="editRef">
  </div>
</template>
<script setup>
import {inject, onMounted, reactive, ref, watch} from "vue";
import uploadFileHook from "@/utils/uploadFileHook.js";
import html2canvas from "html2canvas";

const icon =`<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M34 24H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 15H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 33H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const imgSrcList = reactive([]);
const {uploadFile} = uploadFileHook()


watch(uploadFile,async newVal => {
  console.log(uploadFile)
  for (let i = 0; i < newVal.length; i++) {
    const {name, id} = newVal[i].file;
    const dom =await createDom(name,id);
    editRef.value.append(dom)
    const canvas = await html2canvas(dom);
    editRef.value.append(canvas)
    editRef.value.removeChild(dom)
  }
  moveSelection();
})

const createDom = async (name,id) => {
  const notes = document.createElement('notes')
  notes.setAttribute('theme','outline')
  notes.setAttribute('size','24')
  notes.style.fill = '#333'
  const dom = document.createElement('div')
  dom.className = `w-[210px] h-[50px] ${id} bg-white border text-xs flex items-center p-2`
  dom.id = `single`
  dom.innerHTML = icon
  dom.append(`<span>name</span>`)
  return dom;
}


const socket = inject("socket");
/**
 * 检查一下是否有文件元素。如果有要一起删除
 * @param e
 */
const handleInput = (e) => {
  const range = window.getSelection().getRangeAt(0)
  const {commonAncestorContainer} = range;

  if (commonAncestorContainer.parentNode.id === 'single') {
    console.log('删除了不能删除的元素')
    editRef.value.removeChild(dom)
  }
};
const editRef = ref(null);
const fileContentMap = new Map();
/**
 * 1. 获取粘贴板的内容
 * 2. 对于粘贴板内容进行过滤
 * 3. 判断粘贴内容：
 *    3.1 如果是图片，将图片存到内存中并显示出来
 *    3.2 如果是文字直接显示出来。
 * 4. 粘贴后移动光标到最后。
 * @param e
 */
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
    const {type} = pasteItem;
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
<style scoped>
img {
  @apply w-12 h-12 inline-block;
}
</style>
