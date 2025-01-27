import mongoose from 'mongoose';
import { ENV } from "./env";
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(ENV.DB_URI);
        logger.info('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};

export const initDatabase = async () => {
    try {

    } catch (error) {
        console.error('Error initializing the database.')
    }
}
