import { createClient, RedisClientType } from "redis";
import { ICacheProvider } from "../cache.interface";

    interface RedisConfig{
        url:string;
    }

export class RedisCacheProvider implements ICacheProvider{
    private client:RedisClientType;
    constructor(config:RedisConfig){
        this.client=createClient(config);
        this.client.connect().then(()=>{
            console.log('redis connect successfully');
        }).catch((err)=>{
            console.log(err);
        })
    }

    async get(key: string): Promise<string> {
        return await this.client.get(key) as string;
    }
    async set(key: string, value: string|number, ttlSeconds: number): Promise<void> {
        if(ttlSeconds){
            await this.client.set(key,value,{EX:ttlSeconds});
        }
        await this.client.set(key,value);
    }
    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

}