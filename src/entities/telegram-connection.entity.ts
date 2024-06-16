import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TelegramConnection {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	user: User;

	@Column()
	connectToken: string;

	@Column({ nullable: true })
	validUntil: Date;

	@Column({ nullable: true })
	telegramUser: string;

	@Column({ nullable: true })
	userInfo: string;
}