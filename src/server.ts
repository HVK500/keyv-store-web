import validateEnv from './utils/validate-env';
validateEnv();

import App from './app';
import DbRoute from './routes/db-route';
import ConnectionService from './services/connection-service';

// tslint:disable-next-line: no-floating-promises
ConnectionService.ping()
  .then(() => {
    const app = new App([
      new DbRoute()
    ]);

    app.listen();
  })
  .catch((err) => {
    throw new Error(err);
  });
