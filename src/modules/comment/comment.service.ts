import { Types } from 'mongoose';
import { commentRepo } from './../../DB/models/comment/comment.repository';
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { createCommentDTO } from "./comment.dto";
import { IPost, NotFoundException, UnAuthorizedException } from "../../common";

export class CommentService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository
    ) { }

    async create(
        createCommentDTO: createCommentDTO,
        params: any,
        userId: Types.ObjectId
    ) {
        if (params.postId) {
            const postExist = await this.postRepository.getOne({ _id: params.postId });
            if (!postExist) {
                throw new NotFoundException("post not found");
            }
        }
        let postCommentExist = undefined;
        if (params.parentId) {
            postCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
            if (!postCommentExist) {
                throw new NotFoundException("comment not found");
            }
        }
        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
            postId: params.postId || postCommentExist?.postId
        })
    }

    async getAll(params: any) {
        const comment = await this.commentRepository.getAll({
            postId: params.postId,
            parentId: params.parentId
        })
        if (comment.length == 0) {
            throw new NotFoundException('no comments')
        }
        return comment
    }

    async delete(id: Types.ObjectId, userId: Types.ObjectId) {
        const commentExist = await this.commentRepository.getOne({
            _id: id
        },
            {},
            { populate: [{ path: "postId" }] }
        );
        if (!commentExist) {
            throw new NotFoundException("comment not found");
        }
        let commentAuthor = commentExist.userId.toString();
        let postAuthor = (commentExist.postId as IPost[])[0]?.userId.toString();
        if (![commentAuthor, postAuthor].includes(userId.toString())) {
            throw new UnAuthorizedException("you are not allowed to delete this comment");
        }
        await this.commentRepository.deleteone({ _id: id });
    }

    async getComment(commentId: Types.ObjectId) {
        return await this.commentRepository.getOne({ _id: commentId }, {}, {
            populate: [
                { path: "userId" },
                { path: "postId", populate: [{ path: "userId" }] }
            ]
        });
    }
}

export default new CommentService(new PostRepository(),
    new CommentRepository());