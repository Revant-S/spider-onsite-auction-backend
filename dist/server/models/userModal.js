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
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const debug_1 = __importDefault(require("debug"));
const config_1 = __importDefault(require("config"));
const dbDebugger = (0, debug_1.default)("app:dbDebugger");
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        minLength: 5,
    },
    email: {
        type: String,
        lowerCase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    }
});
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        dbDebugger("New User Created");
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
    });
});
userSchema.methods.getAuthToken = function () {
    const payLoad = {
        id: this._id,
    };
    return jsonwebtoken_1.default.sign(payLoad, config_1.default.get("JWT_SECRET_KEY"));
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
