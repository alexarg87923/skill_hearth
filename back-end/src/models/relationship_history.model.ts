
import mongoose, { Types } from 'mongoose';

export interface IRelationshipHistory {
    _id: Types.ObjectId;
    relationship_id: Types.ObjectId;
    previous_status: "pending" | "matched" | "not_interested" | "created";
    new_status: "pending" | "matched" | "not_interested";
    changed_by: Types.ObjectId;
    changed_at: Date;
};

const relationshipHistorySchema = new mongoose.Schema({
    relationship_id: { type: Types.ObjectId, required: true },
    previous_status: { type: String, required: true, oneOf: ["pending", "matched", "not_interested"] },
    new_status: { type: String, required: true, oneOf: ["pending", "matched", "not_interested"] },
    changed_by: { type: Types.ObjectId, required: true },
    changed_at: { type: Date, required: true, default: Date.now() }
});

export const RelationshipHistory = mongoose.model('relationship_history', relationshipHistorySchema);

