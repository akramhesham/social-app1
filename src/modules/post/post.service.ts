import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post/post.repository";

import { NotFoundException, ON_Model } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { FirebasePushNotificationProvider } from "../../common/notification/firebase/firebase.service";
import { firebasePushNotificationProvider } from "../../common/notification/firebase/init";
import { ICacheProvider } from "../../common/cache/cache.interface";
import { redisCacheProvider } from "../../common/cache/redis/init";

export class PostService {
    constructor(private readonly postRepository: PostRepository,
                private readonly userReactionRepository: UserReactionRepository,
                private readonly firebasePushNotification: FirebasePushNotificationProvider,
                private readonly cacheProvider:ICacheProvider
    ) { }

    async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
        return await this.postRepository.create({ ...createPostDTO, userId });
    }

    async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
        const postExist = await this.postRepository.getOne({
            _id: addReactionDTO.postID
        })
        if (!postExist) {
            throw new NotFoundException('post not found');
        }
        const userReactionExist = await this.userReactionRepository.getOne({
            onModel: ON_Model.Post,
            refId: addReactionDTO.postID,
            userId
        })
        if (!userReactionExist) {
            await this.userReactionRepository.create({
                onModel: ON_Model.Post,
                refId: addReactionDTO.postID,
                userId,
                reaction: addReactionDTO.reaction
            })
            await this.postRepository.updateOne(
                {_id:addReactionDTO.postID},
                {$inc:{reactionsCount:1}}
            )
            const fcmTokens=await this.cacheProvider.getAllFromSet(`${postExist.userId.toString()}:FCM`)
            await this.firebasePushNotification.sendAll(
                fcmTokens,{
                    title:`recent post you shared`,
                    body:`${userId.toString()} has react to your post`
                }
            )
            return;
        }
        if(userReactionExist.reaction==addReactionDTO.reaction){
            await this.userReactionRepository.deleteone(
                {_id:userReactionExist._id})
            await this.postRepository.updateOne(
                {_id:addReactionDTO.postID},
                {$inc:{reactionsCount:-1}}
            )
            return;
        }
        await this.userReactionRepository.updateOne(
            {_id:userReactionExist._id},
            {reaction:addReactionDTO.reaction} 
        )
        const fcmTokens=await this.cacheProvider.getAllFromSet(`${postExist.userId.toString()}:FCM`);
        await this.firebasePushNotification.sendAll(
            fcmTokens,{
                title:`recent post you shared`,
                body:`${userId.toString()} has update your post`
            }
        )
        return;
    }
}

export default new PostService(new PostRepository(),
    new UserReactionRepository(),
    firebasePushNotificationProvider,
    redisCacheProvider
);