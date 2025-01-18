import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MainRouter } from './routes';

// Initialize components
const app = express();
const PORT = 3001;
const ENV = process.env.NODE_ENV || 'development';

var corsOptions;
  
if (ENV === 'development') {
	corsOptions = {
		origin: 'http://localhost:3000',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: ['Content-Type', 'Authorization', '*']
	};
	console.log('CORS in development mode: allowing all origins');
  } else {
	corsOptions = {
		origin: 'http://localhost',
	};
	console.log('CORS in production mode: allowing only http://localhost');
}


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use('/api', MainRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
