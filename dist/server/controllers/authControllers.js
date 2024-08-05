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
exports.signin = exports.signup = exports.getSignupPage = exports.getSigninPage = exports.redirectToSignin = exports.errorDegugger = void 0;
const userValidation_1 = require("../../validation/userValidation");
const userModal_1 = __importDefault(require("../models/userModal"));
const debug_1 = __importDefault(require("debug"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.errorDegugger = (0, debug_1.default)("app:errorDegugger");
const authControllerDebug = (0, debug_1.default)("app:authControllerDebugger");
const redirectToSignin = (res, message, toStgnin) => {
    if (toStgnin)
        return res.status(404).render("signin", message);
    res.status(404).render("signup", message);
};
exports.redirectToSignin = redirectToSignin;
const getSigninPage = (req, res) => res.render("signin");
exports.getSigninPage = getSigninPage;
const getSignupPage = (req, res) => res.render("signup");
exports.getSignupPage = getSignupPage;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userBody = req.body;
    authControllerDebug(userBody);
    authControllerDebug("HERE");
    const validate = (0, userValidation_1.valiadteUserBody)(userBody);
    authControllerDebug(validate);
    if (!validate.success)
        return res.render("signup", { toastRequried: true, toastInfo: { message: "BAD REQUEST" } });
    try {
        const newUser = yield userModal_1.default.create(validate.data);
        const token = newUser.getAuthToken();
        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        }).render("home", {
            user: newUser
        });
    }
    catch (error) {
        (0, exports.errorDegugger)(error.message);
        if (error.message.includes("E11000 duplicate key error collection")) {
            return (0, exports.redirectToSignin)(res, {
                toastRequired: true,
                toastInfo: {
                    message: "User Already Registered"
                },
                svg: "warning"
            }, false);
        }
        (0, exports.redirectToSignin)(res, {
            toastRequired: true,
            toastInfo: {
                message: "SomeThing Went Wrong"
            },
            svg: "cross"
        }, false);
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userBody = req.body;
    const validate = (0, userValidation_1.valiadteUserBody)(userBody);
    authControllerDebug("User Signed in ");
    if (!validate.success)
        return res.render("signin", { toastRequried: true, toastInfo: { message: "BAD REQUEST" } });
    try {
        const user = yield userModal_1.default.findOne({ email: userBody.email });
        if (!user) {
            return (0, exports.redirectToSignin)(res, {
                toastRequired: true,
                toastInfo: {
                    message: "Username or password is incorrect"
                },
                svg: "cross"
            }, true);
        }
        const valid = yield bcrypt_1.default.compare(userBody.password, user.password);
        authControllerDebug(valid);
        if (!valid)
            return (0, exports.redirectToSignin)(res, {
                toastRequired: true,
                toastInfo: {
                    message: "Invalid Email or password",
                },
                svg: "cross"
            }, true);
        const authToken = user.getAuthToken();
        res.cookie("token", authToken, { httpOnly: true, maxAge: 36000 }).redirect("/home");
    }
    catch (error) {
        (0, exports.errorDegugger)(error.message);
        (0, exports.redirectToSignin)(res, {
            toastRequired: true,
            toastInfo: {
                message: "SomeThing Went Wrong"
            },
            svg: "cross"
        }, true);
    }
});
exports.signin = signin;
