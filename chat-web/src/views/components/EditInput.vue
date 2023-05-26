<template>
  <div contenteditable="true"
       class="flex-1 edit-area"
       @input="handleInput"
       @paste="handlePaste"
       @keypress="handleKeyPress"
       ref="editRef">
  </div>
</template>
<script setup>
import {inject, onMounted, reactive, ref, watch} from "vue";
import uploadFileHook from "@/utils/uploadFileHook.js";
import html2canvas from "html2canvas";
import {formatSize} from "@/utils/utils.js";

const icon = `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M34 24H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 15H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 33H14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const imgSrcList = reactive([]);
const {uploadFile} = uploadFileHook()
onMounted(() => {
  moveSelection()
})
const canvas2img = (canvas) => {
  const img = new Image()
  img.width = 210
  img.height =50
  img.src = canvas.toDataURL('img/png',1)
  return img;
}

watch(uploadFile, async newVal => {
  for (let i = 0; i < newVal.length; i++) {
    const id = newVal[i].id;
    const {name, size} = newVal[i].file;
    // 需要放置的dom节点
    const dom = await createDom(name, size);
    editRef.value.append(dom)
    // 转为canvas
    const canvas = await html2canvas(dom);
    const tobeAdd = canvas2img(canvas)
    tobeAdd.style.display = 'inline-block';
    tobeAdd.className = 'file2img'
    tobeAdd.id = id;
    tobeAdd.onclick =() =>canvasClick(id)
    editRef.value.append(tobeAdd)
    editRef.value.removeChild(dom)
  }
  moveSelection();
})

const canvasClick = (id) => {
  console.log(id)
}


const createDom = async (name,  size) => {
  const notes = document.createElement('notes')
  notes.setAttribute('theme', 'outline')
  notes.setAttribute('size', '30')
  notes.style.fill = '#333'
  const sizeStr = formatSize(size)
  const dom = document.createElement('div')
  dom.className = `w-[210px] h-[50px] bg-white border text-xs flex items-center p-2`
  dom.innerHTML = icon + `<div class="flex flex-col ml-3">
                                <span>${name}</span>
                                <span>${sizeStr}</span>
                         </div>`
  return dom;
}



const socket = inject("socket");

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
  const pasteItems = e.clipboardData?.items;
  if (!pasteItems) {
    return;
  }
  const img_whites = ["image/jpeg", "image/jpg", "image/png",'jpg'];
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
      img.style.display = 'inline';
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
      if (node.className.includes('file2img')){
          // 那么其实是文件类型的内容
        const file = uploadFile.value.find(item => item.id == node.id);
        contentArr.push({
          type: 'file',
          content: file
        })
      }else {
        contentArr.push({
          type: 'img',
          content: fileContentMap.get(node.src),
          objectUrl: node.src
        })
      }
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
<style>

</style>
