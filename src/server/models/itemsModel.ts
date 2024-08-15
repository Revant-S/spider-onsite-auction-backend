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
        min: 1,
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
    },
    rating : {
        type : Number,
        min : 0,
        max : 10,
        default : 0
    }
});

itemSchema.methods.addRating = async function (newRating: number) {
    if (newRating < 0 || newRating > 10) {
        throw new Error('Rating must be between 0 and 10');
    }
    this.totalRatings += newRating;
    this.ratingCount += 1;
    this.rating = this.totalRatings / this.ratingCount;
    this.ratings.push(newRating);
    await this.save();
};

const Item = mongoose.model<ItemSchema, ItemModel>("Item", itemSchema);

export default Item;
