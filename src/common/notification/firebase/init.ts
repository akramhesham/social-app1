import path from "node:path";
import { FirebasePushNotificationProvider } from "./firebase.service";
import * as fs from 'node:fs';
import { FIREBASE_CONFIG_FILE } from "../../../config";

// const config = JSON.parse(fs.readFileSync(
//     path.resolve(
//         "./src/config/social-app-c0c83-firebase-adminsdk-fbsvc-6fe5fe6671.json")
//     ) as unknown as string
// );
const config=JSON.parse(FIREBASE_CONFIG_FILE as string)

export const firebasePushNotificationProvider = new FirebasePushNotificationProvider(config);