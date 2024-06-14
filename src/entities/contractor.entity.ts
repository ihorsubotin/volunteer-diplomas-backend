import { Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActivityCategory } from "./activity-category.entity";
import { User } from "./user.entity";

@Entity()
export class Contractor{
    @PrimaryGeneratedColumn()
	id: number;

    @OneToOne(type=>User,  user=>user.contractor, {nullable: false})
	user: User;

    @ManyToMany(type=>ActivityCategory)
	@JoinTable()
	activities: ActivityCategory[];
}