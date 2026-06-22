"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const common_1 = require("../../common");
const user_service_1 = __importDefault(require("./user.service"));
const router = (0, express_1.Router)();
router.post('/profile-pic', middlewares_1.isAuthenticated, (0, common_1.multerUploadFile)().single('profile-pic'), async (req, res, next) => {
    const data = await user_service_1.default.uploadProfilePic(req.file, req.user._id);
    return res.status(201).json({ message: "success", data });
});
exports.default = router;
