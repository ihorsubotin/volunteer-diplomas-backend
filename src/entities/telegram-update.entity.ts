import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { TelegramConnection } from './telegram-connection.entity'
import { Event } from './event.entity';

@Entity()
export class TelegramUpdate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=> TelegramConnection, {nullable: false})
    connection: TelegramConnection;

    @ManyToOne(type=>Event, {nullable: false})
    event: Event;

    @Column()
    content: string;

    @CreateDateColumn()
    time: Date;

    @Column({ default: false })
    seen: boolean;
}