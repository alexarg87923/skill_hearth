
import mongoose, { Types } from 'mongoose';

export interface IUser {
    _id?: Types.ObjectId;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    email: string;
    password: string;
    onboarded: boolean;
    bio?: string | null;
    profile_picture?: string | null;
    phone_number?: string | null;
    location?: string | null;
    share_email?: boolean | null;
    skills?: Array<string> | null;
    interests?: Array<string> | null;
};

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    onboarded: { type: Boolean, required: true, default: false },
    bio: { type: String },
    profile_picture: { type: String },
    phone_number: { type: String },
    location: { type: String },
    share_email: { type: Boolean },
    skills: { type: Array },
    interests: { type: Array }
}, { strict: false });

export const User = mongoose.model('user', userSchema);

