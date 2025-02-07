import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { validateSignUp, validateLogin, validateWizard } from '../validation/userValidation';
import bcrypt from 'bcryptjs';
import { CONSTANTS } from '../utils/constants';
import { logger } from '../utils/logger';

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
        delete formData.confirm_password;
        logger.info('Deleting confirm_password field because not required in the database...');
        
        const existingUserRecord = await this.userRepository.findUserByEmail(formData.email);
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
    }
    
    async onboard_user(formData: Partial<IUser>, userID: string): Promise<Partial<IUser> | null | undefined> {
        const result = validateWizard(formData);

        if (result.error) {
            logger.error(`Form data is incorrect... ${result.error}`);
            return;
        };
        logger.info('No error when validating wizard form data...');
        
        return (await this.userRepository.addProfile(formData, userID));
    };

    async get_new_batch(userID: string): Promise<Array<Partial<IUser>> | null | undefined> {
        // this.userRepository.getUsers
        return;
    };
};