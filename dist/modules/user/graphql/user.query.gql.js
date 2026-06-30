"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGQLQuery = void 0;
const user_type_gql_1 = require("./user.type.gql");
const user_service_1 = __importDefault(require("../user.service"));
const mongoose_1 = require("mongoose");
exports.userGQLQuery = {
    user: {
        type: user_type_gql_1.userGqlType,
        resolve: async () => {
            return await user_service_1.default.profile(new mongoose_1.Types.ObjectId("6a12ae2f08cf0c7f4d56b737"));
        }
    }
};
// export const userMutation = {
//     createUser:{
//         type:UserGqlType,
//         args:{
//             id:{type:GraphQLID},
//             name:{type:GraphQLString},
//             email:{type:GraphQLString},
//             password:{type:GraphQLString},
//             phonenumber:{type:GraphQLString}
//         },
//         resolve:createUser
//     }
// };
// export const userSubscription={};
