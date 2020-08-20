import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Request } from 'express';

export async function authentificate(req: Request, handleError: (err: string) => void) {
    const cookieString = req.headers.cookie;
    let AUTH_TOKEN = "";

    if (cookieString) {
        const cookieArray = cookieString.split('; ');
        for (let cookie of cookieArray) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === "AUTH_TOKEN") {
                AUTH_TOKEN = cookieValue;
            }
        }
    }

    try {
        if (!AUTH_TOKEN) {
            throw new Error('AUTH_TOKEN not found');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is required');
        }

        interface DecodedToken { id: number, userName: string, iat: string };
        const decodedToken = jwt.verify(AUTH_TOKEN, process.env.JWT_SECRET) as DecodedToken;

        if (!decodedToken) {
            throw new Error('invalid AUTH_TOKEN');
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ id: decodedToken.id });

        if (!user) {
            throw new Error('user not found');
        }

        req.session = { user };
        return user.id
    } catch (e) {
        handleError(e.message);
    }
};
