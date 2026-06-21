"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../common/cache/redis/init");
const common_1 = require("../../common");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const user_respository_1 = require("../../DB/models/user/user.respository");
const redis_connect_1 = require("../../DB/redis.connect");
const redis_service_1 = require("../../DB/redis.service");
const init_2 = require("../../common/mail/nodemailer/init");
class AuthService {
    userRepository;
    mailProvider;
    cacheProvider;
    constructor(userRepository, mailProvider, cacheProvider) {
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
        this.cacheProvider = cacheProvider;
    }
    async signup(signupDTO) {
        const { email } = signupDTO;
        const userExist = await this.userRepository.getOne({ email });
        if (userExist) {
            throw new common_1.ConflictException('User already exist');
        }
        signupDTO.password = await (0, common_1.hash)(signupDTO.password);
        if (signupDTO.phoneNumber) {
            signupDTO.phoneNumber = (0, common_1.encryption)(signupDTO.phoneNumber);
        }
        const otp = (0, common_1.generateOTP)();
        await this.mailProvider.send(signupDTO.email, "confirm email", `<p>your otp to confirm email account ${otp}</p>`);
        await this.cacheProvider.set(`${signupDTO.email}:otp`, otp, 3 * 60);
        await this.cacheProvider.set(signupDTO.email, JSON.stringify(signupDTO), 3 * 24 * 60 * 60);
    }
    ;
    async verifyAccount(verifyAccountDTO) {
        const userData = await (0, redis_service_1.getFromCache)(verifyAccountDTO.email);
        if (!userData) {
            throw new common_1.NotFoundException('user not found');
        }
        else {
            const otp = await init_1.redisCacheProvider.get(`${verifyAccountDTO.email}:otp`);
            if (!otp) {
                throw new common_1.BadRequestException('expire otp');
            }
            else {
                if (otp != verifyAccountDTO.otp) {
                    throw new common_1.BadRequestException('invalid otp');
                }
                await this.userRepository.create(JSON.parse(userData));
                await this.cacheProvider.delete(`${verifyAccountDTO.email}:otp`);
                await this.cacheProvider.delete(verifyAccountDTO.email);
            }
        }
    }
    ;
    async sendOTP(sendOTPDTO) {
        const userExistIntoDB = await this.userRepository.getOne({
            email: sendOTPDTO.email
        });
        const userExistIntoCache = await (0, redis_service_1.getFromCache)(sendOTPDTO.email);
        if (!userExistIntoDB && !userExistIntoCache) {
            throw new common_1.NotFoundException('user not found, please signup');
        }
        const otpExist = await (0, redis_service_1.getFromCache)(`${sendOTPDTO.email}:otp`);
        if (otpExist) {
            throw new common_1.BadRequestException('already have a valid otp');
        }
        const otp = (0, common_1.generateOTP)();
        await (0, common_1.sendMail)({
            to: sendOTPDTO.email,
            subject: "re-send otp",
            html: `<p>your otp is ${otp}</p>`
        });
        await this.cacheProvider.set(`${sendOTPDTO.email}:otp`, otp, 3 * 60);
    }
    ;
    async resetPassword(resetPasswordDTO) {
        const userExist = await this.userRepository.getOne({ email: resetPasswordDTO.email });
        if (!userExist) {
            throw new common_1.NotFoundException('user not found');
        }
        const otp = await (0, redis_service_1.getFromCache)(`${resetPasswordDTO.email}:otp`);
        if (otp != resetPasswordDTO.otp) {
            throw new common_1.BadRequestException('invalid otp');
        }
        resetPasswordDTO.newPassword = await (0, common_1.hash)(resetPasswordDTO.newPassword);
        await this.userRepository.updateOne({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.newPassword });
    }
    async changePassword(changePasswordDTO) {
        const userExist = await this.userRepository.getOne({ email: changePasswordDTO.email });
        if (!userExist) {
            throw new common_1.NotFoundException('user not found');
        }
        const otp = await (0, redis_service_1.getFromCache)(`${changePasswordDTO.email}:otp`);
        if (otp != changePasswordDTO.otp) {
            throw new common_1.BadRequestException('invalid token');
        }
        const isValidPassword = await (0, common_1.compare)(changePasswordDTO.oldPassword, userExist.password);
        if (!isValidPassword) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        changePasswordDTO.newPassword = await (0, common_1.hash)(changePasswordDTO.newPassword);
        await this.userRepository.updateOne({ email: changePasswordDTO.email }, { password: changePasswordDTO.newPassword });
    }
    async login(loginDTO) {
        const userExist = await this.userRepository.getOne({ email: loginDTO.email });
        const match = await (0, common_1.compare)(loginDTO.password, userExist?.password || 'fdfddfdssadsasda');
        if (!userExist) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        if (!match) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const { accessToken, refreshToken } = (0, jwt_utils_1.generateTokens)({ sub: userExist._id.toString(), role: userExist.role });
        const refreshPayload = (0, jwt_utils_1.verifyToken)(refreshToken, 'fdsfdgvvdvdvfdvfd');
        await redis_connect_1.redisClient.set(`refreshToken:${refreshPayload.jti}`, refreshToken, {
            EX: 60 * 60 * 24 * 365
        });
        const userData = JSON.parse(JSON.stringify(userExist));
        if (loginDTO.FCM) {
            await this.cacheProvider.addToSet(`${userExist._id.toString()}:FCM`, loginDTO.FCM);
        }
        return { accessToken, refreshToken };
    }
    ;
    async logout(userId, fcm) {
        await this.cacheProvider.removeSet(`${userId}:FCM`, fcm);
    }
}
exports.default = new AuthService(user_respository_1.userRepo, init_2.nodeMailer, init_1.redisCacheProvider);
