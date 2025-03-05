
import mongoose, { Types } from 'mongoose';

export interface ISkill {
    _id?: Types.ObjectId;
    name: string;
};

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

export const Skill = mongoose.model('skill', skillSchema);

