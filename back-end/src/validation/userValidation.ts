import Joi from 'joi';
import passwordComplexity from "joi-password-complexity";
import { IUser } from '../models/user.model';

const capitalizeFirstLetter = (value: string) => {
    if (typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
};

export const validateLogin = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(formData);  
};


export const validateSignUp = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).required().custom((v, h) => {return capitalizeFirstLetter(v)}),
        middle_name: Joi.string().allow(null).empty('').optional().custom((v, h) => {return capitalizeFirstLetter(v)}),
        last_name: Joi.string().min(3).required().custom((v, h) => {return capitalizeFirstLetter(v)}),
        email: Joi.string().email().required(),
        password: Joi.required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
    });
    return schema.validate(formData);  
};

export const validateWizard = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        bio: Joi.string().required(),
        profile_picture: Joi.string().allow(null).empty('').optional(),
        phone_number: Joi.string().required(),
        location: Joi.string().required(),
        share_email: Joi.boolean().required(),
        skills: Joi.array().required(),
        interests: Joi.array().required()
    });
    return schema.validate(formData);
};