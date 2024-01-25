import mongoose, { Schema } from "mongoose";

export interface IProduct extends mongoose.Document {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    created_at: Date;
    updated_at: Date;
}

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

export const Product = mongoose.model<IProduct>('Product', ProductSchema)