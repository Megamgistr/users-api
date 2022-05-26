import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.logger.log('Successful database connection');
		} catch (e) {
			this.logger.error('Not successful database connection');
		}
	}

	async disconnect() {
		try {
			await this.client.$disconnect();
			this.logger.log('Successful database disconnection');
		} catch (e) {
			this.logger.error('Not uccessful database disconnection');
		}
	}
}
