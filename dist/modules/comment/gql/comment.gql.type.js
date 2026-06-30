"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentGQLType = void 0;
const graphql_1 = require("graphql");
const user_gql_type_1 = require("../../user/graphql/user.gql.type");
const post_gql_type_1 = require("../../post/graphql/post.gql.type");
exports.commentGQLType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: {
        userId: {
            type: user_gql_type_1.userGqlType,
            resolve: (parent) => {
                return parent.userId;
            }
        },
        postId: {
            type: post_gql_type_1.postGqlType,
            resolve: (parent) => {
                return parent.postId;
            }
        },
        parentId: {},
        mentions: {
            type: user_gql_type_1.userGqlType,
            resolve: (parent) => {
                return parent.userId;
            }
        },
        content: { type: graphql_1.GraphQLString },
        attachments: { type: graphql_1.GraphQLString },
        reactionsCount: { type: graphql_1.GraphQLInt }
    }
});
