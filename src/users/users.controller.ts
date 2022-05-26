import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { BaseController } from '../common/base.controller';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { IUserService } from './user.service.interface';
import { HTTPError } from '../errors/http-error';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class UsersController extends BaseController {
	constructor(
		@inject(TYPES.ILoggerService) logger: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(RegisterDTO)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(LoginDTO)],
			},
			{
				path: '/ingo',
				method: 'get',
				func: this.info,
				middlewares: [new GuardMiddleware()],
			},
		]);
	}
	public async register({ body }: Request<{}, {}, RegisterDTO>, res: Response, next: NextFunction) {
		const user = await this.userService.createUser(body);
		if (!user) {
			return next(new HTTPError(422, 'This user alredy exist'));
		}
		this.ok(res, user);
	}

	public async login({ body }: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction) {
		const isValid = await this.userService.isValidUser(body);
		if (isValid) {
			const jwt = await this.signJWT(body.login, this.configService.get('SECRET'));
			this.ok(res, { jwt });
		} else {
			return next(new HTTPError(400, 'User is not exist'));
		}
	}

	public async info({ user }: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction) {
		const result = await this.userService.getUserInfo(user);
		this.ok(res, result);
	}

	private signJWT(email: string, secret: string) {
		return new Promise((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					} else {
						res(token as string);
					}
				},
			);
		});
	}
}
