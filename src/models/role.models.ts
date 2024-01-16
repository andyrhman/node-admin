import mongoose, { Schema } from 'mongoose';
import { IPermission } from './permission.models';

export interface IRole extends Document {
  _id: string;
  name: string;
  permissions: IPermission[]; 
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
});

export const Role = mongoose.model<IRole>('Role', RoleSchema);
