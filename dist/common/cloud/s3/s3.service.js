"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Provider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3Provider {
    s3Client;
    constructor(config) {
        this.s3Client = new client_s3_1.S3Client({
            region: config.region,
            credentials: {
                secretAccessKey: config.credentials.secretAccessKey,
                accessKeyId: config.credentials.accessKeyId
            }
        });
    }
    uploadFile(file, path) {
        throw new Error("Method not implemented.");
    }
    deleteFile(key) {
        throw new Error("Method not implemented.");
    }
    getFile(key) {
        throw new Error("Method not implemented.");
    }
}
exports.S3Provider = S3Provider;
