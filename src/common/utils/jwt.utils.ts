import type { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config';

export function signToken(payload:JwtPayload,secretKey:Secret,options:SignOptions){
    payload.jti=crypto.randomBytes(10).toString('hex');
    return jwt.sign(payload,secretKey,options);
}

export function verifyToken(token:string,secret='sfdfdsdf'){
    return jwt.verify(token,secret)
}

export function generateTokens(payload:JwtPayload){
    const accessToken=signToken(payload,ACCESS_TOKEN_SECRET as string,{
        expiresIn:3200
    });
    const refreshToken=signToken(payload,REFRESH_TOKEN_SECRET as string,{
        expiresIn:'1y'
    });
    return {accessToken,refreshToken};
}