export const electron_host = 'localhost'

export const server_host = '192.168.71.147'

// electron本机是否开启https
export const protocol: string = 'http'
export const isHttps: boolean = protocol === 'https'


// 服务端是否开启https
export const baseURL = `${protocol}://${server_host}:3000`

// 信令服务器的地址
export const baseSocketIOURL = `${protocol}://${server_host}:3001`

// 是否开启session隔离
export const openSessionIsolation = false;