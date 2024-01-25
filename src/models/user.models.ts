import mongoose, { Schema} from 'mongoose';
import { IRole } from './role.models';

// Step 1: Define the TypeScript interface for the User model
export interface IUser extends mongoose.Document {
  _id: string
  fullName: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  // Assuming you have a Role model defined elsewhere
  role: IRole;
}

// Step 2: Create the Mongoose schema
const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Replace 'Role' with your role model name if different
});

// Step 3: Apply any unique constraints and middleware
userSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
