import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Volunteer } from './volunteer.entity';
import { Contractor } from './contractor.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  email: string;

  @Column({nullable: true})
  passwordHash: string;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({nullable: true})
  region: string;

  @OneToOne(type=>Volunteer, volunteer=>volunteer.user)
  @JoinColumn()
  volunteer: Volunteer;

  @OneToOne(type=>Contractor, contractor=>contractor.user)
  @JoinColumn()
  contractor: Contractor;

  @Column({default: false})
  isPartial: boolean;
}