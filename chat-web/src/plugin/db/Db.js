import Dexie from "dexie";

const schemas = {
    totalMsg: '++id,chatId,userId,type,timestamp',
    unreadMsg: '++id,chatId,userId,type,timestamp',
    chatList: '++id'
}

export default class Db {
    db

    constructor() {
        this.db = new Dexie('db');
        this.db.version(2).stores(schemas);
    }

    async add(schema, data) {
        await this.db[schema].add(data)
    }

    async put(schema, data) {
        await this.db[schema].put(data)
    }

    async queryOne(schema, key) {
        return await this.db[schema].get(1);
    }

    async query(schema, offset = 0, limit = 10) {
        return await this.db[schema].where('chatId').equals(2).offset(offset).limit(10).toArray()
    }
}