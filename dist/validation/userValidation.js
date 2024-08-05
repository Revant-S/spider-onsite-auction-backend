"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valiadteUserBody = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    userName: zod_1.z.string().min(5).max(255).optional(),
    password: zod_1.z.string().min(6).max(255),
    email: zod_1.z.string().email()
});
const valiadteUserBody = (userBody) => {
    return exports.userSchema.safeParse(userBody);
};
exports.valiadteUserBody = valiadteUserBody;
