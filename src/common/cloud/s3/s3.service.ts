import { Progress } from './../../../../node_modules/@aws-sdk/lib-storage/dist-types/ts3.4/types.d';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider } from "../cloud.interface";
import { S3_BUCKET_NAME, S3_EXPIRES_IN } from "../../../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage"

interface S3Config {
    region: string;
    credentials: {
        secretAccessKey: string;
        accessKeyId: string
    }
}

export class S3CloudProvider implements ICloudProvider {
    private client: S3Client;
    constructor(config: S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                secretAccessKey: config.credentials.secretAccessKey,
                accessKeyId: config.credentials.accessKeyId
            }
        })
    }

    async uploadFileV1(file: Express.Multer.File, path: string): Promise<string> {
        let command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
            ACL: "private",
            ContentType: file.mimetype,
            // Body:file.buffer
        })
        await this.client.send(command);
        return command.input.Key as string
    }
    async uploadFileV2(file: Express.Multer.File, path: string): Promise<string> {
        let command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
            ACL: "private",
            ContentType: file.mimetype,
        })
        return await getSignedUrl(this.client, command, { expiresIn: S3_EXPIRES_IN });
    }
    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: S3_BUCKET_NAME,
                Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
                ACL: "private",
                ContentType: file.mimetype,
                Body: file.buffer
            }
        })
        upload.on('httpUploadProgress',(progress:Progress)=>{
            console.log(progress);
        })
        const {Key}=await upload.done();
        return Key as string;
    }
    async deleteFile(key: string): Promise<void> {
        let command = new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key
        })
        await this.client.send(command);
    }

    async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
        let command = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key
        })
        const { Body } = await this.client.send(command);
        return Body as NodeJS.ReadableStream;
    }

}