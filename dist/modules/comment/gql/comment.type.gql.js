"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentGQLType = void 0;
const graphql_1 = require("graphql");
const user_type_gql_1 = require("../../user/graphql/user.type.gql");
const post_type_gql_1 = require("../../post/graphql/post.type.gql");
exports.commentGQLType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: {
        user: {
            type: user_type_gql_1.userGqlType,
            resolve: (parent) => {
                return parent.userId;
            }
        },
        post: {
            type: post_type_gql_1.postGqlType,
            resolve: (parent) => {
                return parent.postId;
            }
        },
        mentions: { type: new graphql_1.GraphQLList(user_type_gql_1.userGqlType) },
        content: { type: graphql_1.GraphQLString },
        attachments: { type: graphql_1.GraphQLString },
        reactionsCount: { type: graphql_1.GraphQLInt }
    }
});
