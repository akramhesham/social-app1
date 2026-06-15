"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailer = void 0;
const config_1 = require("../../../config");
const nodemailer_service_1 = require("./nodemailer.service");
exports.nodeMailer = new nodemailer_service_1.NodemailerProvider({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config_1.SEND_MAIL_USER,
        pass: config_1.SEND_MAIL_PASSWORD
    }
});
