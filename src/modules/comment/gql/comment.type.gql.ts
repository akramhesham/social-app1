import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { userGqlType } from "../../user/graphql/user.type.gql";
import { postGqlType } from "../../post/graphql/post.type.gql";

export const commentGQLType=new GraphQLObjectType({
    name:"CommentType",
    fields:{
      user:{
        type:userGqlType,
        resolve:(parent:any)=>{
            return parent.userId
        }
      },
      post:{
        type:postGqlType,
        resolve:(parent:any)=>{
            return parent.postId
        }
      },
      mentions:{type:new GraphQLList(userGqlType)},
      content:{type:GraphQLString},
      attachments:{type:GraphQLString},
      reactionsCount:{type:GraphQLInt}
    }
})