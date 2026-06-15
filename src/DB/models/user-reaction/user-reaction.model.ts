import { model, Schema } from "mongoose";
import { IUserReaction, ON_Model, SYS_Reaction } from "../../../common";

const schema = new Schema<IUserReaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refId: {
        type: Schema.Types.ObjectId,
        refPath: "onModel",
        required: true
    },
    onModel: {
        type: String,
        enum: ON_Model,
        required: true
    },
    reaction: {
        type: Number,
        enum: SYS_Reaction,
        default:SYS_Reaction.like
    },
}, {
    timestamps: true
})

export const UserReaction = model("UserReaction", schema);