export interface ICloudProvider{
    uploadFile(file:Express.Multer.File,path:string):Promise<string>;
    deleteFile(key:string):Promise<string>;
    getFile(key:string):Promise<NodeJS.ReadableStream|null>;
}
//todo>>cloudinary
//todo>>DO(Digital Ocean)
//todo??azure