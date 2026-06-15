import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import PostService from "./post.service";
import { createPostSchema } from "./post.dto";
import { isAuthenticated, isValid } from "../../middlewares";
import { default as commentRouter } from "../comment/comment.controller";

const router = Router();

router.use("/:postId/comment",commentRouter);

router.post('/',
    isAuthenticated,
    isValid(createPostSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        const {user}=req;
        const createdPost = await PostService.create(
            req.body,
            user._id
        )
        return res.status(201).json({
            message: "post created successfully",
            success: true,
            data: { createdPost }
        })
    })

router.post('/reaction',
    async (req: Request, res: Response, next: NextFunction) => {
        await PostService.addReaction(
            req.body,
            req.user._id
        );
        return res.sendStatus(204);
    })

export default router;