"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const request_service_1 = __importDefault(require("./request.service"));
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)();
router.post('/:receiverId', middlewares_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.sendRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.receiverId));
    return res.sendStatus(204);
});
router.post('/acceptRequest/:id', middlewares_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.acceptRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.id));
    return res.sendStatus(204);
});
router.delete('/declineRequest/:id', middlewares_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.declineRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.id));
    return res.sendStatus(204);
});
router.delete('/removeFriend/:friendId', middlewares_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.removeFriend2(req.user._id, new mongoose_1.Types.ObjectId(req.params.friendId));
    return res.sendStatus(204);
});
exports.default = router;
