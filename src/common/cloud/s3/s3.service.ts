import { S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider } from "../cloud.interface";

interface S3Config{
    region:string;
    credentials:{
        secretAccessKey:string;
        accessKeyId:string
    }
}

export class S3Provider implements ICloudProvider{
    private s3Client:S3Client;
    constructor(config:S3Config){
        this.s3Client=new S3Client({
            region:config.region,
            credentials:{
                secretAccessKey:config.credentials.secretAccessKey,
                accessKeyId:config.credentials.accessKeyId
            }
        })
    }

    uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    deleteFile(key: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getFile(key: string): Promise<NodeJS.ReadableStream | null> {
        throw new Error("Method not implemented.");
    }

}