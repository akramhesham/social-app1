"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebasePushNotificationProvider = void 0;
const firebase_service_1 = require("./firebase.service");
const config_1 = require("../../../config");
// const config = JSON.parse(fs.readFileSync(
//     path.resolve(
//         "./src/config/social-app-c0c83-firebase-adminsdk-fbsvc-6fe5fe6671.json")
//     ) as unknown as string
// );
const config = JSON.parse(config_1.FIREBASE_CONFIG_FILE);
exports.firebasePushNotificationProvider = new firebase_service_1.FirebasePushNotificationProvider(config);
