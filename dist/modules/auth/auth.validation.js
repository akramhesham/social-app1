"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordDTOSchema = exports.forgetPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.signupSchema = zod_1.default.object({
    email: common_1.generalFeilds.email,
    gender: common_1.generalFeilds.gender,
    password: common_1.generalFeilds.password,
    userName: common_1.generalFeilds.userName,
    phoneNumber: common_1.generalFeilds.phoneNumber
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    FCM: zod_1.default.string().optional()
});
exports.forgetPasswordSchema = zod_1.default.object({
    email: zod_1.default.email()
});
exports.resetPasswordDTOSchema = zod_1.default.object({
    email: zod_1.default.email(),
    otp: zod_1.default.string(),
    password: zod_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});
