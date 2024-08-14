import { z } from "zod"
import { auctionSchema } from "../validation/auction";

export interface AuctionSchema extends z.infer<typeof auctionSchema> {
    roomId : string
}


export interface AuctionMethods { }

export type AuctionModel = Model<AuctionSchema, {}, AuctionMethods>;