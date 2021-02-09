import 'dotenv/config';
import App from './app';
import DbRoute from './routes/db-route';
import validateEnv from './utils/validate-env';

validateEnv();

const app = new App([
  new DbRoute()
]);

app.listen();
