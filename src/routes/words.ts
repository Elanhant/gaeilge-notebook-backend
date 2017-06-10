import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

export class WordsRoute extends BaseRoute {

    public static create(router: Router) {
        console.log("[WordsRoute::create] Creating words route.");

        router.get('/words', (req: Request, res: Response, next: NextFunction) => {
            new WordsRoute().index(req, res, next);
        });
    }

    constructor() {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction) {
        res.json(['ithim', 'siad']);
    }
}
