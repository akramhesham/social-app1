import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql/type';
import { GraphQLObjectType } from "graphql";
import { userGqlType } from '../../user/graphql/user.type.gql';

export const postGqlType = new GraphQLObjectType({
    name: "PostType",
    fields: {
        content: { type: GraphQLString },
        attachments: { type: new GraphQLList(GraphQLString) },
        relationsCount: { type: GraphQLInt },
        commentsCount: { type: GraphQLInt },
        sharesCount: { type: GraphQLInt },
        user: {
            type: userGqlType,
            resolve: (parent: any) => {
                return parent.userId;
            }
        }
    }
})