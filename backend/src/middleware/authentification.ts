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
            throw new Error();
        }

        if (!token) {
            throw new Error();
        }

        interface DecodedToken { id: number, userName: string, iat: string };
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        if (!decodedToken) {
            throw new Error();
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ id: decodedToken.id });
        req.body.user = user;

        return next();
    } catch {
        return res.status(401).send();
    }
};
