import { Types } from "mongoose";
import { ON_Model, SYS_Reaction } from "../enums";

export interface IUserReaction{
    userId:Types.ObjectId;
    refId:Types.ObjectId;
    onModel:ON_Model;
    reaction:SYS_Reaction;
}