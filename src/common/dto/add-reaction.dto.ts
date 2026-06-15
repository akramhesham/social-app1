import { Types } from "mongoose";
import { SYS_Reaction } from "../enums";

export interface AddReactionDTO{
    id:Types.ObjectId,
    reaction:SYS_Reaction
}