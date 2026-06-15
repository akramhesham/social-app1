"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
exports.requestSchema = zod_1.default.object({
    sender: zod_1.default.object({
        _id: zod_1.default.instanceof(mongoose_1.Types.ObjectId)
    }),
    receiver: zod_1.default.object({
        _id: zod_1.default.instanceof(mongoose_1.Types.ObjectId)
    })
});
