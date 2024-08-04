import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";


export interface UserPayload extends JwtPayload{
    _id : Types.ObjectId
}
export interface UserRequest extends Request{
    userPayload : UserPayload
}