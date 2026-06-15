"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const connectDB = () => {
    mongoose_1.default.connect(config_1.DB_URL).then(() => {
        console.log('DB connected successfully');
    }).catch((error) => {
        console.log(`fail to connect to db because ${error}`);
    });
};
exports.connectDB = connectDB;
