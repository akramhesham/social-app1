import { User } from "../../../DB/models/user/user.model"

export const getUser = () => {
    return {
        id: 1,
        name: "User",
        email: "user.email",
        password: "user.password",
        phonenumber: "user.phonenumber"
    }
}

export const createUser=async(parent:any,args:any)=>{
    return await User.create(args);
}