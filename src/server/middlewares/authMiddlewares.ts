import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "config"
import { errorDegugger, redirectToSignin } from "../controllers/authControllers";
import { UserPayload, UserRequest } from "../../types/request";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.token;
    if (!token) {
        redirectToSignin(res , {
            toastRequired: true,
            toastInfo: {
                message: "Session Timed Out"
            },
            svg : "cross"
        }, true)
    }
    try {
        const payload: UserPayload = <UserPayload>jwt.verify(token, config.get("JWT_SECRET_KEY"));
        (req as UserRequest).userPayload = payload;
    } catch (error: any) {
        redirectToSignin(res , {
            toastRequired: true,
            toastInfo: {
                message: "Session Timed Out"
            }, 
            svg : "cross"
        }, true)
        errorDegugger((error as jwt.JsonWebTokenError).message);

    }
}