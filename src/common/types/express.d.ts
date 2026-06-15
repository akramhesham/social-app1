import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

declare module 'express-serve-static-core'{
    interface Request{
        user:IUser;
        payload:JwtPayload;
    }
}