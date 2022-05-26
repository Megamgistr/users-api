import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
	@IsEmail()
	login: string;
	@IsString({ message: 'Password is not a string' })
	password: string;
}
