import type{ NextFunction, Request, Response } from "express";
import { verifyToken } from "../common/utils/jwt.utils";
import { UserRepository } from "../DB/models/user/user.respository";
import { BadRequestException, NotFoundException } from "../common";
import { JwtPayload } from 'jsonwebtoken';
import { redisClient } from '../DB/redis.connect';
import { Types } from "mongoose";

export const isAuthenticated=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const {authorization}=req.headers;
    const payload=verifyToken(authorization as string,'dfsfdsfdfdsfds') as JwtPayload;
    const userRepository=new UserRepository();
    const user= await userRepository.getOne({_id:new Types.ObjectId(payload.sub)});
    if(!user){
        throw new NotFoundException('user not found')
    }
    if(new Date(user.credentialsUpdateAt).getTime()>(payload.iat as number)*1000){
        throw new BadRequestException('invalid token')
    }
    const tokenExist=await redisClient.get(`bl_${payload.jti}`);
    if(tokenExist){
        throw new BadRequestException('revoked token')
    }
    req.user=user;
    req.payload=payload;
    next();
}