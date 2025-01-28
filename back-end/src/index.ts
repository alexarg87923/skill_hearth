import app from "./app";
import { ENV } from "./config/env";
import { logger } from './utils/logger';

app.listen(ENV.PORT, () => {
    logger.info(`Server running on http://localhost:${ENV.PORT}`);
});