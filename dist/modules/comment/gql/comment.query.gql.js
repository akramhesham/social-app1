"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const comment_service_1 = __importDefault(require("../comment.service"));
const comment_type_gql_1 = require("./comment.type.gql");
exports.commentGQLQuery = {
    comment: {
        type: comment_type_gql_1.commentGQLType,
        resolve: async () => {
            return await comment_service_1.default.getComment(new mongoose_1.Types.ObjectId("6a436dfad9bbf86f0e70e7a6"));
        }
    }
};
