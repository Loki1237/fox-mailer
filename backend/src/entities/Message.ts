import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './Conversation';

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Conversation, { onDelete: "CASCADE" })
    conversation!: Conversation;

    @Column()
    authorId!: number;

    @Column()
    text!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
