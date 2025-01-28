
import mongoose, { Types } from 'mongoose';

export interface IUser {
    _id?: Types.ObjectId;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    email: string;
    password: string;
    onboarded: boolean;
}

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    onboarded: { type: Boolean, required: true, default: false }
});

export const User = mongoose.model('User', userSchema);

