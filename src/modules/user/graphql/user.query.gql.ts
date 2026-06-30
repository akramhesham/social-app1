import { userGqlType } from "./user.type.gql"
import userService from "../user.service";
import { Types } from "mongoose";

export const userGQLQuery = {
    user: {
        type: userGqlType,
        resolve: async()=>{
            return await userService.profile(new Types.ObjectId("6a12ae2f08cf0c7f4d56b737"))
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