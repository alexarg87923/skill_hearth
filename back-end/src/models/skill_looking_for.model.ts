
import mongoose, { Types } from 'mongoose';

export interface ISkillLookingFor {
    _id?: Types.ObjectId;
    user_id: Types.ObjectId;
    skill_id: Types.ObjectId;
};

const skillSchema = new mongoose.Schema({
    user_id: { type: Types.ObjectId, required: true },
    skill_id: { type: Types.ObjectId, required: true }
});

export const SkillLookingFor = mongoose.model('skill_looking_for', skillSchema);

