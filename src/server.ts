import validateEnv from './utils/validate-env';
validateEnv();

import App from './app';
import DbRoute from './routes/db-route';

const app = new App([
  new DbRoute()
]);

app.listen();
