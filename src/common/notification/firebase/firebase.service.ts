
import { INotificationProvider } from "../notification.interface";


export class FireBasePushNotificationProvider implements INotificationProvider{

    send(token: string, data: { title: string; body: String; }): Promise<void> {
        throw new Error("Method not implemented.");
    }

}