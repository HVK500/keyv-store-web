import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from 'morgan';
import Routes from './interfaces/routes-interface';
import apikeyMiddleware from './middlewares/apikey-middleware';
import errorMiddleware from './middlewares/error-middleware';
import { getLogWriteStream } from './utils/util';
import { envValue } from './utils/validate-env';

export default class App {
  app: express.Application;
  port: number;
  corsWhitelist: string[];
  env: boolean;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = envValue<boolean>('isProduction');
    this.port = envValue('PORT');
    this.corsWhitelist = envValue<string[]>('CORS_ORIGINS');

    if (envValue<boolean>('EXPOSE_SWAGGER')) {
      this.initializeSwagger();
    }

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares(): void {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(apikeyMiddleware);
      this.app.use(logger('combined', {
        stream: envValue<boolean>('LOG_FILE') ? getLogWriteStream() : undefined
      }));
    } else {
      this.app.use(logger('dev'));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]): void {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger(): void {
    // tslint:disable-next-line: no-require-imports
    const swaggerJSDoc = require('swagger-jsdoc');
    // tslint:disable-next-line: no-require-imports
    const swaggerUi = require('swagger-ui-express');
    // tslint:disable-next-line: no-require-imports
    const options = require('../swagger-options.json');
    // tslint:disable-next-line: no-require-imports
    options.version = require('../package.json').version;

    const specs = swaggerJSDoc(options);
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}
