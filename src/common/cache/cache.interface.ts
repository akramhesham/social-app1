export interface ICacheProvider {
    get(key: string): Promise<string>;

    set(key: string, value: string|number, ttlSeconds: number): Promise<void>;

    delete(key: string): Promise<void>;

    addToSet(key:string , value:string): Promise<void>;

    removeSet(key:string, value:string):Promise<boolean>;

    getAllFromSet(key:string):Promise<string[]>;
}