import mongoose from "mongoose";
import { ItemSchema, ItemModel } from "../../types/items";

const itemSchema = new mongoose.Schema<ItemSchema, ItemModel>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: {
        type: [String],
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    auctionDuration: {
        type: Number,
        required: true,
        min: 1,//in hours
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const Item = mongoose.model<ItemSchema, ItemModel>("Item", itemSchema);

export default Item;
