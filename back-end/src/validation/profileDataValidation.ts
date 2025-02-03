import Joi from 'joi';
import { IProfileData } from '../models/profile.model';

export const validateWizard = (formData: Partial<IProfileData>) => {
    const schema = Joi.object({
        bio: Joi.string().required(),
        profile_picture: Joi.string(),
        phone_number: Joi.string().required(),
        loction: Joi.string().required(),
        share_email: Joi.boolean().required(),
        skills: Joi.array().required(),
        interests: Joi.array().required()
    });
    return schema.validate(formData);
};