import { Types } from 'mongoose';
import postService from '../post.service';
import { postGqlType } from './post.type.gql';

export const postGQLQuery = {
    post: {
        type: postGqlType,
        resolve: async () => {
            return await postService.getPost(new Types.ObjectId("6a1d52202296a4493977be87"))
        }
    }
}