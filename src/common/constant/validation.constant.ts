import z from 'zod';
import { SYS_GENDER } from '../enums';


export const generalFeilds={
    email:z.email(),
    gender:z.enum(SYS_GENDER).optional(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    userName:z.string().min(2).max(20),
    phoneNumber:z.string().regex(/(\+020|01|002)[0-25]{1}[0-9]{8}$/)
}