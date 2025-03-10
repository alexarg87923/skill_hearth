
import mongoose, { Types } from 'mongoose';

export interface ICity {
    _id: Types.ObjectId;
    name: string;
};

const citySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

export const Cities = mongoose.model('cities', citySchema);