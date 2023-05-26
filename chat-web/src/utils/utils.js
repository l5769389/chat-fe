const getFormatTime = (date = new Date().getTime()) => {
    date = new Date(date)
    return `${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`
}

const buffer2base64 = buffer => {
    return "data:image/png;base64," + btoa(new
        Uint8Array(buffer).reduce((res, byte) => res + String.fromCharCode(byte), ''))
}

const base642File = (dataurl, filename = 'file') => {
    //将base64格式分割：['data:image/png;base64','XXXX']
    const arr = dataurl.split(',')
    // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    const mime = arr[0].match(/:(.*?);/)[1]  //image/png
    //[image,png] 获取图片类型后缀
    const suffix = mime.split('/')[1] //png
    const bstr = atob(arr[1])   //atob() 方法用于解码使用 base-64 编码的字符串
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

const formatSize = (size) => {
    if (size < 1024){
        return `${size}b`
    }else if (size < 1024 * 1024){
        return `${(size/ 1024).toFixed(1)}Kb`
    }else if (size < 1024 * 1024 * 1024){
        return `${(size/ (1024 * 1024)).toFixed(1)}Mb`
    }
}

export {
    getFormatTime,
    buffer2base64,
    base642File,
    formatSize
}