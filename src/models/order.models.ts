import mongoose, { Schema } from "mongoose";
import { IOrderItem, OrderItemSchema } from "./order-item.models";

export interface IOrder extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    created_at: string;
    order_items: IOrderItem[]
}

const OrderSchema = new Schema<IOrder>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    virtuals: {
        total: {
            get(): number {
                return this.order_items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            }
        }
    },
    toJSON: { virtuals: true }
})

export const Order = mongoose.model<IOrder>('Order', OrderSchema)