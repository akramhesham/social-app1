"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const post_dto_1 = require("./post.dto");
const middlewares_1 = require("../../middlewares");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const router = (0, express_1.Router)();
router.use("/:postId/comment", comment_controller_1.default);
router.post('/', middlewares_1.isAuthenticated, (0, middlewares_1.isValid)(post_dto_1.createPostSchema), async (req, res, next) => {
    const { user } = req;
    const createdPost = await post_service_1.default.create(req.body, user._id);
    return res.status(201).json({
        message: "post created successfully",
        success: true,
        data: { createdPost }
    });
});
router.post('/reaction', async (req, res, next) => {
    await post_service_1.default.addReaction(req.body, req.user._id);
    return res.sendStatus(204);
});
exports.default = router;
