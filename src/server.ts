import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');
import mongoose = require('mongoose');

import { WordsRoute } from './routes/words';
import { IWord } from './interfaces/word';
import { IModel } from './models/model';
import { IWordModel } from './models/word';
import { wordSchema } from './schemas/word';

export class Server {
  public app: express.Application;

  private model: IModel;

  public static bootstrap(): Server {
      return new Server();
  }

  constructor() {
      this.app = express();

      this.model = Object();

      this.config();

      this.routes();

      this.api();
  }

  public api() {

  }

  public config() {
      const MONGODB_CONNECTION: string = 'mongodb://localhost:27017/gaeilge';

      // Add static paths
      this.app.use(express.static(path.join(__dirname, 'public')));

      // Configure pug
      this.app.set('views', path.join(__dirname, 'views'));
      this.app.set('view engine', 'pug');

      // Logger middleware
      // TODO: Only for dev env
      this.app.use(logger('dev'));

      // Use json parser middleware
      this.app.use(bodyParser.json());

      // Use query string parser middleware
      this.app.use(bodyParser.urlencoded({
          extended: true
      }));

      // Use cookie parser middleware
      this.app.use(cookieParser());

      // Use override middleware
      this.app.use(methodOverride());

      // Use q promises
      global.Promise = require("q").Promise;
      mongoose.Promise = global.Promise;

      // Connect to mongoose
      let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

      // Create models
      this.model.word = connection.model<IWordModel>('Word', wordSchema);

      // Catch 404 and forward to error handler
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        err.status = 404;
        next(err);
      });

      // Error handling
      this.app.use(errorHandler());
  }

  private routes() {
    let router: express.Router;
    router = express.Router();

    WordsRoute.create(router, this.model);

    this.app.use(router);
  }
}
