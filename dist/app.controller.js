"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const init_1 = require("./common/notification/firebase/init");
const error_utils_1 = require("./common/utils/error.utils");
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const connection_1 = require("./DB/connection");
const redis_connect_1 = require("./DB/redis.connect");
const inits_1 = require("./common/cloud/s3/inits");
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const cors_1 = __importDefault(require("cors"));
const express_2 = require("graphql-http/lib/use/express");
const type_1 = require("graphql/type");
const pipelinePromise = (0, node_util_1.promisify)(node_stream_1.pipeline);
function bootstrap() {
    const app = (0, express_1.default)();
    const port = 3000;
    app.get('/uploads/*paths', async (req, res, next) => {
        console.log('path before merging', req.params.paths);
        const key = req.params.paths.join('/');
        console.log('path after merge', key);
        const fileExist = await inits_1.s3CloudProvider.getFile(key);
        if (!fileExist) {
            throw new error_utils_1.NotFoundException('File not found');
        }
        await pipelinePromise(fileExist, res);
    });
    (0, connection_1.connectDB)();
    (0, redis_connect_1.redisConnect)();
    let query = new type_1.GraphQLObjectType({
        name: "RootQuery",
        fields: {
            user: {
                type: new type_1.GraphQLObjectType({
                    name: "UserQuery",
                    fields: {
                        id: { type: type_1.GraphQLID },
                        name: { type: type_1.GraphQLString },
                        email: { type: type_1.GraphQLString },
                        password: { type: type_1.GraphQLString },
                        phonenumber: { type: type_1.GraphQLString }
                    }
                }),
                resolve: () => {
                    return {
                        id: 1,
                        name: "ka3bora",
                        email: "ka3bora@g.com",
                        password: "123456",
                        phonenumber: "010203040"
                    };
                }
            },
            product: {
                type: new type_1.GraphQLObjectType({
                    name: "ProductQuery",
                    fields: {
                        id: { type: type_1.GraphQLID },
                        name: { type: type_1.GraphQLString },
                        price: { type: type_1.GraphQLFloat },
                        category: { type: type_1.GraphQLString },
                        brand: { type: type_1.GraphQLString },
                        discount: { type: type_1.GraphQLFloat }
                    }
                }),
                resolve: () => {
                    return {
                        id: 100,
                        name: "iphone17",
                        price: 3000,
                        category: "mobile",
                        brand: "apple",
                        discout: 30
                    };
                }
            }
        }
    });
    let schema = new type_1.GraphQLSchema({
        query
    });
    app.all('/graphql', (0, express_2.createHandler)({ schema }));
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({ origin: "*" }));
    app.post('/send-notification', async (req, res) => {
        let fcmToken = req.body.token;
        await init_1.firebasePushNotificationProvider.send(fcmToken, {
            title: "Welcome",
            body: `welcome to firebas push notification you receive token at ${new Date()}`
        });
        res.sendStatus(204);
    });
    app.use('/auth', modules_1.authRouter);
    app.use('/post', modules_1.postRouter);
    app.use('/comment', modules_1.commentRouter);
    app.use('/request', modules_1.requestRouter);
    app.use('/user', modules_1.userRouter);
    app.use((error, req, res, next) => {
        return res.status(error.cause || 500).json({
            message: error.message,
            stack: error.stack,
            success: false,
            details: error instanceof error_utils_1.BadRequestException ? error.details : undefined
        });
    });
    app.listen(port, () => {
        console.log(`app is running on port ${port}`);
    });
}
