import { UserFriendRepo } from './../../DB/models/user-friend/user-friend.repository';
import { Types } from "mongoose";
import { requestRepo, RequestRepository } from "../../DB/models/request/request.repository";
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common";
import { UserFriendRepository } from "../../DB/models/user-friend/user-friend.repository";

export class RequestService{
    constructor(
        private readonly requestRepository:RequestRepository,
        private readonly userFriendRepository:UserFriendRepository
    ){}

    async sendRequest(senderId:Types.ObjectId,receiverId:Types.ObjectId){
        //todo 1:check block users(check that the receiver isnot blocked)
        //todo 2:send notification to receiver
        if(senderId.equals(receiverId)){
            throw new BadRequestException('you cannot send request to yourself')
        }
        const userFriendExist=await this.userFriendRepository.getOne({
            $or:[{
                user:senderId,friend:receiverId
            },{
                user:receiverId,friend:senderId
            }]
        });
        if(userFriendExist){
            throw new BadRequestException('you are already friends')
        }
        const requestExist=await this.requestRepository.getOne({
            $or:[{
                sender:senderId,receiver:receiverId
            },{
                sender:receiverId,receiver:senderId
            }]
        })
        if(requestExist){
            throw new ConflictException('request already send')
        }
        return await this.requestRepository.create({
            sender:senderId,
            receiver:receiverId
        })
    }

    async acceptRequest(userId:Types.ObjectId,id:Types.ObjectId){
        const requestExist=await this.requestRepository.getOne({_id:id});
        if(!requestExist){
            throw new NotFoundException("request not found");
        }
        if(!requestExist.receiver.equals(userId)){
            throw new UnAuthorizedException("you are not authorized to accept request");
        }
        await this.requestRepository.deleteone({_id:id});
        await this.userFriendRepository.create({
            user:userId,
            friend:requestExist.sender
        }) 
    }

    async declineRequest(userId:Types.ObjectId,id:Types.ObjectId){
        const requestExist=await this.requestRepository.getOne({_id:id});
        if(!requestExist){
            throw new NotFoundException('request not found');
        }
        if(!requestExist.sender.equals(userId)&&!requestExist.receiver.equals(userId)){
            throw new UnAuthorizedException('you arenot authorized to cancel or decline this request');
        }
        await this.requestRepository.deleteone({_id:id});
    }
    async declineRequest2(userId:Types.ObjectId,id:Types.ObjectId){
        const{deletedCount}=await this.requestRepository.deleteone({
            _id:id,
            $or:[{
                sender:userId
            },{
                receiver:userId
            }]
        })
        if(deletedCount==0){
            throw new BadRequestException('request not found or you arenot authorized to decline or cancel this request');
        }
    }

    async removeFriend(userId:Types.ObjectId,friendId:Types.ObjectId){
        if(userId.equals(friendId)){
            throw new BadRequestException('you arenot allowed to remove yourself')
        }        
        const userFriendExist=await this.userFriendRepository.getOne({
            $or:[{
                user:userId,
                friend:friendId
            },{
                user:friendId,
                friend:userId
            }]
        })
        if(!userFriendExist){
            throw new NotFoundException('you arenot friends')
        }
        await this.userFriendRepository.deleteone({
            _id:userFriendExist._id
        })
    }
    async removeFriend2(userId:Types.ObjectId,friendId:Types.ObjectId){
        if(userId.equals(friendId)){
            throw new BadRequestException('you arenot allowed to remove yourself')
        }
        const{deletedCount}=await this.userFriendRepository.deleteone({
            $or:[{
                user:userId,
                friend:friendId
            },{
                user:friendId,
                friend:userId
            }]            
        })
        if(deletedCount==0){
            throw new NotFoundException('you arenot friends')
        }
    }
}
//todo apply DI(dependency injection)
export default new RequestService(requestRepo,UserFriendRepo);