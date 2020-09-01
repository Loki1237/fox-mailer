import { Handler } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

const urlExceptions = ['/api/login', '/api/logout', '/api/signup'];

export const authentification: Handler = async (req, res, next) => {
    if (urlExceptions.indexOf(req.url) >= 0) {
        return next();
    }

    const token = req.cookies.AUTH_TOKEN;

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).send('JWT_SECRET is required');
        }

        if (!token) {
            throw new Error('AUTH_TOKEN is required');
        }

        interface DecodedToken { id: number, userName: string, iat: string };
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        if (!decodedToken) {
            throw new Error('invalid AUTH_TOKEN');
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ id: decodedToken.id });
        req.session = { user };

        return next();
    } catch (e) {
        return res.status(401).send(e.message);
    }
};
