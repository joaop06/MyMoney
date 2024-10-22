import { ParsedQs } from 'qs';
import { FindOptionsDto } from 'dtos/find.dto';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FindOptionsMiddleware<T> implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            req.query = new FindOptionsDto<T>(req.query) as unknown as ParsedQs;
            next();

        } catch (e) {
            next(e);
        }
    }
}