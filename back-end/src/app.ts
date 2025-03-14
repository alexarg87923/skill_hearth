import express from "express";
import { connectDatabase } from "./config/database";
import { MainRouter } from "./routes";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ENV } from './config/env';
import { redisStore } from './config/redis';
import session from 'express-session';
import path from 'path';
import expressWs from 'express-ws';

declare module 'express-session' {
    export interface SessionData {
      user: any;
      match_cache: any;
    }
};

const { app } = expressWs(express());

var corsOptions;
var sessionOptions;
if (ENV.ENV_MODE === 'development') {
	corsOptions = {
		origin: 'http://localhost:5173',
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: ['Content-Type', 'Authorization', '*']
	};

    sessionOptions = {
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: ENV.REDIS_SECRET,
        cookie: { secure: false, maxAge: 60000, httpOnly: false }
    };
	console.log('CORS and session set up in development mode');
  } else {
	corsOptions = {
		origin: 'http://localhost',
	};

    sessionOptions = {
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: ENV.REDIS_SECRET,
        cookie: { secure: true, maxAge: 60000, httpOnly: true }
    };
	console.log('CORS and session in production mode');
};

// Connects to DB
connectDatabase();

// Middleware
expressWs(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session(sessionOptions));

// Route
app.use('/api', express.static(path.join(__dirname, 'assets')));
app.use("/api/", MainRouter);
app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500).json({ message: error.message });
});


app.ws('/api/ws/chat', (ws, req) => {
  ws.on('message', (msg: string) => {
    console.log(msg)
  });
});

export default app;