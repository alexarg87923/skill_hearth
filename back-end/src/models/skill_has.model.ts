
import mongoose, { Types } from 'mongoose';

export interface ISkillHas {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    skill_id: Types.ObjectId;
};

const skillHasSchema = new mongoose.Schema({
    user_id: { type: Types.ObjectId, required: true },
    skill_id: { type: Types.ObjectId, required: true }
});

export const SkillHas = mongoose.model('skill_has', skillHasSchema);

