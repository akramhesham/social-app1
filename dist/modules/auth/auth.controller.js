"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middlewares_1 = require("../../middlewares");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post("/signup", (0, middlewares_1.isValid)(auth_validation_1.signupSchema), async (req, res, next) => {
    await auth_service_1.default.signup(req.body);
    return res.status(201).json({
        message: 'user created successfully',
        success: true
    });
});
router.post("/verify-account", async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res.status(200).json({
        message: 'user verified successfully',
        success: true
    });
});
router.post("/send-otp", async (req, res, next) => {
    await auth_service_1.default.sendOTP(req.body);
    return res.status(200).json({
        message: 'send otp successfully',
        success: true
    });
});
router.patch("/reset-password", async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body);
    return res.status(200).json({
        message: 'password reset successfully',
        success: true
    });
});
router.patch("/change-password", async (req, res, next) => {
    await auth_service_1.default.changePassword(req.body);
    return res.status(200).json({
        message: 'password changed successfully',
        success: true
    });
});
router.post("/login", (0, middlewares_1.isValid)(auth_validation_1.loginSchema), async (req, res, next) => {
    const { accessToken, refreshToken } = await auth_service_1.default.login(req.body);
    return res.status(201).json({
        message: 'login successfully',
        success: true,
        data: { accessToken, refreshToken }
    });
});
exports.default = router;
