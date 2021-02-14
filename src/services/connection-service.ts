import Keyv from 'keyv';
import LRUCache from 'lru-cache';
import { envValue } from '../utils/validate-env';
import { log } from './logger-service';

export default class ConnectionService {
  readonly defaultNamespace = 'root';
  private connectionString: string;
  private storeOptions: object = {};
  private pool: LRUCache<string, Keyv<string>>;

  constructor() {
    let maxAgeSeconds = 300;
    let max = Infinity;

    this.connectionString = envValue<string>('CONN_STRING');

    if (this.connectionString) {
      maxAgeSeconds = envValue<number>('MAX_CONN_AGE');
      max = envValue<number>('MAX_CONN');
      this.storeOptions = envValue<object>('STORE_OPTS');
    } else {
      log.info('No connection string configured, using memory-map mode.');
    }

    this.pool = new LRUCache({
      maxAge: (maxAgeSeconds * 1000), // Calc milliseconds value
      max: max
    });
  }

  async get(namespace = this.defaultNamespace): Promise<Keyv> {
    if (!this.pool.has(namespace)) {
      log.debug(`No cached connection found in pool for namespace '${namespace}'.`);
      return this.connect(namespace);
    }

    log.debug(`Fetching cached connection for namespace '${namespace}'.`);
    return this.pool.get(namespace);
  }

  private connect(namespace: string): Keyv<string> {
    log.debug(`Creating connection in pool using namespace '${namespace}'.`);
    const conn = new Keyv<string>(
      this.connectionString,
      Object.assign(
        { namespace: namespace },
        this.storeOptions
      )
    ).on('error', (err) => {
      log.error(err);
    });

    this.pool.set(namespace, conn);

    return conn;
  }

  static async ping(): Promise<void> {
    return new Promise((succeed, fail) => {
      const connString = envValue<string>('CONN_STRING');
      if (!connString) {
        succeed();
        return;
      }

      let active = false;
      let count = -1;
      const cancelToken = setInterval(() => {
        if (active) return;
        active = true;
        count++;
        new Promise<void>((trySuccess, tryFailure): void => {
          log.debug(`${count > 0 ? `Retrying [${count}]` : 'Attempting'} DB connection...`);
          // tslint:disable-next-line: no-unused-expression
          let conn = new Keyv<string>({
            uri: connString,
            namespace: '_'
          }).on('error', (err) => {
            conn = null;
            active = false;
            tryFailure(err);
          });

          conn.get('_')
            .then(() => {
              trySuccess();
            })
            .catch((err) => {
              tryFailure(err);
            });
        })
        .then(() => {
          log.debug('Connection established...');
          succeed();
        })
        .catch((err) => {
          active = false;
          if (count === 5) {
            clearInterval(cancelToken);
            log.error(`Connection failed - ${err}`);
            fail(err);
          }
        });
      }, 1000);
    });
  }
}
