import { Response, Router } from 'express';
import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router() {
		return this._router;
	}

	private send<T>(res: Response, code: number, message: T) {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T) {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]) {
		for (const route of routes) {
			const handler = route.func.bind(this);
			const middlewares = route.middlewares?.map((e) => e.execute.bind(e));
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this._router[route.method](route.path, pipeline);
			this.logger.log(`${route.method}: ${route.path} - BINDED SUCCESS`);
		}
	}
}
