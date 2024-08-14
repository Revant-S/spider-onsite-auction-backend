import { z } from "zod";
import { Types } from "mongoose";

export const auctionSchema = z.object({
    item: z.instanceof(Types.ObjectId),
    startTime: z.date(),
    endTime: z.date(),
    currentPrice: z.number().min(0),
    currentHighestBidder: z.instanceof(Types.ObjectId).optional(),
    bids: z.array(z.object({
        bidder: z.instanceof(Types.ObjectId),
        amount: z.number().min(0),
        time: z.date(),
    })),
    status: z.enum(['pending', 'active', 'ended', 'cancelled']),
    winner: z.instanceof(Types.ObjectId).optional(),
    finalPrice: z.number().min(0).optional(),
});


