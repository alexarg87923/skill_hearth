
import mongoose, { Types } from 'mongoose';

export interface IRelationship {
    _id: Types.ObjectId;
    user1_id: Types.ObjectId;
    user2_id: Types.ObjectId;
    status: "pending" | "matched" | "not_interested"
    updated_at: Date
};

const relationshipSchema = new mongoose.Schema({
    user1_id: { type: Types.ObjectId, required: true },
    user2_id: { type: Types.ObjectId, required: true },
    status: { type: String, required: true, oneOf: ["pending", "matched", "not_interested"] },
    updated_at: { type: Date, required: true }
});

export const Relationship = mongoose.model('relationship', relationshipSchema);

