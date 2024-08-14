import Item from "../models/itemsModel";
import { NextFunction, Request, Response } from "express";
import { getUser } from "./userController";
import { errorDegugger } from "./authControllers";

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req);
    if (!user) return res.json({
        message: "User is Not Found"
    })
    const { title, description, images, startingPrice, auctionDuration, category } = req.body;
    const newItemObj = {
        title, description, images, startingPrice, auctionDuration, category, owner: user._id
    }
    try {
        const newItem = await Item.create(newItemObj);
        return res.json(newItem);
    } catch (error: any) {
        errorDegugger(error.message);
        next()
        return;
    }
}

export const deleteTheItem = async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req);
    if (!user) return res.json({
        message: "User is Not Found"
    });

    const itemId = req.params.id;

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this item"
            });
        }

        await Item.findByIdAndDelete(itemId);
        return res.json({
            message: "Item deleted successfully"
        });
    } catch (error: any) {
        errorDegugger(error.message);
        next();
        return;
    }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req);
    if (!user) return res.json({
        message: "User is Not Found"
    });

    const itemId = req.params.id;
    const updateData = req.body;

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this item"
            });
        }

        const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, { new: true });
        return res.json(updatedItem);
    } catch (error: any) {
        errorDegugger(error.message);
        next();
        return;
    }
}