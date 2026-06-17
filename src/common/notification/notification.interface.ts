export interface INotificationProvider{
    send(token:string,data:{title:string,body:String}):Promise<void>;
}