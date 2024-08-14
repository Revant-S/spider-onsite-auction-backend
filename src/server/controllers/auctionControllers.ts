import { NextFunction, Request, Response } from "express";
import { getUser } from "./userController";
import Item from "../models/itemsModel";
import Auction from "../models/auctionModel";
import { errorDegugger } from "./authControllers";


export const createAuction = async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req);
    if (!user) return res.json({
        message: "User Not Found"
    })
    const { itemid, hours } = req.body;
    const item = await Item.findById(itemid);
    if (!item) return res.json({ message: "Item Not Found" })
    const currentPrice = item.startingPrice;
    if (!item) return res.json({ message: "Item Not Found" });
    const verifyOwner = item.owner.toString() === user._id.toString();
    if (!verifyOwner) return res.json({ message: "You are not the owner of this artifact" });
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
    try {
        const newAuction = await Auction.create({
            item: itemid,
            currentPrice,
            endTime

        })
        















        return res.json({ newAuction })
    } catch (error: any) {
        errorDegugger(error.message)
        return next()
    }
}
