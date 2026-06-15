"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const user_friend_repository_1 = require("./../../DB/models/user-friend/user-friend.repository");
const request_repository_1 = require("../../DB/models/request/request.repository");
const common_1 = require("../../common");
class RequestService {
    requestRepository;
    userFriendRepository;
    constructor(requestRepository, userFriendRepository) {
        this.requestRepository = requestRepository;
        this.userFriendRepository = userFriendRepository;
    }
    async sendRequest(senderId, receiverId) {
        //todo 1:check block users(check that the receiver isnot blocked)
        //todo 2:send notification to receiver
        if (senderId.equals(receiverId)) {
            throw new common_1.BadRequestException('you cannot send request to yourself');
        }
        const userFriendExist = await this.userFriendRepository.getOne({
            $or: [{
                    user: senderId, friend: receiverId
                }, {
                    user: receiverId, friend: senderId
                }]
        });
        if (userFriendExist) {
            throw new common_1.BadRequestException('you are already friends');
        }
        const requestExist = await this.requestRepository.getOne({
            $or: [{
                    sender: senderId, receiver: receiverId
                }, {
                    sender: receiverId, receiver: senderId
                }]
        });
        if (requestExist) {
            throw new common_1.ConflictException('request already send');
        }
        return await this.requestRepository.create({
            sender: senderId,
            receiver: receiverId
        });
    }
    async acceptRequest(userId, id) {
        const requestExist = await this.requestRepository.getOne({ _id: id });
        if (!requestExist) {
            throw new common_1.NotFoundException("request not found");
        }
        if (!requestExist.receiver.equals(userId)) {
            throw new common_1.UnAuthorizedException("you are not authorized to accept request");
        }
        await this.requestRepository.deleteone({ _id: id });
        await this.userFriendRepository.create({
            user: userId,
            friend: requestExist.sender
        });
    }
    async declineRequest(userId, id) {
        const requestExist = await this.requestRepository.getOne({ _id: id });
        if (!requestExist) {
            throw new common_1.NotFoundException('request not found');
        }
        if (!requestExist.sender.equals(userId) && !requestExist.receiver.equals(userId)) {
            throw new common_1.UnAuthorizedException('you arenot authorized to cancel or decline this request');
        }
        await this.requestRepository.deleteone({ _id: id });
    }
    async declineRequest2(userId, id) {
        const { deletedCount } = await this.requestRepository.deleteone({
            _id: id,
            $or: [{
                    sender: userId
                }, {
                    receiver: userId
                }]
        });
        if (deletedCount == 0) {
            throw new common_1.BadRequestException('request not found or you arenot authorized to decline or cancel this request');
        }
    }
    async removeFriend(userId, friendId) {
        if (userId.equals(friendId)) {
            throw new common_1.BadRequestException('you arenot allowed to remove yourself');
        }
        const userFriendExist = await this.userFriendRepository.getOne({
            $or: [{
                    user: userId,
                    friend: friendId
                }, {
                    user: friendId,
                    friend: userId
                }]
        });
        if (!userFriendExist) {
            throw new common_1.NotFoundException('you arenot friends');
        }
        await this.userFriendRepository.deleteone({
            _id: userFriendExist._id
        });
    }
    async removeFriend2(userId, friendId) {
        if (userId.equals(friendId)) {
            throw new common_1.BadRequestException('you arenot allowed to remove yourself');
        }
        const { deletedCount } = await this.userFriendRepository.deleteone({
            $or: [{
                    user: userId,
                    friend: friendId
                }, {
                    user: friendId,
                    friend: userId
                }]
        });
        if (deletedCount == 0) {
            throw new common_1.NotFoundException('you arenot friends');
        }
    }
}
exports.RequestService = RequestService;
//todo apply DI(dependency injection)
exports.default = new RequestService(request_repository_1.requestRepo, user_friend_repository_1.UserFriendRepo);
