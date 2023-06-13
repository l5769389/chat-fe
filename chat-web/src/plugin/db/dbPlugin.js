import Db from './Db.js'

export default {
    install: (app) => {
        const db = new Db()
        app.config.globalProperties.$db = db;
        app.provide("db", db);
    }
}