import { Request, Response } from "express";
import { UserRequest } from "../../types/request";
import User from "../models/userModal";


export const getUser = async (req : Request)=>{
    const userId = (req as UserRequest).userPayload.id;
    console.log(userId);
    return await User.findById(userId);
}


export const userRequestexpress = async (req : Request , res : Response)=>{
    const user = await getUser(req);
    res.send(user);
}

