import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const userGqlType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: { type: GraphQLID },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        phonenumber: { type: GraphQLString },
        password: { type: GraphQLString },
        role: {type: GraphQLString},
        provider: {type: GraphQLString},
        gender: {type: GraphQLString},
        profilePic: {type: GraphQLString},
    }
})