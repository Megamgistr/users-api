import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error';
import 'reflect-metadata';

@injectable()
export class ExpetionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILoggerService) private logger: ILogger) {}
	public catch(err: HTTPError, req: Request, res: Response, next: NextFunction) {
		this.logger.error(err.message);
		res.status(err.statusCode).send(err.message);
	}
}
