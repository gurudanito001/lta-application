"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountriesController = exports.resetPasswordController = exports.forgotPasswordController = exports.loginController = exports.registerController = exports.confirmVerificationCodeController = exports.verifyEmailController = void 0;
const users_models_1 = require("../models/users.models");
const config_1 = __importDefault(require("../config/config"));
const emails_models_1 = require("../models/emails.models");
const generateVerificationCode_1 = require("../services/generateVerificationCode");
const authServices_1 = require("../services/authServices");
const fileService_1 = require("../services/fileService");
const authServices_2 = require("../services/authServices");
const tokenService_1 = require("../services/tokenService");
const countries_1 = __importDefault(require("../data/countries"));
const nodeoutlook = require('../services/outlookSendEmail');
const verifyEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log(email);
        // check if email has been taken
        const userData = yield (0, users_models_1.getUserByEmail)(email);
        const emailData = yield (0, emails_models_1.getEmailByName)(email);
        // check if email belongs to a user
        if (userData) {
            res.status(400).json({ message: "Email has already been taken", status: "error" });
        }
        // check if email has been verified
        if (emailData === null || emailData === void 0 ? void 0 : emailData.verified) {
            res.status(400).json({ message: "Email has already been verified", status: "error" });
        }
        // generate 4 digit code
        const randomCode = (0, generateVerificationCode_1.generateRandomCode)();
        if (emailData === null || emailData === void 0 ? void 0 : emailData.email) {
            //update it with the new verification code
            yield (0, emails_models_1.updateEmail)(email, { code: randomCode });
        }
        else {
            // save verification code in email model
            yield (0, emails_models_1.createEmail)({ email: email, code: randomCode });
        }
        // send email to user email
        //await sendEmail({email, code: randomCode});
        nodeoutlook.sendEmail({
            auth: {
                user: config_1.default.email_username,
                pass: config_1.default.email_password
            },
            from: config_1.default.email_username,
            to: email,
            subject: 'Email Verification',
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h3>Loose Therapy Application</h3>
            <p>Use this code to verify your email</p>
            
            <h1> ${randomCode} </h1>

            <p> This code will expire in 30 minutes </p>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Loose Therapy App Team</em>
            </p>
        </div>
        `,
            text: `Use this code to verify your email ${randomCode}`,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        });
        res.status(200).json({ message: "Verification code will be sent to email", status: "success", payload: { code: randomCode } });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.verifyEmailController = verifyEmailController;
const confirmVerificationCodeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        // get Email Data
        const emailData = yield (0, emails_models_1.getEmailByName)(email);
        // check if code is valid
        if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) !== parseInt(code)) {
            res.status(400).json({ message: "Invalid code", status: "error" });
        }
        else {
            let updatedEmail = yield (0, emails_models_1.updateEmail)(email, { verified: true });
            res.status(200).json({ message: "Email Verification Successful", status: "success" });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.confirmVerificationCodeController = confirmVerificationCodeController;
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, userType, username, country, gender, profileImage, bio, topics, language } = req.body;
        // check if email is verified 
        const emailData = yield (0, emails_models_1.getEmailByName)(email);
        if (!(emailData === null || emailData === void 0 ? void 0 : emailData.verified)) {
            res.status(400).json({ message: "Email is not verified", status: "error" });
        }
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" });
        }
        // hash password
        const hashedPassword = yield (0, authServices_1.hashPassword)(password);
        // save image to cloud
        let result = null;
        if (profileImage) {
            result = yield (0, fileService_1.uploadImage)({ data: profileImage });
            //console.log("image upload result", result)
        }
        // create user 
        const user = yield (0, users_models_1.createUser)({ firstName, lastName, userType, username, country, gender, email, password: hashedPassword, profileImage: (result === null || result === void 0 ? void 0 : result.url) || "", bio, topics, language, emailVerified: true });
        if ((user === null || user === void 0 ? void 0 : user.userType) === "listener") {
            yield (0, users_models_1.createUserListeningPreferences)({ userId: user === null || user === void 0 ? void 0 : user.id });
        }
        res.status(201).json({ message: "User Registration Successful", status: "success", payload: user });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // get user data
        const userData = yield (0, users_models_1.getUserByEmail)(email);
        if (!userData) {
            return res.status(400).json({ message: "Email or Password Invalid", status: "error" });
        }
        // check if password matches
        let passwordMatched = yield (0, authServices_2.isPasswordMatch)(password, userData.password);
        if (!passwordMatched) {
            return res.status(400).json({ message: "Email or Password Invalid", status: "error" });
        }
        const token = (0, tokenService_1.generateToken)({ userId: userData === null || userData === void 0 ? void 0 : userData.id, email, expires: process.env.ACCESS_TOKEN_EXPIRY, type: 'ACCESS', secret: process.env.SECRET, });
        userData.password = "";
        res.status(201).json({ message: "User Login Successful", status: "success", payload: { user: userData, token: token } });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.loginController = loginController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        let user = yield (0, users_models_1.getUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ message: 'User with email does not exist', status: "error" });
        }
        const randomCode = (0, generateVerificationCode_1.generateRandomCode)();
        yield (0, emails_models_1.updateEmail)(email, { code: randomCode });
        //await sendEmail({email, code: randomCode})
        nodeoutlook.sendEmail({
            auth: {
                user: config_1.default.email_username,
                pass: config_1.default.email_password
            },
            from: config_1.default.email_username,
            to: email,
            subject: 'Forgot Password Verification Mail',
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h3>Loose Therapy Application</h3>
            <p>Use this code to reset your password</p>
            
            <h1> ${randomCode} </h1>

            <p> This code will expire in 30 minutes </p>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Loose Therapy App Team</em>
            </p>
        </div>
        `,
            text: `Use this code to reset your password ${randomCode}`,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        });
        res.status(200).json({ message: "Verification Code sent to email", status: "success", payload: { code: randomCode } });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.forgotPasswordController = forgotPasswordController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, email, newPassword } = req.body;
        const emailData = yield (0, emails_models_1.getEmailByName)(email);
        if ((newPassword === null || newPassword === void 0 ? void 0 : newPassword.length) < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" });
        }
        if ((emailData === null || emailData === void 0 ? void 0 : emailData.code) !== code) {
            res.status(400).json({ message: "Invalid reset password code", status: "error" });
        }
        else {
            const hashedPassword = yield (0, authServices_1.hashPassword)(newPassword);
            yield (0, users_models_1.updateUserByEmail)(email, { password: hashedPassword });
        }
        res.status(200).json({ message: "password reset successful", status: "success" });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.resetPasswordController = resetPasswordController;
const getCountriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Countries fetched Successfully", status: "success", payload: countries_1.default });
    }
    catch (error) {
        res.status(500).json({ message: `Something went wrong ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.getCountriesController = getCountriesController;
