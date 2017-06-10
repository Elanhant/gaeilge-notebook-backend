import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');
import { WordsRoute } from './routes/words';

export class Server {
  public app: express.Application;

  public static bootstrap(): Server {
      return new Server();
  }

  constructor() {
      this.app = express();

      this.config();

      this.routes();

      this.api();
  }

  public api() {

  }

  public config() {
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

    WordsRoute.create(router);

    this.app.use(router);
  }
}
