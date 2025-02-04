
import mongoose, { Types } from 'mongoose';

export interface IProfileData {
    _id?: Types.ObjectId;
    bio: string;
    profile_picture?: string;
    phone_number: string;
    location: string;
    share_email: boolean;
    skills: Array<string>;
    interests: Array<string>;
};

const ProfileData = new mongoose.Schema({
    bio: { type: String, required: true },
    profile_picture: { type: String },
    phone_number: { type: String, required: true },
    location: { type: String, required: true, unique: true },
    share_email: { type: Boolean, required: true },
    skills: { type: Array<String>, required: true, default: false },
    interests: { type: Array<String>, required: true, default: false }
});

export const User = mongoose.model('ProfileData', ProfileData);

