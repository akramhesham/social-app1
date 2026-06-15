"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const middlewares_1 = require("../../middlewares");
const comment_dto_1 = require("./comment.dto");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)({ mergeParams: true });
router.post('/add-reaction', middlewares_1.isAuthenticated, async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, comment_repository_1.commentRepo);
    return res.sendStatus(204);
});
router.post('{/:parentId}', middlewares_1.isAuthenticated, (0, middlewares_1.isValid)(comment_dto_1.createCommentSchema), async (req, res, next) => {
    const createdData = await comment_service_1.default.create(req.body, req.params, req.user._id);
    return res.status(201).json({ data: { createdData } });
});
router.get('/:postId{/:parentId}', middlewares_1.isAuthenticated, async (req, res, next) => {
    const comments = await comment_service_1.default.getAll(req.params);
    return res.status(200).json({ success: true, data: comments });
});
router.delete('/:id', middlewares_1.isAuthenticated, async (req, res, next) => {
    await comment_service_1.default.delete(new mongoose_1.Types.ObjectId(req.params.id), req.user._id);
    return res.sendStatus(204);
});
exports.default = router;
