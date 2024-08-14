import { Router } from "express"
import * as authControllers from "../controllers/authControllers"
const router = Router();


router.post("/signin",authControllers.signin);
router.post("/signup", authControllers.signup);
router.post("/verifyEmail", authControllers.verifyAccount);

export default router