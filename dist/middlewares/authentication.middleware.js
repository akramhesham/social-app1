"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jwt_utils_1 = require("../common/utils/jwt.utils");
const user_respository_1 = require("../DB/models/user/user.respository");
const common_1 = require("../common");
const redis_connect_1 = require("../DB/redis.connect");
const mongoose_1 = require("mongoose");
const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    const payload = (0, jwt_utils_1.verifyToken)(authorization, 'dfsfdsfdfdsfds');
    const userRepository = new user_respository_1.UserRepository();
    const user = await userRepository.getOne({ _id: new mongoose_1.Types.ObjectId(payload.sub) });
    if (!user) {
        throw new common_1.NotFoundException('user not found');
    }
    if (new Date(user.credentialsUpdateAt).getTime() > payload.iat * 1000) {
        throw new common_1.BadRequestException('invalid token');
    }
    const tokenExist = await redis_connect_1.redisClient.get(`bl_${payload.jti}`);
    if (tokenExist) {
        throw new common_1.BadRequestException('revoked token');
    }
    req.user = user;
    req.payload = payload;
    next();
};
exports.isAuthenticated = isAuthenticated;
