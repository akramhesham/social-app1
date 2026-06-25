import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../../middlewares";
import { multerUploadFile } from "../../common";
import userService from "./user.service";

const router=Router();

router.post('/profile-pic',
    isAuthenticated,
    multerUploadFile().single('profile-pic'),
    async(req:Request,res:Response,next:NextFunction)=>{
        const data=await userService.uploadProfilePic(
            req.file as Express.Multer.File,
            req.user._id
        );
        return res.status(201).json({message:"success",data});
    }
)

export default router;