import { Controller, Get, Post, Put, Delete, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';
import { Conversation } from '../entities/Conversation';
import { Message } from '../entities/Message';
import { User } from '../entities/User';

@Controller()
export class MessageController {

    @Get('/conversations/get/all')
    async getConversations(@Req() req: Request, @Res() res: Response) {
        const qb = getRepository(User).createQueryBuilder("user");
        const user = await qb
            .select(["user.id"])
            .where("user.id = :id", { id: req.session.user.id })
            .leftJoinAndSelect("user.conversations", "conversation")
            .leftJoinAndSelect(
                "conversation.messages",
                "message",
                "message.id = " + qb.subQuery()
                                    .select("MAX(message.id)")
                                    .from(Message, "message")
                                    .leftJoin("message.conversation", "message_conversation")
                                    .where("message_conversation.id = conversation.id")
                                    .getQuery()
            )
            .leftJoinAndSelect("conversation.participants", "participant", "conversation.type = 'dialog'")
            .orderBy("message.id", "DESC")
            .getOne();

        if (!user) {
            return res.status(400).send("user not found");
        }

        // Для диалогов - установить поле "name" = имя + фамилия собеседника
        for (let conversation of user.conversations) {
            if (conversation.type === "dialog") {
                let participants = conversation.participants;
                if (participants[0].id !== req.session.user.id) {
                    conversation.name = `${participants[0].firstName} ${participants[0].lastName}`;
                } else {
                    conversation.name = `${participants[1].firstName} ${participants[1].lastName}`;
                }
            }
        }

        return res.status(200).send(user.conversations);
    }

    @Get('/conversations/get/one/:id')
    async getConversation(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId: req.session.user.id })
            .innerJoinAndSelect(
                "user.conversations",
                "conversation",
                "conversation.id = :conversationId",
                { conversationId: +req.params.id }
            )
            .leftJoinAndSelect("conversation.participants", "participant")
            .leftJoinAndSelect("conversation.messages", "message")
            .orderBy("message.id", "DESC")
            .getOne();

        if (!user) {
            return res.status(404).send();
        }

        const conversation = user.conversations[0];
        if (conversation.type === "dialog") {
            for (let participant of conversation.participants) {
                if (participant.id !== req.session.user.id) {
                    conversation.name = `${participant.firstName} ${participant.lastName}`;
                }
            }
        }

        return res.status(200).send(conversation);
    }

    @Post('/conversations/check/dialog')
    async checkDialogToExistence(@Req() req: Request, @Res() res: Response) {
        if (req.body.interlocutorId === req.session.user.id) {
            return res.status(400).send();
        }

        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .select(["user.id"])
            .where("user.id = :id", { id: req.session.user.id })
            .innerJoinAndSelect(
                "user.conversations",
                "conversation",
                "conversation.type = :dialog",
                { dialog: "dialog" }
            )
            .innerJoin(
                "conversation.participants",
                "participant",
                "participant.id = :interlocutorId",
                { interlocutorId: req.body.interlocutorId }
            )
            .getOne();

        if (!user) {
            return res.status(204).send();
        }

        return res.status(200).send(user.conversations[0]);
    }

    @Post('/conversations/create/dialog')
    async createDialog(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const interlocutor = await userRepository.findOne({ id: req.body.interlocutorId });

        if (!interlocutor || interlocutor.id === req.session.user.id) {
            return res.status(400).send();
        }

        const dialog = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :id", { id: req.session.user.id })
            .innerJoinAndSelect(
                "user.conversations",
                "conversation",
                "conversation.type = :dialog",
                { dialog: "dialog" }
            )
            .innerJoinAndSelect(
                "conversation.participants",
                "participant",
                "participant.id = :interlocutorId",
                { interlocutorId: interlocutor.id }
            )
            .getOne();

        if (dialog) {
            return res.status(409).send("this dialog already exist");
        }

        const conversationRepository = getRepository(Conversation);
        const newDialog = await conversationRepository.create({
            type: "dialog",
            creatorId: req.session.user.id,
            participants: [req.session.user, interlocutor],
            messages: []
        });
        const createdDialog = await conversationRepository.save(newDialog);

        for (let participant of createdDialog.participants) {
            if (participant.id !== req.session.user.id) {
                createdDialog.name = `${participant.firstName} ${participant.lastName}`;
            }
        }

        return res.status(200).send(createdDialog);
    }

    @Post('/conversations/create/chat')
    async createChat(@Req() req: Request, @Res() res: Response) {
        if (!req.body.name) {
            return res.status(400).send("chat name is required");
        }

        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .select("user.id")
            .where("user.id = :id", { id: req.session.user.id })
            .leftJoinAndSelect("user.contacts", "contact", "contact.id IN (:...ids)", { ids: req.body.userIds })
            .getOne()

        if (!user) {
            return res.status(400).send("user not found");
        }

        const conversationRepository = getRepository(Conversation);
        const newChat = await conversationRepository.create({
            type: "chat",
            name: req.body.name,
            creatorId: req.session.user.id,
            participants: [req.session.user, ...user.contacts],
            messages: []
        });
        const createdChat = await conversationRepository.save(newChat);

        return res.status(200).send(createdChat);
    }

    @Delete('/conversations/delete/:id')
    async deleteConversation(@Req() req: Request, @Res() res: Response) {
        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId: req.session.user.id })
            .innerJoinAndSelect(
                "user.conversations",
                "conversation",
                "conversation.id = :conversationId",
                { conversationId: +req.params.id }
            )
            .getOne();

        if (!user) {
            return res.status(400).send("conversation not found");
        }

        const conversationRepository = getRepository(Conversation);
        await conversationRepository.delete({ id: +req.params.id });

        return res.status(200).send();
    }

}
