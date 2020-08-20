import { Controller, Get, Post, Put, Delete, Req, Res, Param } from 'routing-controllers';
import { Request, Response } from 'express';
import { getRepository, Not } from 'typeorm';
import { User } from '../entities/User';
import _ from 'lodash';

@Controller()
export class UserController {

    @Get('/contacts')
    async getContacts(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .select(["user.id"])
            .where("user.id = :id", { id: req.session.user.id })
            .leftJoin("user.contacts", "contacts")
            .addSelect(["contacts.id", "contacts.userName", "contacts.firstName", "contacts.lastName"])
            .orderBy("contacts.firstName", "ASC")
            .getOne();

        if (!user) {
            return res.status(400).send();
        }

        return res.status(200).send(user.contacts);
    }

    @Post('/users/search')
    async search(@Req() req: Request, @Res() res: Response) {
        const fullName = req.body.string.split(" ");
        const userId = req.session.user.id;

        const firstName = `%${fullName[0]}%`;
        const lastName = fullName.length >= 2 ? `%${fullName[1]}%` : "%%";

        const userRepository = getRepository(User);
        const users = await userRepository
            .createQueryBuilder("user")
            .select(["user.id", "user.userName", "user.firstName", "user.lastName"])
            .where("LOWER(user.firstName) LIKE LOWER(:firstName) AND user.id != :userId", { firstName, userId })
            .andWhere("LOWER(user.lastName) LIKE LOWER(:lastName)", { lastName })
            .orWhere("LOWER(user.firstName) LIKE LOWER(:lastName) AND user.id != :userId", { lastName, userId })
            .andWhere("LOWER(user.lastName) LIKE LOWER(:firstName)", { firstName })
            .orderBy({ "user.id": "DESC" })
            .skip(req.body.skipCount)
            .take(20)
            .getMany();

        return res.status(200).send(users);
    }

    @Put('/contacts/add/:id')
    async addContact(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({
            where: {
                id: req.session.user.id
            },
            relations: ["contacts"]
        });

        if (!user || +req.params.id === req.session.user.id) {
            return res.status(400).send();
        }

        if (_.findIndex(user.contacts, { id: +req.params.id }) >= 0) {
            return res.status(409).send();
        }

        const newContact = await userRepository.findOne({ id: +req.params.id });
        if (!newContact) {
            return res.status(400).send();
        }

        userRepository.merge(user, { contacts: [...user.contacts, newContact] });
        await userRepository.save(user);

        return res.status(200).send(newContact);
    }

    @Delete('/contacts/delete/:id')
    async deleteContact(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({
            where: {
                id: req.session.user.id
            },
            relations: ["contacts"]
        });

        if (!user) {
            return res.status(400).send();
        }

        const index = _.findIndex(user.contacts, { id: +req.params.id });
        if (index >= 0) {
            user.contacts.splice(index, 1);
            userRepository.merge(user, { contacts: [...user.contacts] });
            await userRepository.save(user);
        }

        return res.status(200).send();
    }

}
