import { z } from "zod";
import { itemSchema } from "../validation/items";
import { Model, Types } from "mongoose";


export interface ItemSchema extends z.infer<typeof itemSchema> {
    createdAt?: Date;
    updatedAt?: Date;
    owner : Types.ObjectId,
    buyers : Types.ObjectId[]
}

export interface ItemMethods {

}

export type ItemModel = Model<ItemSchema, {}, ItemMethods>;
