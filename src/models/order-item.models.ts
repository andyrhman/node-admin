import mongoose, { Schema } from "mongoose";

export interface IOrderItem extends Document {
    _id: string;
    product_title: string;
    price: number;
    quantity: number;
    order: string;
}

export const OrderItemSchema = new Schema({
    product_title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
})

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);