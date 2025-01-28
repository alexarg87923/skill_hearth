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
        password: Joi.string().min(8).required()
    });
    return schema.validate(formData);  
};


export const validateSignUp = (formData: Partial<IUser>) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).required().custom((v, h) => {return capitalizeFirstLetter(v)}),
        middle_name: Joi.string().allow(null).empty('').optional().custom((v, h) => {return capitalizeFirstLetter(v)}),
        last_name: Joi.string().min(3).required().custom((v, h) => {return capitalizeFirstLetter(v)}),
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });
    return schema.validate(formData);  
};