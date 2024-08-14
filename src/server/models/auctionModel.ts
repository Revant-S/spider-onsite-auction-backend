import mongoose from "mongoose";
import { AuctionSchema, AuctionModel } from "../../types/auctions";

const auctionSchema = new mongoose.Schema<AuctionSchema, AuctionModel>({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    startTime: {
        type: Date,
        required: true,
        default : Date.now()
    },
    endTime: {
        type: Date,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true,
        min: 0
    },
    currentHighestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bids: {
        type : [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        time: {
            type: Date,
            default: Date.now
        }
    }],
    default : []
},
    status: {
        type: String,
        enum: ['pending', 'active', 'ended', 'cancelled'],
        default: 'pending'
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    finalPrice: {
        type: Number,
        min: 0
    },
    roomId : {
        type : String,
        default : ""
    }
});

const Auction = mongoose.model<AuctionSchema, AuctionModel>("Auction", auctionSchema);

export default Auction;