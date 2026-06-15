import { Types } from "mongoose";
import z from "zod";
import { BadRequestException } from "../../common";

export interface createCommentDTO{
    content?:string;
    attachments?:string;
    mentions?:Types.ObjectId[];
}

export const createCommentSchema=z.object({
    content:z.string().optional(),
    attachments:z.string().optional(),
    mentions:z.array(z.instanceof(Types.ObjectId)).optional()
}).refine((data)=>{
    const {content,attachments,mentions}=data;
    if(!content&&!attachments&&(!mentions||mentions.length==0)){
        throw new BadRequestException('content or attachments or mentions must be provided')
    }else{
        return true;
    }
})