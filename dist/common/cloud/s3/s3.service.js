"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../../../config");
class S3CloudProvider {
    client;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            region: config.region,
            credentials: {
                secretAccessKey: config.credentials.secretAccessKey,
                accessKeyId: config.credentials.accessKeyId
            }
        });
    }
    async uploadFile(file, path) {
        let command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
            ACL: "public-read",
            ContentType: file.mimetype,
            Body: file.buffer
        });
        await this.client.send(command);
        return command.input.Key;
    }
    async deleteFile(key) {
        let command = new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: key
        });
        const { DeleteMarker, } = await this.client.send(command);
        return DeleteMarker;
    }
    async getFile(key) {
        let command = new client_s3_1.GetObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: key
        });
        const { Body } = await this.client.send(command);
        return Body;
    }
}
exports.S3CloudProvider = S3CloudProvider;
