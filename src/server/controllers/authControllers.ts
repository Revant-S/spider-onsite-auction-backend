import { Request, Response } from "express";
import { valiadteUserBody } from "../../validation/userValidation";
import User from "../models/userModal";
import debug from "debug";
import { ToastMessage } from "../../types/toastmessage";
import { MongooseError } from "mongoose";
import bcrypt from "bcrypt"
export const errorDegugger = debug("app:errorDegugger")

const authControllerDebug = debug("app:authControllerDebugger")

export const redirectToSignin = (res: Response, message: ToastMessage, toStgnin: boolean) => {
    if (toStgnin) return res.status(404).render("signin", message);
    res.status(404).render("signup", message)
}


export const getSigninPage = (req: Request, res: Response) => res.render("signin");

export const getSignupPage = (req: Request, res: Response) => res.render("signup");

export const signup = async (req: Request, res: Response) => {
    const userBody = req.body;
    authControllerDebug(userBody)
    authControllerDebug("HERE")
    const validate = valiadteUserBody(userBody);
    authControllerDebug(validate)
    if (!validate.success) return res.render("signup", { toastRequried: true, toastInfo: { message: "BAD REQUEST" } });
    try {
        const newUser = await User.create(validate.data);
        const token = newUser.getAuthToken();
        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        }).render("home", {
            user: newUser
        })
    } catch (error: any) {
        errorDegugger(error.message)
        if ((error as MongooseError).message.includes("E11000 duplicate key error collection")) {
            return redirectToSignin(res, {
                toastRequired: true,
                toastInfo: {
                    message: "User Already Registered"
                },
                svg: "warning"
            }, false)
        }
        redirectToSignin(res, {
            toastRequired: true,
            toastInfo: {
                message: "SomeThing Went Wrong"
            },
            svg: "cross"
        }, false)
    }
}


export const signin = async (req: Request, res: Response) => {
    const userBody = req.body;
    const validate = valiadteUserBody(userBody);
    authControllerDebug("User Signed in ")
    if (!validate.success) return res.render("signin", { toastRequried: true, toastInfo: { message: "BAD REQUEST" } });
    try {
        const user = await User.findOne({ email: userBody.email })
        if (!user) {
            return redirectToSignin(res, {
                toastRequired: true,
                toastInfo: {
                    message: "Username or password is incorrect"
                },
                svg: "cross"
            }, true)
        }
        const valid = await bcrypt.compare(userBody.password, user.password);
        authControllerDebug(valid)
        if (!valid) return redirectToSignin(res, {
            toastRequired: true,
            toastInfo: {
                message: "Invalid Email or password",
            },
            svg: "cross"
        }, true)

        const authToken = user.getAuthToken();
        res.cookie("token", authToken, { httpOnly: true, maxAge: 36000 }).redirect("/home")

    } catch (error: any) {
        errorDegugger(error.message)
        redirectToSignin(res, {
            toastRequired: true,
            toastInfo: {
                message: "SomeThing Went Wrong"
            },
            svg: "cross"
        }, true)
    }
}