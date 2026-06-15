"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const utils_1 = require("../utils");
const enums_1 = require("../enums");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts":
            return enums_1.ON_Model.Post;
        case "comments":
            return enums_1.ON_Model.Comment;
        default:
            throw new utils_1.BadRequestException('invalid collection');
    }
}
const addReaction = async (addReactionDTO, userId, repo) => {
    const docExist = await repo.getOne({
        _id: addReactionDTO.id
    });
    if (!docExist) {
        throw new utils_1.NotFoundException(`${repo.model.modelName} not found`);
    }
    const collectionName = docExist.collection.name;
    const userReactionRepository = new user_reaction_repository_1.UserReactionRepository();
    const userReactionExist = await userReactionRepository.getOne({
        onModel: toModel(collectionName),
        refId: addReactionDTO.id,
        userId
    });
    if (!userReactionExist) {
        await userReactionRepository.create({
            onModel: toModel(collectionName),
            refId: addReactionDTO.id,
            userId,
            reaction: addReactionDTO.reaction
        });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });
        return;
    }
    if (userReactionExist.reaction == addReactionDTO.reaction) {
        await userReactionRepository.deleteone({ _id: userReactionExist._id });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
        return;
    }
    await userReactionRepository.updateOne({ _id: userReactionExist._id }, { reaction: addReactionDTO.reaction });
    return;
};
exports.addReaction = addReaction;
