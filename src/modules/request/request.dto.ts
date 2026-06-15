import { Types } from "mongoose";
import z from "zod";

export const requestSchema=z.object({
    sender:z.object({
        _id:z.instanceof(Types.ObjectId)
    }),
    receiver:z.object({
        _id:z.instanceof(Types.ObjectId)
    })
})