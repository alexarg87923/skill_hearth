import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { IChatMessage } from '../models/chat_history';
import { validateSignUp, validateLogin, validateWizard } from '../validation/userValidation';
import bcrypt from 'bcryptjs';
import { CONSTANTS } from '../utils/constants';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
import { redisClient } from "../config/redis";
import { v4 as uuidv4 } from 'uuid';
import type { Session, SessionData } from 'express-session';
import { validateChatMessage } from '../validation/chatValidation';

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

    async signup(formData: ISignUpData): Promise<IUser | null | undefined> {
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

    async get_new_batch(user_id: string, interests: Types.ObjectId[], skills: Types.ObjectId[], users_to_avoid: Array<string> = [] ): Promise<Array<IUser>> {
        users_to_avoid.push(user_id)
        const result = await this.userRepository.get_batch_of_users(user_id, interests, skills, users_to_avoid);
        if (result !== undefined && result !== null) {
            logger.info(`Successfully fetched a new batch of users: ${JSON.stringify(result)}...`);
            return result;
        } else {
            throw Error('New batch of users came back undefined...');
        };
    };

    async handle_matching(session: Session & Partial<SessionData>, request_data: {user_id: string, status: string, other_users: Array<string>}): Promise<IUser | undefined>  {
        if (request_data?.user_id === undefined || request_data?.status === undefined || request_data.other_users === undefined) {
            logger.error("Form data is invalid...");
            return;
        };

        await this.userRepository.handleStatusUpdate(session.user.id, request_data.user_id, request_data.status);

        const userArr = await this.get_num_of_users(1, session, request_data.other_users);
        logger.info(`Replacement user: ${JSON.stringify(userArr)}`);
        if (userArr !== undefined && Array.isArray(userArr) && userArr.length === 1) {
            return userArr[0];
        };
    };

    async get_chat_history(userSession: Session & Partial<SessionData>): Promise<Array<IChatMessage> | undefined> {
        const chat_history = await this.userRepository.get_messages(new Types.ObjectId(userSession.id));

        if (chat_history !== undefined) {
            return chat_history
        };
    };

    async save_message(userSession: Session & Partial<SessionData>, formData: Partial<IChatMessage>): Promise<boolean> {
        const validationResult = validateChatMessage(formData);

        if (validationResult.error) {
            logger.error(`SAVE MESSAGE: ${validationResult.error.message}`);
            return false;
        };

        return !!(await this.userRepository.save_message({from: new Types.ObjectId(userSession.id), to: new Types.ObjectId(formData.to), message: formData.message, timestamp: new Date() }));
    };

    async get_num_of_users(num: number, session: Session & Partial<SessionData>, users_to_avoid: Array<string> = []): Promise<Array<IUser> | undefined> {
        // const matchCache = session.match_cache;
        // if (matchCache) { // check if we previously cached list of users so we don't repeat computation in this session
        //     logger.info("Cache hit!!");
        //     if (matchCache.length > num) {
        //         const [arr1, arr2] = [matchCache.slice(0, num), matchCache.slice(num)]
        //         session.match_cache = arr2;
        //         return arr1;
        //     };
        // };

        const userSession = session.user;
        const batch_of_users = await this.get_new_batch(userSession.id, userSession.interests, userSession.skills, users_to_avoid);
        if (batch_of_users !== undefined && batch_of_users !== null) {
            if (batch_of_users.length <= 0) { // if there are no more users to discover, return success with no list of users
                return;
            };

            if (batch_of_users.length > num) { 
                const [arr1, arr2] = [batch_of_users.slice(0, num), batch_of_users.slice(num)]
                session.match_cache = arr2;
                return arr1;
            };

            return batch_of_users;
        };
    };

    async send_email_verification(verification_link: string): Promise<undefined> {
        // await redisClient.setEx(`verify:${uuidv4()}`, 900, user_id);
        return;
    };

    async get_email_verification_link(user_id: string): Promise<undefined> {
        await redisClient.setEx(`verify:${uuidv4()}`, 900, user_id);
        return;
    };

    async verify_token(token: string): Promise<Boolean> {
        const verified_user_id = await redisClient.get(`verify:${token}`);
        if (verified_user_id === null) {
            return false;
        };
        const response = await this.userRepository.verify_user_email(verified_user_id);
        if (response === null) {
            return false;
        };
        return true;
    };
};