import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/stream-transport';
import { SEND_MAIL_PASSWORD, SEND_MAIL_USER } from '../../config';

export const sendMail=async({to,subject,html}:MailOptions)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:SEND_MAIL_USER,
            pass:SEND_MAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from:'"social app"<akram.deram@gmail.com>',
        to,
        subject,
        html
    });
}