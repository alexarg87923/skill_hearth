import express from 'express';
import cookieParser from 'cookie-parser';

import { MainRouter } from './routes';

// Initialize components
const app = express();
const PORT = 3001;


// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', MainRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
