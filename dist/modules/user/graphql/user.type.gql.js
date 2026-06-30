"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGqlType = void 0;
const graphql_1 = require("graphql");
exports.userGqlType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        userName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phonenumber: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
        provider: { type: graphql_1.GraphQLString },
        gender: { type: graphql_1.GraphQLString },
        profilePic: { type: graphql_1.GraphQLString },
    }
});
