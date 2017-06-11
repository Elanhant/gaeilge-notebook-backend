import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { IModel } from '../models/model';
import { IWord } from '../interfaces/word';

export class WordsRoute extends BaseRoute {

    public static create(router: Router, model: IModel) {
        console.log("[WordsRoute::create] Creating words route.");

        router.get('/api/words', (req: Request, res: Response, next: NextFunction) => {
            new WordsRoute(model).index(req, res, next);
        });
        router.post('/api/words', (req: Request, res: Response, next: NextFunction) => {
            new WordsRoute(model).save(req, res, next);
        });
    }

    public index(req: Request, res: Response, next: NextFunction) {
        const data = [
            {
                root: 'ith',
                definition: 'eat',
                translations: ['eat'],
                derivatives: ['ithim', 'itheann', 'd\'ith']
            },
            {
                root: 'siad',
                definition: 'they',
                translations: ['they'],
                derivatives: []
            }
        ];

        this.model.word.find({}, (err, docs) => {
            if (err) {
               res.status(500);
               res.type('application/json');
               res.json();
               return next(res);
            }

            res.status(200);
            res.type('application/json');
            return next(res.json(docs));
        });
    }

    public save(req: Request, res: Response, next: NextFunction) {
        const wordData: IWord = req.body;

        let errors = new ResponseError();

        if (!wordData.root) {
            errors.addError('root', 'Root is required', wordData.root);
        }

        const Word = this.model.word;

        if (errors.hasErrors()) {
            res.status(422);
            res.type('application/json');
            return res.json(errors.toObject());
        }

        const word = new Word(wordData);

        word
            .save()
            .then( result => {
                res.status(201);
                res.type('application/json');
                res.json(result);
            })
            .catch( error => {
                if (error.code === 11000) {
                    errors.addError('root', 'Root must be unique', wordData.root);
                    res.status(422);
                    res.type('application/json');
                    return res.json(errors.toObject());
                } else {
                    res.status(500);
                    res.type('application/json');
                    return res.json();
                }
            });
    }
}

export interface IResponseErrorData {
    field: string;
    message: string;
    rejectedValue?: string | number;
}

export interface IResponseError {
    fields: Array<string>;
    errorData: {
        [fieldName: string]: IResponseErrorData
    }
}

export class ResponseError {

    private _hasErrors: boolean;

    private _fields: Array<string>;
    private _errorData: {
        [fieldName: string]: IResponseErrorData
    };

    constructor() {
        this._hasErrors = false;
        this._fields = [];
        this._errorData = {};
    }

    public addError(field: string, message: string, rejectedValue?: string | number) {
        if (this._fields.indexOf(field) === -1) {
            this._fields.push(field);
        }

        this._errorData[field] = {
            field,
            message,
            rejectedValue
        };

        this._hasErrors = true;
    }

    public hasErrors(): boolean {
        return this._hasErrors;
    }

    public toObject(): IResponseError {
        return {
            fields: this._fields,
            errorData: this._errorData
        };
    }
}
