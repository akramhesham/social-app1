"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const inits_1 = require("../../common/cloud/s3/inits");
const user_respository_1 = require("../../DB/models/user/user.respository");
const common_1 = require("../../common");
class UserService {
    cloudProvider;
    userRepository;
    constructor(cloudProvider, userRepository) {
        this.cloudProvider = cloudProvider;
        this.userRepository = userRepository;
    }
    async uploadProfilePic(file, userId) {
        const key = await this.cloudProvider.uploadFile(file, `user/${userId.toString()}`);
        const user = await this.userRepository.updateOne({ _id: userId }, { profilePic: key }, { returnDocument: "before" });
        if (!user) {
            throw new common_1.NotFoundException("user not found");
        }
        if (user.profilePic) {
            await this.cloudProvider.deleteFile(user.profilePic);
        }
    }
    async profile(userId) {
        return await this.userRepository.getOne({ _id: userId });
    }
}
exports.UserService = UserService;
exports.default = new UserService(inits_1.s3CloudProvider, user_respository_1.userRepo);
