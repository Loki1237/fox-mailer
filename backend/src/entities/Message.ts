import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Conversation } from './Conversation';

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Conversation)
    conversation!: Conversation;

    @OneToOne(() => User)
    author!: User;

    @Column()
    text!: string;

    @CreateDateColumn()
    createdAt!: Date;

}
