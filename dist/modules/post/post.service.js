"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
class PostService {
    postRepository;
    userReactionRepository;
    constructor(postRepository, userReactionRepository) {
        this.postRepository = postRepository;
        this.userReactionRepository = userReactionRepository;
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
            return;
        }
        if (userReactionExist.reaction == addReactionDTO.reaction) {
            await this.userReactionRepository.deleteone({ _id: userReactionExist._id });
            await this.postRepository.updateOne({ _id: addReactionDTO.postID }, { $inc: { reactionsCount: -1 } });
            return;
        }
        await this.userReactionRepository.updateOne({ _id: userReactionExist._id }, { reaction: addReactionDTO.reaction });
        return;
    }
}
exports.PostService = PostService;
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
