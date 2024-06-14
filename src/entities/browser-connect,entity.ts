import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { TelegramConnection } from './telegram-connection.entity'
import { Event } from './event.entity';

@Entity()
export class BrowserUpdate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=> TelegramConnection)
    connection: TelegramConnection;

    @ManyToOne(type=>User)
    user: User;

    @ManyToOne(type=>Event)
    event: Event;

    @Column()
    content: string;

    @CreateDateColumn()
    time: Date;

    @Column({ default: false })
    seen: boolean;
}