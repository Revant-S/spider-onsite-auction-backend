import { z } from "zod";

export const itemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    images: z.array(z.string().url()),
    startingPrice: z.number().min(0),
    auctionDuration: z.number().min(1), 
    category: z.string().min(1),
});
