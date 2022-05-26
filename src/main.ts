import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExpetionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<UsersController>(TYPES.UserController).to(UsersController).inSingletonScope();
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExpetionFilter).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersRepository>(TYPES.IUserRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

async function bootstrap() {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const application = appContainer.get<App>(TYPES.Application);
	await application.init();
	return { appContainer, application };
}

bootstrap();
