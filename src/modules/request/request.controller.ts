import { Router } from "express";
import type { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from "../../middlewares";
import requestService from "./request.service";
import { Types } from "mongoose";

const router = Router();

router.post('/:receiverId',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        await requestService.sendRequest(
            req.user._id,
            new Types.ObjectId(req.params.receiverId as string));
        return res.sendStatus(204);
    }
)

router.post('/acceptRequest/:id',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        await requestService.acceptRequest(
            req.user._id, 
            new Types.ObjectId(req.params.id as string)
        );
        return res.sendStatus(204);   
    }
)

router.delete('/declineRequest/:id',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) =>{
        await requestService.declineRequest(
            req.user._id,
            new Types.ObjectId(req.params.id as string)
        );
        return res.sendStatus(204);
    }
)

router.delete('/removeFriend/:friendId',
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) =>{
        await requestService.removeFriend2(
            req.user._id,
            new Types.ObjectId(req.params.friendId as string)
        );
        return res.sendStatus(204);
    }    
)

export default router;