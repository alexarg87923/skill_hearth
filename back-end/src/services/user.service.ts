import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { validateSignUp, validateLogin, validateWizard } from '../validation/userValidation';
import bcrypt from 'bcryptjs';
import { CONSTANTS } from '../utils/constants';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
import { redisClient } from "../config/redis";
import { v4 as uuidv4 } from 'uuid';

interface ILoginData {
    email: string;
    password: string;
};

interface ISignUpData {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    email: string;
    password: string;
    confirm_password?: string;
};

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    };

    async login(formData: ILoginData): Promise<Partial<IUser> | null | undefined> {
        const { error } = validateLogin(formData);
        if (error) {
            logger.error(`${CONSTANTS.ERRORS.INVALID_INPUT}: ${error.message}`);
            return;
        };
        logger.info('Login form data appears to be valid...');

        var userRecord = await this.userRepository.findUserByEmail(formData.email!);
        if (userRecord === null || userRecord === undefined || !userRecord) {
            logger.error(CONSTANTS.ERRORS.USER_NOT_FOUND);
            return;
        };
        logger.info('A user record does exist with this email');
        
        const isMatch = await bcrypt.compare(formData.password, userRecord.password!);

        if (isMatch) {
            logger.info('Passwords match!!');
            return userRecord;
        } else {
            logger.error(CONSTANTS.ERRORS.PASSWORD_MISMATCH);
            return;
        }
    };

    async signup(formData: ISignUpData): Promise<Partial<IUser> | null | undefined> {
        const result = validateSignUp(formData);

        if (result.error) {
            logger.error(`${CONSTANTS.ERRORS.INVALID_INPUT}: ${result.error.message}`);
            return;
        };
        logger.info('No error when validating sign up form data...');
        delete result.value.confirm_password;
        logger.info('Deleting confirm_password field because not required in the database...');

        const existingUserRecord = await this.userRepository.findUserByEmail(result.value.email);
        if (existingUserRecord) {
            logger.error(CONSTANTS.ERRORS.EMAIL_ALREADY_IN_USE);
            return;
        };
        logger.info('A record does not exist with this email...');

        const hashPassword = await bcrypt.hash(result.value.password, CONSTANTS.SALT_ROUNDS);
        const newUser: IUser = {
            ...result.value,
            password: hashPassword,
            onboarded: false
        } as IUser;
        const newUserRecord = await this.userRepository.createUser(newUser);
        if (newUserRecord) {
            return newUserRecord;
        };

        logger.error(CONSTANTS.ERRORS.CATASTROPHIC);
        return;
    };
    
    async onboard_user(formData: Partial<IUser>, user_id: string): Promise<Partial<IUser> | null | undefined> {
        const result = validateWizard(formData);

        if (result.error) {
            logger.error(`Form data is incorrect... ${result.error}`);
            return;
        };
        logger.info('No error when validating wizard form data...');
        
        return (await this.userRepository.addProfile(formData, user_id));
    };

    async get_new_batch(user_id: string, interests: Types.ObjectId[], skills: Types.ObjectId[] ): Promise<Array<Partial<IUser>> | undefined> {
        const result = await this.userRepository.get_batch_of_users(user_id, interests, skills);
        if (result?.user_profiles !== undefined && result?.user_profiles !== null) {
            logger.info('Successfully fetched a new batch of users...');
            return result.user_profiles;
        };
        logger.info('New batch of users came back undefined...');
    };

    async handle_interested(user_id: string, match_id: string): Promise<Partial<IUser> | undefined> {
        const response = await this.userRepository.match(user_id, match_id);
        return;
    };

    async handle_not_interested(user_id: string, match_id: string): Promise<Partial<IUser> | undefined> {
        return;
    };

    async send_email_verification(user_id: string): Promise<Partial<IUser> | undefined> {
        await redisClient.setEx(`verify:${uuidv4()}`, 900, user_id);
        return;
    };

    async verify_token(token: string): Promise<Boolean> {
        const verified_user_id = await redisClient.get(`verify:${token}`);
        if (verified_user_id === null) {
            return false;
        };
        const response = await this.userRepository.verify_user(verified_user_id);
        if (response === null) {
            return false;
        };
        return true;
    };
};