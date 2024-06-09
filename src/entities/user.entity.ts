import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Volunteer } from './volunteer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({nullable: true})
  region: string;

  @OneToOne(type=>Volunteer, volunteer=>volunteer.user)
  @JoinColumn()
  volunteer: Volunteer;
}