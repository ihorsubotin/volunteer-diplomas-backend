import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ActivityCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;
}