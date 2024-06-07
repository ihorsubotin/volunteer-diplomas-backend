import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TelegramConnection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: number;

  @Column()
  connectToken: string;

  @Column({nullable: true})
  validUntil: Date;

  @Column({nullable: true})
  userInfo: string;

  @Column({nullable: true})
  sid: string;
}