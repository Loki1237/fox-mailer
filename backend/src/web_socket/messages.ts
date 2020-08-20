import WebSocket from 'ws';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Message } from '../entities/Message';

const clients = new Map();

export default async function connection(ws: WebSocket, req: Request) {
    const userId = req.session.user.id;
    clients.set(userId, ws);

    ws.on('message', async (message: string) => {
        const { conversationId, text } = JSON.parse(message);

        const userRepository = getRepository(User);
        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :userId", { userId })
            .innerJoinAndSelect(
                "user.conversations",
                "conversation",
                "conversation.id = :conversationId",
                { conversationId }
            )
            .leftJoinAndSelect("conversation.participants", "participant")
            .getOne();

        if (!user) return;

        const messageRepository = getRepository(Message);
        const newMessage = await messageRepository.create({
            conversation: user.conversations[0],
            authorId: user.id,
            text,
            createdAt: new Date()
        });
        await messageRepository.save(newMessage);

        const savedMessage: any = { ...newMessage };
        delete savedMessage.conversation;
        savedMessage.conversationId = newMessage.conversation.id;

        for (let participant of user.conversations[0].participants) {
            const client = clients.get(participant.id);
            if (client) {
                client.send(JSON.stringify(savedMessage));
            }
        }
    });

    ws.on('close', () => {
        clients.delete(userId);
    });
}
