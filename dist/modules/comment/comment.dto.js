"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.createCommentSchema = zod_1.default.object({
    content: zod_1.default.string().optional(),
    attachments: zod_1.default.string().optional(),
    mentions: zod_1.default.array(zod_1.default.instanceof(mongoose_1.Types.ObjectId)).optional()
}).refine((data) => {
    const { content, attachments, mentions } = data;
    if (!content && !attachments && (!mentions || mentions.length == 0)) {
        throw new common_1.BadRequestException('content or attachments or mentions must be provided');
    }
    else {
        return true;
    }
});
