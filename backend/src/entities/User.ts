import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Conversation } from './Conversation';

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userName!: string;

    @Column({ select: false })
    passwordHash!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @ManyToMany(() => User, user => user.contacts)
    @JoinTable()
    contacts!: User[];

    @ManyToMany(() => Conversation, conversation => conversation.participants)
    conversations!: Conversation[];

}
