import service from "@/api/index.js";
import {baseURL} from "/common/config.ts";

const API = {
    uploadFile: async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await service({
            url: '/file',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: file
        })
        if (res.data) {
            return res.data
        }
    },
    downloadFile: async (filePath) => {
        window.open(`${baseURL}/file?filePath=${filePath}`,'_self');
    }
}


export default API