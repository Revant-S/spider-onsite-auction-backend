import { Router } from "express"
import * as authControllers from "../controllers/authControllers"
const router = Router();


router.get("/signin", authControllers.getSigninPage);
router.get("/signup", authControllers.getSignupPage);
router.post("/signin",authControllers.signin);
router.post("/signup", authControllers.signup);

export default router