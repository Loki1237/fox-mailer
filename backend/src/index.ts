import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { entities } from './entities';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { authentification } from './middleware/authentification';

dotenv.config();

createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities,
    synchronize: true,
}).then(() => {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(authentification);

    useExpressServer(app, {
        routePrefix: '/api',
        controllers: [UserController, AuthController]
    });

    app.listen(3000, () => console.log('Running'));
}).catch(console.log);
