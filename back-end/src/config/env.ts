import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/skill-hearth-db',
    ENV_MODE: process.env.ENV_MODE || 'development',
    REDIS_SECRET: process.env.REDIS_SECRET || 'secret'
};