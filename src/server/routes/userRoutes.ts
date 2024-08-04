import { Router } from "express";
import * as userControllers from "../controllers/userController"
const router = Router();

router.get("/getUser", userControllers.userRequestexpress)


export default router