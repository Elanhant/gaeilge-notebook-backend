import { NextFunction, Request, Response, Router } from 'express';

export class BaseRoute {
    public static create(router: Router) {

    }

    constructor() {
    }

    public index(req: Request, res: Response, next: NextFunction) {
        next();
    }
}
