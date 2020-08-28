import { Controller, Get, Post, Put, Delete, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Conversation } from '../entities/Conversation';
import { Message } from '../entities/Message';
import { User } from '../entities/User';
import { clients, WsActionMessage } from '../web_socket/messages';

const setDialogName = (user: User, participants: User[]) => {
    if (participants[0].id !== user.id) {
        return `${participants[0].firstName} ${participants[0].lastName}`;
    } else {
        return `${participants[1].firstName} ${participants[1].lastName}`;
    }
};

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
                "message.createdAt = " + qb.subQuery()
                                           .select("MAX(message.createdAt)")
                                           .from(Message, "message")
                                           .leftJoin("message.conversation", "message_conversation")
                                           .where("message_conversation.id = conversation.id")
                                           .getQuery()
            )
            .leftJoinAndSelect("conversation.participants", "participant", "conversation.type = 'dialog'")
            .orderBy("message.createdAt", "DESC")
            .getOne();

        if (!user) {
            return res.status(400).send("user not found");
        }

        for (let conversation of user.conversations) {
            if (conversation.type === "dialog") {
                conversation.name = setDialogName(req.session.user, conversation.participants);
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
            .getOne();

        if (!user) {
            return res.status(400).send("conversation not found");
        }

        const conversation = user.conversations[0];
        conversation.messages = [];

        if (conversation.type === "dialog") {
            conversation.name = setDialogName(req.session.user, conversation.participants);
        }

        return res.status(200).send(conversation);
    }

    @Post('/messages/get/many')
    async getMessages(@Req() req: Request, @Res() res: Response) {
        const { conversationId, skip } = req.body;

        const conversationRepository = getRepository(Conversation);
        const conversation = await conversationRepository
            .createQueryBuilder("conversation")
            .where("conversation.id = :conversationId", { conversationId })
            .innerJoin("conversation.participants", "participant", "participant.id = :id", { id: req.session.user.id })
            .getOne();

        if (!conversation) {
            return res.status(400).send("conversation not found");
        }

        const messageRepository = getRepository(Message);
        const messages = await messageRepository
            .createQueryBuilder("message")
            .leftJoin("message.conversation", "conversation", "conversation.id = :conversationId", { conversationId })
            .where("conversation.id = :conversationId")
            .orderBy({ "message.createdAt": "DESC" })
            .skip(skip)
            .take(30)
            .getMany();

        return res.status(200).send(messages);
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

        const messageRepository = getRepository(Message);
        const newMessage = await messageRepository.create({
            conversation: createdDialog,
            authorId: req.session.user.id,
            text: req.body.firstMessage,
            createdAt: new Date()
        });
        await messageRepository.save(newMessage);
        createdDialog.messages = [newMessage];

        const client = clients.get(interlocutor.id);
        if (client) {
            createdDialog.name = `${req.session.user.firstName} ${req.session.user.lastName}`;

            const wsMessage: WsActionMessage = {
                type: "action",
                content: {
                    action: "create_conversation",
                    data: createdDialog
                }
            };
            client.send(JSON.stringify(wsMessage));
        }

        createdDialog.name = `${interlocutor.firstName} ${interlocutor.lastName}`;
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

        const wsMessage: WsActionMessage = {
            type: "action",
            content: {
                action: "create_conversation",
                data: createdChat
            }
        };

        for (let participant of createdChat.participants) {
            const client = clients.get(participant.id);
            if (client && participant.id !== req.session.user.id) {
                client.send(JSON.stringify(wsMessage));
            }
        }

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
            .leftJoinAndSelect("conversation.participants", "participant")
            .getOne();

        if (!user) {
            return res.status(400).send("conversation not found");
        }

        const conversationRepository = getRepository(Conversation);
        await conversationRepository.delete({ id: +req.params.id });

        const deletedConversation = user.conversations[0];
        const wsMessage: WsActionMessage = {
            type: "action",
            content: {
                action: "delete_conversation",
                data: deletedConversation
            }
        };

        for (let participant of deletedConversation.participants) {
            const client = clients.get(participant.id);
            if (client && participant.id !== req.session.user.id) {
                client.send(JSON.stringify(wsMessage));
            }
        }

        return res.status(200).send();
    }

}
