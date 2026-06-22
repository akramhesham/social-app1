"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const inits_1 = require("../../common/cloud/s3/inits");
class UserService {
    cloudProvider;
    constructor(cloudProvider) {
        this.cloudProvider = cloudProvider;
    }
    async uploadProfilePic(file, userId) {
        return await this.cloudProvider.uploadFile(file, `user/${userId.toString()}`);
    }
}
exports.UserService = UserService;
exports.default = new UserService(inits_1.s3CloudProvider);
