"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
class CommentService {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    async create(createCommentDTO, params, userId) {
        if (params.postId) {
            const postExist = await this.postRepository.getOne({ _id: params.postId });
            if (!postExist) {
                throw new common_1.NotFoundException("post not found");
            }
        }
        let postCommentExist = undefined;
        if (params.parentId) {
            postCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
            if (!postCommentExist) {
                throw new common_1.NotFoundException("comment not found");
            }
        }
        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
            postId: params.postId || postCommentExist?.postId
        });
    }
    async getAll(params) {
        const comment = await this.commentRepository.getAll({
            postId: params.postId,
            parentId: params.parentId
        });
        if (comment.length == 0) {
            throw new common_1.NotFoundException('no comments');
        }
        return comment;
    }
    async delete(id, userId) {
        const commentExist = await this.commentRepository.getOne({
            _id: id
        }, {}, { populate: [{ path: "postId" }] });
        if (!commentExist) {
            throw new common_1.NotFoundException("comment not found");
        }
        let commentAuthor = commentExist.userId.toString();
        let postAuthor = commentExist.postId[0]?.userId.toString();
        if (![commentAuthor, postAuthor].includes(userId.toString())) {
            throw new common_1.UnAuthorizedException("you are not allowed to delete this comment");
        }
        await this.commentRepository.deleteone({ _id: id });
    }
}
exports.CommentService = CommentService;
exports.default = new CommentService(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
