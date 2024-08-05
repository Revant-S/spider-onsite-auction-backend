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
exports.userRequestexpress = exports.getUser = void 0;
const userModal_1 = __importDefault(require("../models/userModal"));
const getUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userPayload._id;
    return yield userModal_1.default.findById(userId);
});
exports.getUser = getUser;
const userRequestexpress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUser)(req);
    res.send(user);
});
exports.userRequestexpress = userRequestexpress;
