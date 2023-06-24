import engine from 'store/src/store-engine';

import sessionStorage from 'store/storages/sessionStorage';
import localStorage from 'store/storages/localStorage'
// import cookieStorage from 'store/storages/cookieStorage';

import defaultPlugin from 'store/plugins/defaults';
// import expiredPlugin from 'store/plugins/expire';
// import eventsPlugin from 'store/plugins/events';

// 切换存储方式
// const storages = [sessionStorage, cookieStorage];
const storages = [localStorage];
const plugins = [defaultPlugin];

const webStorage = engine.createStore(storages, plugins);

export default webStorage;