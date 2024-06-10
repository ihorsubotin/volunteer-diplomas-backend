import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ActivityCategory } from "./activity-category.entity";

@Entity()
export class Volunteer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	organizationName: string;

	@Column({default: false})
	validated: boolean;

	@Column()
	isSolo: boolean;

	@OneToOne(type=>User, (user)=> user.volunteer, {nullable: false})
	user: User;

	@ManyToMany(type=>ActivityCategory)
	@JoinTable()
	activity: ActivityCategory[];
}
