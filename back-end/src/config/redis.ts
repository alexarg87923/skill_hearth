import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import { ENV } from './env';
let redisClient = createClient({
    url: ENV.REDIS_URI
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "skill-hearth:"
});

export default redisStore;
