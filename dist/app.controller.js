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
