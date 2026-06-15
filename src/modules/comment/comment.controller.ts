import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { isAuthenticated, isValid } from "../../middlewares";
import { createCommentSchema } from "./comment.dto";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";
import { Types } from "mongoose";

const router=Router({mergeParams:true});

router.post('/add-reaction',
    isAuthenticated,
    async(req:Request,res:Response,next:NextFunction)=>{
    await addReaction(req.body,req.user._id,commentRepo);
    return res.sendStatus(204);
})

router.post('{/:parentId}',
    isAuthenticated,
    isValid(createCommentSchema),
    async(req:Request,res:Response,next:NextFunction)=>{
       const createdData=await commentService.create(req.body,req.params,req.user._id);
       return res.status(201).json({data:{createdData}});
    })

router.get('/:postId{/:parentId}',
    isAuthenticated,
    async(req:Request,res:Response,next:NextFunction)=>{
       const comments=await commentService.getAll(req.params);
    return res.status(200).json({success:true,data:comments})   
    })  
    
router.delete('/:id',
    isAuthenticated,
    async(req:Request,res:Response,next:NextFunction)=>{
       await commentService.delete(
        new Types.ObjectId(req.params.id as string),
        req.user._id
       )
       return res.sendStatus(204);
    })    

export default router;