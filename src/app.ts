import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import { Server } from 'http';
import { json } from 'body-parser';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	private app: Express;
	private server: Server;
	private port: number;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILogger,
		@inject(TYPES.UserController) private usersController: UsersController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	private useMiddleware() {
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
		this.app.use(json());
	}

	private useRoutes() {
		this.app.use('/users', this.usersController.router);
	}

	private useExeptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log('Good day');
	}
}
