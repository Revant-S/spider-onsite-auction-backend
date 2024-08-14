import { NextFunction, Request, Response } from "express";
import { valiadteUserBody } from "../../validation/userValidation";
import User from "../models/userModal";
import debug from "debug";
import bcrypt from "bcrypt"
import { sendEmail } from "../../services/mailService";
import crypto from "crypto"
export const errorDegugger = debug("app:errorDegugger")
const authControllerDebug = debug("app:authControllerDebugger")



export function generateRandomString(length: number) {
    const bytesNeeded = Math.ceil(length / 2);
    const randomBytes = crypto.randomBytes(bytesNeeded);
    const hexString = randomBytes.toString('hex');
    return hexString.slice(0, length);
}


export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { email, passcode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send("User Not Found");
        const passcodeVerified = (user.passcode === passcode);
        if (!passcodeVerified) return res.json({
            message: "Passcode is incorrect"
        })
        authControllerDebug("User Verified!!")
        user.accountActivated = 1;
        await user.save();
        return res.json({
            message: "User Verified Sucessfully"
        })
    } catch (error) {
        errorDegugger("Something Went Wrong")
        next()
        return
    }


}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const userBody = req.body;
    authControllerDebug(userBody);
    const validate = valiadteUserBody(userBody);
    authControllerDebug(validate)
    if (!validate.success) return res.json({
        messgae: "Bad Request"
    })
    try {
        const newUser = await User.create(validate.data);
        const passCodeGenerated = generateRandomString(10);
        await sendEmail(newUser.email, passCodeGenerated);
        newUser.passcode = passCodeGenerated;
        await newUser.save();
        return res.send({
            message: "User Created Sucessfullly Please Verify Your Account By Visiting the Link in your email",
        })
    } catch (error: any) {
        errorDegugger(error.message)
        return res.json({
            message: "User Already exists"
        })
    }
}


export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const userBody = req.body;
    const validate = valiadteUserBody(userBody);

    if (!validate.success) return res.json({
        message: "Bad Request"
    })
    try {
        const user = await User.findOne({ email: userBody.email })
        if (!user) return res.send("Sorry Bro")
        const valid = await bcrypt.compare(userBody.password, user.password);
        authControllerDebug(valid)
        if (user.accountActivated === 0) return res.json({ message: "Please Verify your Account" })
        const authToken = user.getAuthToken();
        console.log(authToken);
        return res.cookie("token", authToken, { httpOnly: true, maxAge: 60*60*1000*24 }).json({
            message: "User LoggedIn Sucessfully"
        })

    } catch (error: any) {
        errorDegugger(error.message)
        next()
        return;
    }
}