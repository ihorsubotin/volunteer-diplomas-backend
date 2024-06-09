import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { TelegramConnection } from './telegramConnection.entity'

@Entity()
export class Update {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TelegramConnection)
    connection: TelegramConnection;

    @Column()
    content: string;

    @CreateDateColumn()
    time: Date;

    @Column({ default: false })
    seen: boolean;
}