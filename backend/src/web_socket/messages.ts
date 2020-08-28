import WebSocket from 'ws';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Conversation } from '../entities/Conversation';
import { Message } from '../entities/Message';

export const clients = new Map<number, WebSocket>();

export interface WsTextMessage {
    type: "text",
    content: {
        conversationId: number,
        text: string
    }
}

export interface WsActionMessage {
    type: "action",
    content: {
        action: "create_conversation" | "delete_conversation",
        data: Conversation
    }
}

export default async function connection(ws: WebSocket, req: Request) {
    const userId = req.session.user.id;
    clients.set(userId, ws);

    ws.on('message', async (message: string) => {
        const incomingMessage: WsTextMessage = JSON.parse(message);
        handleTextMessage(incomingMessage, userId);
    });

    ws.on('close', () => {
        clients.delete(userId);
    });
}

async function handleTextMessage(message: WsTextMessage, userId: number) {
    const { conversationId, text } = message.content;

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
            client.send(JSON.stringify({ type: "text", content: savedMessage }));
        }
    }
}

