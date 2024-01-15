import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  _id: string;
  name: string;
}

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true }
});

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
