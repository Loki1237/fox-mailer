import dotenv from 'dotenv';
import express, { Request } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { entities } from './entities';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { MessageController } from './controllers/MessageController';
import { authentification } from './middleware/authentification';
import messagesWebSocketConnect from './web_socket/messages';
import { authentificate } from './web_socket/auth_for_ws';

dotenv.config();

createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities,
    synchronize: true
}).then(() => {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(authentification);

    useExpressServer(app, {
        routePrefix: '/api',
        controllers: [UserController, AuthController, MessageController]
    });

    const server = http.createServer(app);
    const wss = new WebSocket.Server({ noServer: true, path: '/messages' });

    server.on('upgrade', async (req, socket, head) => {
        await authentificate(req, err => {
            socket.write(err);
            socket.destroy();
            return;
        });

        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit('connection', ws, req);
        });
    });

    wss.on('connection', messagesWebSocketConnect);

    server.listen(3000, () => console.log('Running'));
}).catch(console.log);
