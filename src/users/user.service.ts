import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { User } from './entities/user.entity';
import { IUserService } from './user.service.interface';
import { UsersRepository } from './users.repository';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepository) private userRepository: UsersRepository,
	) {}

	async createUser({ login, name, password }: RegisterDTO) {
		const model = await this.userRepository.find(login);
		if (model == null) {
			const user = new User(login, name);
			const salt = this.configService.get('SALT');
			await user.setPassword(password, Number(salt));
			return await this.userRepository.create(user);
		}
		return null;
	}

	async isValidUser({ login, password }: LoginDTO) {
		const model = await this.userRepository.find(login);
		if (model != null) {
			const user = new User(model.login, model.name, model.password);
			return await user.isPasswordValid(password);
		}
		return false;
	}

	async getUserInfo(email: string) {
		return this.userRepository.find(email);
	}
}
