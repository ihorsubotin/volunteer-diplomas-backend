import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Volunteer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	organizationName: string;

	@Column({default: false})
	validated: boolean;

	@OneToOne(type=>User, (user)=> user.volunteer, {nullable: false})
	user: User;
}
