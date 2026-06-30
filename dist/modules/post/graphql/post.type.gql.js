"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGqlType = void 0;
const type_1 = require("graphql/type");
const graphql_1 = require("graphql");
const user_type_gql_1 = require("../../user/graphql/user.type.gql");
exports.postGqlType = new graphql_1.GraphQLObjectType({
    name: "PostType",
    fields: {
        content: { type: type_1.GraphQLString },
        attachments: { type: new type_1.GraphQLList(type_1.GraphQLString) },
        relationsCount: { type: type_1.GraphQLInt },
        commentsCount: { type: type_1.GraphQLInt },
        sharesCount: { type: type_1.GraphQLInt },
        user: {
            type: user_type_gql_1.userGqlType,
            resolve: (parent) => {
                return parent.userId;
            }
        }
    }
});
