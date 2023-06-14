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
        console.log(`db中插入消息：${schema}: ${JSON.stringify(data)}`)
        await this.db[schema].add(data)
    }

    async put(schema, data) {
        await this.db[schema].put(data)
    }

    async queryOne(schema, key) {
        return await this.db[schema].get(1);
    }

    async query({schema, chatId, offset = 0, limit = 10}) {
        console.log(`query db :${schema},${chatId}`)
        return await this.db[schema].where('chatId').equals(chatId).offset(offset).limit(limit).toArray()
    }

    async delete({scheme}) {
        if (this.db[scheme]) {
            await this.db[scheme].delete()
        }
    }
}