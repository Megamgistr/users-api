import { UserModel } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

export interface IUserService {
	createUser: (dto: RegisterDTO) => Promise<UserModel | null>;
	isValidUser: (dto: LoginDTO) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
