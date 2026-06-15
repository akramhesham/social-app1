import { JwtPayload } from "jsonwebtoken";
import { BadRequestException, ConflictException, encryption, generateOTP, hash, NotFoundException, sendMail } from "../../common";
import { generateTokens, verifyToken } from "../../common/utils/jwt.utils";
import { userRepo, UserRepository } from "../../DB/models/user/user.respository";
import { redisClient } from "../../DB/redis.connect";
import { deleteFromCache, getFromCache, setIntoCache } from "../../DB/redis.service";
import { ChangePasswordDTO, LoginDTO, ResetPasswordDTO, SendOTPDTO, SignupDTO, VerifyAccountDTO } from "./auth.dto";
import { compare } from 'bcrypt';
import { IMailProvider } from "../../common/mail/mail.interface";
import { nodeMailer } from "../../common/mail/nodemailer/init";

class AuthService {
    constructor(
        private userRepository: UserRepository,
        private mailProvider: IMailProvider) { }

    async signup(signupDTO: SignupDTO) {
        const { email } = signupDTO;
        const userExist = await this.userRepository.getOne({ email });
        if (userExist) {
            throw new ConflictException('User already exist')
        }
        signupDTO.password = await hash(signupDTO.password);
        if (signupDTO.phoneNumber) {
            signupDTO.phoneNumber = encryption(signupDTO.phoneNumber);
        }
        const otp = generateOTP();
        await this.mailProvider.send(
            signupDTO.email,
            "confirm email",
            `<p>your otp to confirm email account ${otp}</p>`)
        await setIntoCache(
            `${signupDTO.email}:otp`,
            otp, 3 * 60);
        await setIntoCache(
            signupDTO.email,
            JSON.stringify(signupDTO),
            3 * 24 * 60 * 60)
    };

    async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
        const userData = await getFromCache(verifyAccountDTO.email);
        if (!userData) {
            throw new NotFoundException('user not found');
        } else {
            const otp = await getFromCache(`${verifyAccountDTO.email}:otp`);
            if (!otp) {
                throw new BadRequestException('expire otp');
            } else {
                if (otp != verifyAccountDTO.otp) {
                    throw new BadRequestException('invalid otp');
                }
                await this.userRepository.create(JSON.parse(userData));
                await deleteFromCache(`${verifyAccountDTO.email}:otp`);
                await deleteFromCache(verifyAccountDTO.email);
            }
        }
    };

    async sendOTP(sendOTPDTO: SendOTPDTO) {
        const userExistIntoDB = await this.userRepository.getOne({
            email: sendOTPDTO.email
        }
        );
        const userExistIntoCache = await getFromCache(sendOTPDTO.email);
        if (!userExistIntoDB && !userExistIntoCache) {
            throw new NotFoundException('user not found, please signup');
        }
        const otpExist = await getFromCache(`${sendOTPDTO.email}:otp`);
        if (otpExist) {
            throw new BadRequestException('already have a valid otp')
        }
        const otp = generateOTP();
        await sendMail({
            to: sendOTPDTO.email,
            subject: "re-send otp",
            html: `<p>your otp is ${otp}</p>`
        })
        await setIntoCache(`${sendOTPDTO.email}:otp`, otp, 3 * 60);
    };

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const userExist = await this.userRepository.getOne({ email: resetPasswordDTO.email });
        if (!userExist) {
            throw new NotFoundException('user not found');
        }
        const otp = await getFromCache(`${resetPasswordDTO.email}:otp`);
        if (otp != resetPasswordDTO.otp) {
            throw new BadRequestException('invalid otp')
        }
        resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);
        await this.userRepository.updateOne(
            { email: resetPasswordDTO.email },
            { password: resetPasswordDTO.newPassword });
    }

    async changePassword(changePasswordDTO: ChangePasswordDTO) {
        const userExist = await this.userRepository.getOne({ email: changePasswordDTO.email });
        if (!userExist) {
            throw new NotFoundException('user not found');
        }
        const otp = await getFromCache(`${changePasswordDTO.email}:otp`);
        if (otp != changePasswordDTO.otp) {
            throw new BadRequestException('invalid token');
        }
        const isValidPassword = await compare(changePasswordDTO.oldPassword, userExist.password)
        if (!isValidPassword) {
            throw new BadRequestException('invalid credentials');
        }
        changePasswordDTO.newPassword = await hash(changePasswordDTO.newPassword);
        await this.userRepository.updateOne(
            { email: changePasswordDTO.email },
            { password: changePasswordDTO.newPassword })
    }

    async login(loginDTO: LoginDTO) {
        const userExist = await this.userRepository.getOne({ email: loginDTO.email });
        const match = await compare(loginDTO.password, userExist?.password || 'fdfddfdssadsasda');
        if (!userExist) {
            throw new BadRequestException('invalid credentials');
        }
        if (!match) {
            throw new BadRequestException('invalid credentials');
        }
        const { accessToken, refreshToken } = generateTokens({ sub: userExist._id.toString(), role: userExist.role });
        const refreshPayload = verifyToken(refreshToken, 'fdsfdgvvdvdvfdvfd') as JwtPayload;
        await redisClient.set(`refreshToken:${refreshPayload.jti}`, refreshToken, {
            EX: 60 * 60 * 24 * 365
        })
        const userData = JSON.parse(JSON.stringify(userExist));
        return { accessToken, refreshToken };
    };
}

export default new AuthService(userRepo, nodeMailer);