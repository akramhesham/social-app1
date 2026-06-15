import { loginSchema, signupSchema } from './auth.validation';
import z from 'zod';

export type SignupDTO=z.infer<typeof signupSchema>;

export interface VerifyAccountDTO{
    otp:string;
    email:string;
}

export interface SendOTPDTO{
    email:string;
}

export interface ResetPasswordDTO{
    otp:string;
    email:string;
    newPassword:string;
}

export interface ChangePasswordDTO{
    otp:string;
    email:string;
    oldPassword:string;
    newPassword:string;

}

export type LoginDTO=z.infer<typeof loginSchema>;
