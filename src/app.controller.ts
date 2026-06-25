import { firebasePushNotificationProvider } from './common/notification/firebase/init';
import { BadRequestException, NotFoundException } from './common/utils/error.utils';
import express from 'express';
import type { Response, Request, NextFunction } from 'express';
import { authRouter, commentRouter, postRouter, requestRouter, userRouter } from './modules';
import { connectDB } from './DB/connection';
import { redisConnect } from './DB/redis.connect';
import { s3CloudProvider } from './common/cloud/s3/inits';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import cors from 'cors';
import { createHandler } from "graphql-http/lib/use/express";
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { postMutation, postQuery } from './modules/post/graphql/post.gql';
import { userMutation, userQuery } from './modules/user/graphql/user.gql';

const pipelinePromise = promisify(pipeline)
export function bootstrap() {
    const app = express();
    const port = 3000;

    app.get('/uploads/*paths', async (req: Request, res: Response, next: NextFunction) => {
        console.log('path before merging', req.params.paths);
        const key = (req.params.paths as string[]).join('/');
        console.log('path after merge', key);
        const fileExist = await s3CloudProvider.getFile(key);
        if (!fileExist) {
            throw new NotFoundException('File not found');
        }
        await pipelinePromise(fileExist, res);
    })

    connectDB();
    redisConnect();

    let query = new GraphQLObjectType({
        name: "RootQuery",
        fields: {
            ...userQuery,
            ...postQuery
        }
    })
    let mutation=new GraphQLObjectType({
        name:"RootMutation",
        fields:{
            ...userMutation,
            ...postMutation
        }
    })
    let schema = new GraphQLSchema({
        query,
        mutation
    })
    app.all('/graphql', createHandler({ schema }))

    app.use(express.json());
    app.use(cors({ origin: "*" }));

    app.post('/send-notification', async (req: Request, res: Response) => {
        let fcmToken = req.body.token;
        await firebasePushNotificationProvider.send(fcmToken, {
            title: "Welcome",
            body: `welcome to firebas push notification you receive token at ${new Date()}`
        })
        res.sendStatus(204);
    })
    app.use('/auth', authRouter);
    app.use('/post', postRouter);
    app.use('/comment', commentRouter);
    app.use('/request', requestRouter);
    app.use('/user', userRouter);
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(error.cause as number || 500).json({
            message: error.message,
            stack: error.stack,
            success: false,
            details: error instanceof BadRequestException ? error.details : undefined
        });
    });
    app.listen(port, () => {
        console.log(`app is running on port ${port}`);
    })
}