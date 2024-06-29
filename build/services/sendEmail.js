"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendEmail;
const Nodemailer = __importStar(require("nodemailer"));
// async..await is not allowed in global scope, must use a wrapper
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, code, message = "verify your email address" }) {
        let transporter = Nodemailer.createTransport({
            name: "danielnwokocha", //www.agronigeria.ng
            host: "smtp.office365.com", //mail.agronigeria.ng smtp-mail.outlook.com
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "danielnwokocha@outlook.com", //no-reply@agronigeria.ng
                pass: "AvocadoNebulla9098!@#", //AgroNigA!!en90
            },
        });
        // setup e-mail data, even with unicode symbols
        var mailOptions = {
            from: 'danielnwokocha@outlook.com',
            to: `${email}`,
            subject: `Verify Email`,
            text: `Use this code to verify email ${code}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h3>Loose Therapy Application Onboarding Verification Code</h3>
            <p>A verification code is needed to continue the Onboarding process</p>
            
            <h1> ${code} </h1>

            <p> This code will expire in 30 minutes </p>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Loose Therapy App Team</em>
            </p>
        </div>
        `
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    });
}
