import { z } from "zod";
import { userSchema } from "../validation/userValidation";
import { Model } from "mongoose";

export interface UserSchema extends z.infer<typeof userSchema> { }


export interface UserMethods {
    getAuthToken() : string,
}

type UserModel = Model<UserSchema , {} , UserMethods>