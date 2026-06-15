import { Types } from "mongoose";
import { SYS_Relation } from "../enums";

export interface IUserFriend{
    user:Types.ObjectId,
    friend:Types.ObjectId,
    closeFriend:boolean,
    relationShip?:SYS_Relation
}