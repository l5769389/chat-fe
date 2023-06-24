import Dexie from "dexie";

const schemas = {
    totalMsg: '++id,chatId,userId,type,timestamp',
    unreadMsg: '++id,chatId,userId,type,timestamp',
    chatList: 'chatId'
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

    async put(schema,key,val) {
        await this.db[schema].put(val,key)
    }

    async queryOne(schema, condition) {
        return await this.db[schema].where(condition).first();
    }

    async query({schema, chatId, offset = 0, limit = 10}) {
        console.log(`query db :${schema},${chatId}`)
        return await this.db[schema].where('chatId').equals(chatId).offset(offset).limit(limit).toArray()
    }

    async deleteSchema(scheme) {
        if (this.db[scheme]) {
            await this.db[scheme].delete()
        }
    }
    async deleteKey(schema,condition){
        await this.db[schema]?.where(condition).delete()
    }
}