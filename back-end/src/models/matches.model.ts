
import mongoose, { Types } from 'mongoose';

export interface IMatch {
    _id?: Types.ObjectId;
    name: string;
    has_interest: Array<string>;
    looking_for: Array<string>;
};

const matchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    has_interest: { type: Array, required: true },
    looking_for: { type: Array, required: true }
});

export const Matches = mongoose.model('matches', matchSchema);

