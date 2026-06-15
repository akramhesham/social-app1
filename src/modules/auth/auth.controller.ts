import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import authService from './auth.service';
import { isValid } from '../../middlewares';
import { loginSchema, signupSchema } from './auth.validation';

const router = Router();

router.post(
    "/signup",
    isValid(signupSchema), 
    async(req: Request, res: Response, next: NextFunction) => {
    await authService.signup(req.body);
    return res.status(201).json({
        message:'user created successfully',
        success:true
    })
})

router.post(
    "/verify-account",
    async(req:Request,res:Response,next:NextFunction)=>{
     await authService.verifyAccount(req.body);
     return res.status(200).json({
        message:'user verified successfully',
        success:true
     });
})

router.post(
    "/send-otp",
    async(req:Request,res:Response,next:NextFunction)=>{
        await authService.sendOTP(req.body);
        return res.status(200).json({
            message:'send otp successfully',
            success:true
        })
    }
)

router.patch(
    "/reset-password",
    async(req:Request,res:Response,next:NextFunction)=>{
      await authService.resetPassword(req.body);
      return res.status(200).json({
        message:'password reset successfully',
        success:true
      })
})

router.patch(
    "/change-password",
    async(req:Request,res:Response,next:NextFunction)=>{
        await authService.changePassword(req.body);
        return res.status(200).json({
            message:'password changed successfully',
            success:true
        })
    }
)

router.post(
    "/login",
    isValid(loginSchema), 
    async(req: Request, res: Response, next: NextFunction) => {
    const {accessToken,refreshToken}=await authService.login(req.body);
    return res.status(201).json({
        message:'login successfully',
        success:true,
        data:{accessToken,refreshToken}
    })
})

export default router;