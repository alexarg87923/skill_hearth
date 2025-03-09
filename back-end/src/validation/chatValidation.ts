import Joi from 'joi';
import { IChatMessage } from '../models/chat_history';

const JoiObjectId = require('joi-objectid')(Joi);

export const validateChatMessage = (formData: Partial<IChatMessage>) => {
    const schema = Joi.object({
        to: JoiObjectId().required(),
        message: Joi.string().required()
    });
    return schema.validate(formData);  
};