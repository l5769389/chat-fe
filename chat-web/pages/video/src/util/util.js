let video_deviceId;

const getAllVideoInput = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const video_devices = devices.filter(device => {
        return device.kind === 'videoinput'
    }).map(item => item.deviceId)
    return video_devices
}


const getLocalStreamByDeviceId = async (deviceId) => {
    // 获取本地流
    const constraints = {
        video: {
            deviceId: deviceId
        },
        audio: true,
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        stream.getTracks().forEach(track => track.stop())
        console.log(deviceId, '可用')
        return true;
    } catch (e) {
        console.log(e)
        console.log(deviceId, '不可用')
        return false
    }
}


export const getUsableDevice = async () => {
    if (video_deviceId) {
        return video_deviceId;
    }
    const video_deviceIds = await getAllVideoInput()
    for (const deviceId of video_deviceIds) {
        const test_result = await getLocalStreamByDeviceId(deviceId)
        if (test_result) {
            video_deviceId = deviceId;
            break;
        }
    }
    if (video_deviceId) {
        return video_deviceId;
    } else {
        return '';
    }
}
