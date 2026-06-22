import { Types } from "mongoose";
import { ICloudProvider } from "../../common/cloud/cloud.interface";
import { s3CloudProvider } from "../../common/cloud/s3/inits";

export class UserService{
    constructor(private readonly cloudProvider:ICloudProvider){}

    async uploadProfilePic(file:Express.Multer.File,userId:Types.ObjectId){
        return await this.cloudProvider.uploadFile(file,`user/${userId.toString()}`);
    }
}

export default new UserService(s3CloudProvider);