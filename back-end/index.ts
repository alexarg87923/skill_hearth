import express from 'express';
import { MainRouter } from './routes';

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api', MainRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
