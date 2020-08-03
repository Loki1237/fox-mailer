import { Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity("conversations")
export class Conversation {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, { nullable: false })
    creator!: User;

    @OneToMany(() => Message, message => message.conversation)
    messages!: Message[];

    @ManyToMany(() => User, user => user.conversations)
    @JoinTable()
    participants!: User[];

}
