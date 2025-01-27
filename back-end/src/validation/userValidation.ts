import Joi from 'joi';
import passwordComplexity from "joi-password-complexity";
import { IUser } from '../models/user.model';

export const validateLogin = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(formData);  
};


export const validateSignUp = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).required(),
        middle_name: Joi.string().allow(null).empty('').optional(),
        last_name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });
    return schema.validate(formData);  
};