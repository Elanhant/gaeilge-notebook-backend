import { NextFunction, Request, Response, Router } from 'express';
import { IModel } from '../models/model';

export class BaseRoute {
    public model: IModel;

    public static create(router: Router, model: IModel) {

    }

    constructor(model: IModel) {
        this.model = model;
    }

    public index(req: Request, res: Response, next: NextFunction) {
        next();
    }
}
