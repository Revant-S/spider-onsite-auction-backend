import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "config"
import { errorDegugger } from "../controllers/authControllers";
import { UserPayload, UserRequest } from "../../types/request";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.token;
    console.log(req.cookies);
    
    if (!token) {
        return res.json({message : "Token Not found"});
    }
    try {
        const payload: UserPayload = <UserPayload>jwt.verify(token, config.get("JWT_SECRET_KEY"));
        (req as UserRequest).userPayload = payload;
        next()
        return;
    } catch (error: any) {
        errorDegugger((error as jwt.JsonWebTokenError).message);
        return res.json({
            message : "Session is Timed Out"
        })

    }
}