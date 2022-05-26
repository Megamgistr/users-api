import { NextFunction, Request, Response } from 'express';
import { HTTPError } from './http-error';
import 'reflect-metadata';

export interface IExeptionFilter {
	catch: (err: HTTPError, req: Request, res: Response, next: NextFunction) => void;
}
