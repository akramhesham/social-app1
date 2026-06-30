import { Types } from "mongoose";
import commentService from "../comment.service";
import { commentGQLType } from "./comment.type.gql";

export const commentGQLQuery={
    comment:{
        type:commentGQLType,
        resolve:async()=>{
           return await commentService.getComment(new Types.ObjectId("6a436dfad9bbf86f0e70e7a6"))
        }
    }
}