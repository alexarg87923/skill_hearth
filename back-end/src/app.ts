import express from "express";
import { connectDatabase, initDatabase } from "./config/database";
import { MainRouter } from "./routes";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ENV } from './config/env';
import redisStore from './config/redis';
import session from 'express-session';

const app = express();
var corsOptions;

declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
    }
}

  
if (ENV.ENV_MODE === 'development') {
	corsOptions = {
		origin: 'http://localhost:5173',
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

// Connects to DB
connectDatabase();

// Init for dev purposes
initDatabase();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: true,
      secret: ENV.REDIS_SECRET
    })
  );

// Routes
app.use("/api/", MainRouter);

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500).json({ message: error.message });
});

export default app;