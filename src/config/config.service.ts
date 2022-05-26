import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILoggerService) private logger: ILogger) {
		const result = config();
		if (result.error) {
			logger.error(result.error);
		} else {
			logger.log('Config is ready');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string) {
		return this.config[key];
	}
}
