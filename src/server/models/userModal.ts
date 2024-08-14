import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import debug from "debug";
import config from "config"
import { UserMethods, UserModel, UserSchema } from "../../types/user";
const dbDebugger = debug("app:dbDebugger");


const userSchema = new mongoose.Schema<UserSchema, UserModel , UserMethods>({
    userName : {
        type : String,
        minLength : 5,
    },
    email : {
        type : String,
        lowerCase : true,
        unique : true,
        required : true
    },
    password : {
        type : String,
        min : 6,
        required : true
    },
    accountActivated : {
        type : Number,
        enum : [0,1],
        default : 0
    },
    passcode : {
        type : String,
    }
})
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    dbDebugger("New User Created")
    const salt = await bcrypt.genSalt(10);
    this.password = await  bcrypt.hash(this.password , salt);
})

userSchema.methods.getAuthToken = function(){
    const payLoad = {
        id : this._id,
    }
    return jwt.sign(payLoad , config.get("JWT_SECRET_KEY"));
}




const User =  mongoose.model<UserSchema , UserModel>("User", userSchema);

export default User