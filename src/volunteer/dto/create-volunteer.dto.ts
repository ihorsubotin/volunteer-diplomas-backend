import { IsNotEmpty } from "class-validator";

export class CreateVolunteerDto {
	@IsNotEmpty()
	organizationName: string;
}
