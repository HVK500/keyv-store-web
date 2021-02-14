import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import Routes from './interfaces/routes-interface';
import apikeyMiddleware from './middlewares/apikey-middleware';
import errorMiddleware from './middlewares/error-middleware';
import { httpMiddleware, log  } from './services/logger-service';
import { envValue } from './utils/validate-env';

export default class App {
  app: express.Application;
  port: number;
  loggingEnabled: boolean;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = envValue<number>('PORT');
    this.loggingEnabled = envValue<string>('LOG_LEVEL') !== 'silent';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen(): void {
    this.app.listen(this.port, () => {
      log.info(`Keyv Store listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares(): void {
    if (envValue<boolean>('isProduction')) {
      this.app.use(hpp());
      this.app.use(helmet());

      if (envValue<string>('API_KEY')) {
        this.app.use(apikeyMiddleware);
      } else {
        log.warn('API key not set, proceeding without API key middleware.');
      }
    }

    if (this.loggingEnabled) {
      this.app.use(httpMiddleware);
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]): void {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });

    if (envValue<boolean>('EXPOSE_SWAGGER')) {
      this.initializeSwagger();
    }
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
    log.info('Exposed Swagger API docs.');
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}
