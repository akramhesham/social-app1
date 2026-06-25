"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUser = void 0;
const user_model_1 = require("../../../DB/models/user/user.model");
const getUser = () => {
    return {
        id: 1,
        name: "User",
        email: "user.email",
        password: "user.password",
        phonenumber: "user.phonenumber"
    };
};
exports.getUser = getUser;
const createUser = async (parent, args) => {
    return await user_model_1.User.create(args);
};
exports.createUser = createUser;
