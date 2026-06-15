import z from "zod";
import { BadRequestException, SYS_Reaction } from "../../common";
import { Types } from "mongoose";

export interface CreatePostDTO{
    content?:string,
    attachments?:string[];
}

export const createPostSchema=z.object({
    content:z.string().optional(),
    attachments:z.array(z.string()).optional() 
}).refine((data)=>{
   const {content,attachments}=data;
   if(!content&&(!attachments||attachments.length==0)){
    throw new BadRequestException('content or attachments must be provided')
   }else{
    return true;
   }
})

export interface AddReactionDTO{
    postID:Types.ObjectId,
    reaction:SYS_Reaction
}