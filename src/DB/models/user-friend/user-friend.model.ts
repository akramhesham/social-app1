import { model, Schema } from "mongoose";
import { IUserFriend, SYS_Relation } from "../../../common";


const schema=new Schema<IUserFriend>({
    user:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    friend:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    closeFriend:
    {
        type:Boolean,
        default:false
    },
    relationShip:{
        type:String,
        enum:SYS_Relation
    } 
},{
    timestamps:true
})

export const UserFriend=model("UserFriend",schema);