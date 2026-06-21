import z from 'zod';
import { generalFeilds, SYS_GENDER } from '../../common';

export const signupSchema=z.object({
    email:generalFeilds.email,
    gender:generalFeilds.gender,
    password:generalFeilds.password,
    userName:generalFeilds.userName,
    phoneNumber:generalFeilds.phoneNumber
});

export const loginSchema=z.object({
    email:z.email(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    FCM:z.string().optional()
})

export const forgetPasswordSchema=z.object({
    email:z.email()
})

export const resetPasswordDTOSchema=z.object({
    email:z.email(),
    otp:z.string(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
})