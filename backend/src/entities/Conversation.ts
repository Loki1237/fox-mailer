import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Column, JoinTable } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity("conversations")
export class Conversation {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: "dialog" | "chat";

    @Column({ nullable: true })
    name?: string;

    @Column()
    creatorId!: number;

    @OneToMany(() => Message, message => message.conversation)
    messages!: Message[];

    @ManyToMany(() => User, user => user.conversations)
    @JoinTable()
    participants!: User[];

}
