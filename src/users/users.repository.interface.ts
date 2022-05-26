import { UserModel } from '@prisma/client';
import { User } from './entities/user.entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (login: string) => Promise<UserModel | null>;
}
