import type { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export function signToken(payload:JwtPayload,secretKey:Secret,options:SignOptions){
    payload.jti=crypto.randomBytes(10).toString('hex');
    return jwt.sign(payload,secretKey,options);
}

export function verifyToken(token:string,secret='sfdfdsdf'){
    return jwt.verify(token,secret)
}

export function generateTokens(payload:JwtPayload){
    const accessToken=signToken(payload,'dfsfdsfdfdsfds',{
        expiresIn:3200
    });
    const refreshToken=signToken(payload,'fdsfdgvvdvdvfdvfd',{
        expiresIn:'1y'
    });
    return {accessToken,refreshToken};
}