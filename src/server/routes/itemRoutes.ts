import { Router } from "express"
import * as itemsControllers from "../controllers/itemsControllers";
const router = Router();

router.post("/createItem", itemsControllers.createItem);

export default router