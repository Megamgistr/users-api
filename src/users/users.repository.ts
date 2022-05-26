import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './entities/user.entity';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email: login, password, name }: User) {
		return this.prismaService.client.userModel.create({
			data: {
				login,
				password,
				name,
			},
		});
	}

	async find(login: string) {
		return this.prismaService.client.userModel.findFirst({
			where: {
				login,
			},
		});
	}
}
