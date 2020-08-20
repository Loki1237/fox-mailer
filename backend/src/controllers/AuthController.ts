import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { AuthError } from '../errors/AuthError';
import { Controller, Post, Req, Res } from 'routing-controllers';

@Controller()
export class AuthController {

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response) {
        if (!process.env.JWT_SECRET) {
            console.log('JWT_SECRET is required');
            return res.status(500);
        }

        const { userName, password } = req.body;
        const userRepository = getRepository(User);

        if (!userName) {
            return res.status(400).send(new AuthError('userName is required'));
        }
        if (!password) {
            return res.status(400).send(new AuthError('password is required'));
        }

        const user = await userRepository.createQueryBuilder("user")
            .select(["user.id", "user.userName", "user.firstName", "user.lastName"])
            .addSelect("user.passwordHash")
            .where("user.userName = :userName", { userName })
            .getOne();

        if (!user) {
            return res.status(400).send(new AuthError('incorrect userName or password'));
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).send(new AuthError('incorrect userName or password'));
        }

        delete user.passwordHash;
        const token = jwt.sign({ id: user.id, userName }, process.env.JWT_SECRET);
        return res.status(200).cookie('AUTH_TOKEN', token).send(user);
    }

    @Post('/login/as')
    async loginAs(@Req() req: Request, @Res() res: Response) {
        delete req.session.user.passwordHash;
        return res.status(200).cookie('AUTH_TOKEN', req.cookies.AUTH_TOKEN).send(req.session.user);
    }

    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        return res.clearCookie('AUTH_TOKEN').send();
    }

    @Post('/signup')
    async signup(@Req() req: Request, @Res() res: Response) {
        const { userName, password, firstName, lastName } = req.body;
        const userRepository = getRepository(User);

        if (!userName) {
            return res.status(400).send(new AuthError('userName is required'));
        }

        const user = await userRepository.findOne({ userName });
        if (user) {
            return res.status(400).send(new AuthError('userName already taken'));
        }

        if (!password) {
            return res.status(400).send(new AuthError('password is required'));
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = new User();
        newUser.userName = userName;
        newUser.passwordHash = passwordHash;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        await userRepository.save(newUser);

        return res.status(200).send();
    }

}
