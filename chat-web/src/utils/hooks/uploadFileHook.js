import {reactive, ref} from "vue";

let uploadFile = ref({})
export default function () {
    const addUploadFile = (files) => {
        uploadFile.value = Array.from(files).map((item,i) => {
           return {
               id: i,
               file: files[i]
           }
        })
    }
    const removeUploadFile = (id) => {

    }
    return {
        uploadFile,
        addUploadFile,
    }
}