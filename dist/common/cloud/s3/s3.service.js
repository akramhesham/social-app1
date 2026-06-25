"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../../../config");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const lib_storage_1 = require("@aws-sdk/lib-storage");
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
    async uploadFileV1(file, path) {
        let command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
            ACL: "private",
            ContentType: file.mimetype,
            // Body:file.buffer
        });
        await this.client.send(command);
        return command.input.Key;
    }
    async uploadFileV2(file, path) {
        let command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
            ACL: "private",
            ContentType: file.mimetype,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: config_1.S3_EXPIRES_IN });
    }
    async uploadFile(file, path) {
        const upload = new lib_storage_1.Upload({
            client: this.client,
            params: {
                Bucket: config_1.S3_BUCKET_NAME,
                Key: `social_app/${path}/${Date.now()}/_${file.originalname}`,
                ACL: "private",
                ContentType: file.mimetype,
                Body: file.buffer
            }
        });
        upload.on('httpUploadProgress', (progress) => {
            console.log(progress);
        });
        const { Key } = await upload.done();
        return Key;
    }
    async deleteFile(key) {
        let command = new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: key
        });
        await this.client.send(command);
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
