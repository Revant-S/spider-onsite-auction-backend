import { Router } from "express";
import * as auctionController from "../controllers/auctionControllers";
const router = Router();

router.post("/createAuction", auctionController.createAuction)

export default router;