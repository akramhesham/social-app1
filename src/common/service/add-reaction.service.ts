import { Types } from "mongoose";
import { AddReactionDTO } from "../dto";
import { BadRequestException, NotFoundException } from "../utils";
import { ON_Model } from "../enums";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";

    function toModel(collectionName:String){
        switch (collectionName){
            case "posts":
                return ON_Model.Post;
            case "comments":
                return ON_Model.Comment;
            default:
                throw new BadRequestException('invalid collection')    
        }
    }

    export const addReaction=async(
        addReactionDTO: AddReactionDTO, 
        userId: Types.ObjectId,
        repo:PostRepository|CommentRepository
    )=> {
        const docExist = await repo.getOne({
            _id: addReactionDTO.id
        })
        if (!docExist) {
            throw new NotFoundException(`${repo.model.modelName} not found`);
        }
        const collectionName=docExist.collection.name;
        const userReactionRepository=new UserReactionRepository();
        const userReactionExist = await userReactionRepository.getOne({
            onModel: toModel(collectionName),
            refId: addReactionDTO.id,
            userId
        })
        if (!userReactionExist) {
            await userReactionRepository.create({
                onModel: toModel(collectionName),
                refId: addReactionDTO.id,
                userId,
                reaction: addReactionDTO.reaction
            })
            await repo.updateOne(
                {_id:addReactionDTO.id},
                {$inc:{reactionsCount:1}}
            )
            return;
        }
        if(userReactionExist.reaction==addReactionDTO.reaction){
            await userReactionRepository.deleteone(
                {_id:userReactionExist._id})
            await repo.updateOne(
                {_id:addReactionDTO.id},
                {$inc:{reactionsCount:-1}}
            )
            return;
        }
        await userReactionRepository.updateOne(
            {_id:userReactionExist._id},
            {reaction:addReactionDTO.reaction} 
        )
        return;
    }