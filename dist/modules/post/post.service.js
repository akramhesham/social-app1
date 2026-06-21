"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const init_1 = require("../../common/notification/firebase/init");
const init_2 = require("../../common/cache/redis/init");
class PostService {
    postRepository;
    userReactionRepository;
    firebasePushNotification;
    cacheProvider;
    constructor(postRepository, userReactionRepository, firebasePushNotification, cacheProvider) {
        this.postRepository = postRepository;
        this.userReactionRepository = userReactionRepository;
        this.firebasePushNotification = firebasePushNotification;
        this.cacheProvider = cacheProvider;
    }
    async create(createPostDTO, userId) {
        return await this.postRepository.create({ ...createPostDTO, userId });
    }
    async addReaction(addReactionDTO, userId) {
        const postExist = await this.postRepository.getOne({
            _id: addReactionDTO.postID
        });
        if (!postExist) {
            throw new common_1.NotFoundException('post not found');
        }
        const userReactionExist = await this.userReactionRepository.getOne({
            onModel: common_1.ON_Model.Post,
            refId: addReactionDTO.postID,
            userId
        });
        if (!userReactionExist) {
            await this.userReactionRepository.create({
                onModel: common_1.ON_Model.Post,
                refId: addReactionDTO.postID,
                userId,
                reaction: addReactionDTO.reaction
            });
            await this.postRepository.updateOne({ _id: addReactionDTO.postID }, { $inc: { reactionsCount: 1 } });
            const fcmTokens = await this.cacheProvider.getAllFromSet(`${postExist.userId.toString()}:FCM`);
            await this.firebasePushNotification.sendAll(fcmTokens, {
                title: `recent post you shared`,
                body: `${userId.toString()} has react to your post`
            });
            return;
        }
        if (userReactionExist.reaction == addReactionDTO.reaction) {
            await this.userReactionRepository.deleteone({ _id: userReactionExist._id });
            await this.postRepository.updateOne({ _id: addReactionDTO.postID }, { $inc: { reactionsCount: -1 } });
            return;
        }
        await this.userReactionRepository.updateOne({ _id: userReactionExist._id }, { reaction: addReactionDTO.reaction });
        const fcmTokens = await this.cacheProvider.getAllFromSet(`${postExist.userId.toString()}:FCM`);
        await this.firebasePushNotification.sendAll(fcmTokens, {
            title: `recent post you shared`,
            body: `${userId.toString()} has update your post`
        });
        return;
    }
}
exports.PostService = PostService;
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository(), init_1.firebasePushNotificationProvider, init_2.redisCacheProvider);
