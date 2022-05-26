import { IsEmail, IsString } from 'class-validator';

export class RegisterDTO {
	@IsEmail()
	login: string;
	@IsString({ message: 'Password is not a string' })
	password: string;
	@IsString({ message: 'Name is not a string' })
	name: string;
}
