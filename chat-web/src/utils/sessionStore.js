import engine from 'store/src/store-engine';

import sessionStorage from 'store/storages/sessionStorage';
// import cookieStorage from 'store/storages/cookieStorage';

import defaultPlugin from 'store/plugins/defaults';
// import expiredPlugin from 'store/plugins/expire';
// import eventsPlugin from 'store/plugins/events';

// const storages = [sessionStorage, cookieStorage];
const storages = [sessionStorage];
const plugins = [defaultPlugin];

const sessionStore = engine.createStore(storages, plugins);

export default sessionStore;