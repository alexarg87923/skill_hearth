import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import { ENV } from './env';

const client = createClient({
    url: ENV.REDIS_URI
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect().catch(console.error);

const store = new RedisStore({
    client: client,
    prefix: "skill-hearth:"
});

export const redisClient = client;
export const redisStore = store;

