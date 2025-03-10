
import mongoose, { Types } from 'mongoose';

export interface IChatMessage {
    _id: Types.ObjectId;
    to: Types.ObjectId;
    from: Types.ObjectId;
    message: string;
    timestamp: Date;
};

const chatHistorySchema = new mongoose.Schema({
    to: { type: Types.ObjectId, required: true },
    from: { type: Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now() }
});

export const ChatHistory = mongoose.model('chat_history', chatHistorySchema);

