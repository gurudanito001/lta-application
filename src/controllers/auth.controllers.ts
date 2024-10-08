import { Request, Response } from 'express';
import {
  createUser,
  //createUserListeningPreferences,
  getAllUsers,
  getUserByEmail,
  updateUser,
  updateUserByEmail,
} from '../models/users.models';
import config from "../config/config"
import { getEmailByName, deleteEmail, createEmail, updateEmail } from '../models/emails.models';
import type { User } from '@prisma/client';
import { getUserFilters } from '../models/users.models';
import { generateRandomCode } from '../services/generateVerificationCode';
import sendEmail from '../services/sendEmail';
import { hashPassword } from '../services/authServices';
import { uploadImage } from '../services/fileService';
import { isPasswordMatch } from '../services/authServices';
import { generateToken } from '../services/tokenService';
import countries from '../data/countries';
const nodeoutlook = require('../services/outlookSendEmail');


export const verifyEmailController =  async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    console.log(email)
    // check if email has been taken
    const userData = await getUserByEmail(email);
    const emailData = await getEmailByName(email);
    // check if email belongs to a user
    if(userData){
      res.status(400).json({ message: "Email has already been taken", status: "error" });
    }
    // check if email has been verified
    if(emailData?.verified){
      res.status(400).json({ message: "Email has already been verified", status: "error" });
    }
    // generate 4 digit code
    const randomCode = generateRandomCode();
    if(emailData?.email){
      //update it with the new verification code
      await updateEmail(email, {code: randomCode})
    }else{
      // save verification code in email model
      await createEmail({email: email, code: randomCode})
    }
    // send email to user email
    await sendEmail({email, code: randomCode});

    /* nodeoutlook.sendEmail({
      auth: {
        user: config.email_username,
        pass: config.email_password
      },
      from: config.email_username,
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
      onError: (e: any) => console.log(e),
      onSuccess: (i: any) => console.log(i)
    }); */


    res.status(200).json({ message: "Verification code will be sent to email", status: "success", payload: {code: randomCode} });
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const confirmVerificationCodeController =  async (req: Request, res: Response) => {
  try {
    const {email, code} = req.body;
    // get Email Data
    const emailData = await getEmailByName(email);
    
    // check if code is valid
    if (emailData?.code !== parseInt(code)) {
      res.status(400).json({ message: "Invalid code", status: "error" })
    }else{
      let updatedEmail = await updateEmail(email, {verified: true})
      res.status(200).json({ message: "Email Verification Successful", status: "success" });
    }
    
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const registerController =  async (req: Request, res: Response) => {
  try {
    const {firstName, lastName, email, password, userType, username, country, gender, profileImage, bio, topics, language} = req.body;
    // check if email is verified 
    const emailData = await getEmailByName(email)
    if(!emailData?.verified){
      res.status(400).json({ message: "Email is not verified",status: "error"})
    }
    if(password.length < 8){
      res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }
    // hash password
    const hashedPassword = await hashPassword(password)

    // save image to cloud
    let result = null;
    if(profileImage){
      result = await uploadImage({data: profileImage})
      //console.log("image upload result", result)
    }
    // create user 
    const user = await createUser({firstName, lastName, userType, username, country, gender, email, password: hashedPassword,  profileImage: result?.url || "", bio, topics, language, emailVerified: true})
    /* if(user?.userType === "listener"){
      await createUserListeningPreferences({userId: user?.id})
    } */
    
    res.status(201).json({message: "User Registration Successful", status: "success", payload: user})
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const loginController =  async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    // get user data
    const userData = await getUserByEmail(email)
    if(!userData){
      return res.status(400).json({message: "Email or Password Invalid", status: "error"})
    }
    // check if password matches
    let passwordMatched = await isPasswordMatch(password, userData.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Email or Password Invalid", status: "error" })
    } 
    await updateUser(userData?.id, {online: true});
    const token = generateToken({userId: userData?.id, email, expires: process.env.ACCESS_TOKEN_EXPIRY, type: 'ACCESS', secret: process.env.SECRET,})
    userData.password = ""
    res.status(201).json({message: "User Login Successful", status: "success", payload: {user: userData, token: token} })
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const forgotPasswordController =  async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    let user = await getUserByEmail(email); 
    if(!user){
      return res.status(404).json({message: 'User with email does not exist', status: "error"})
    }
    const randomCode = generateRandomCode()
    await updateEmail(email, {code: randomCode})
    //await sendEmail({email, code: randomCode})


    await sendEmail({email, code: randomCode, title: "Forgot Password Verification Mail", message: "reset your password"});
    /* nodeoutlook.sendEmail({
      auth: {
        user: config.email_username,
        pass: config.email_password
      },
      from: config.email_username,
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
      onError: (e: any) => console.log(e),
      onSuccess: (i: any) => console.log(i)
    }); */



    res.status(200).json({message: "Verification Code sent to email", status: "success", payload: {code: randomCode}})
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const resetPasswordController =  async (req: Request, res: Response) => {
  try {
    const { code, email, newPassword } = req.body;
    const emailData = await getEmailByName(email);
    if (newPassword?.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }
    if (emailData?.code !== code) {
      res.status(400).json({ message: "Invalid reset password code", status: "error" })
    } else {
      const hashedPassword = await hashPassword(newPassword);
      await updateUserByEmail(email, { password: hashedPassword })
    }
    res.status(200).json({ message: "password reset successful", status: "success" })

  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getCountriesController =  async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Countries fetched Successfully", status: "success", payload: countries }) 
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};